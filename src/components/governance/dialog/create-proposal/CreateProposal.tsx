import { BigNumber } from '@0x/utils';
import { Button, CircularProgress, Dialog, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/system';
import classNames from 'classnames/bind';
import MarkdownIt from 'markdown-it';
import { useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useDispatch } from 'react-redux';
import { getProposalList } from '../../../../apis/apis';
import axiosInstance from '../../../../config/config';
import { VALIDATE_ONLY_NUMBER_ALPHABETS } from '../../../../constant/constants';
import { currentAddress, encodeParameters, getArgs } from '../../../../helpers/common';
import { isConnected } from '../../../../helpers/connectWallet';
import { governance } from '../../../../helpers/ContractService';
import { SFormData } from '../../../../interfaces/SFormData';
import { useAppSelector } from '../../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';
import StakeInputBase from '../../../base/input/StakeInputBase';
import { setOpenCreateProposalDialog } from '../../redux/Governance';
import CollapseItem from '../collapse/Collapse';
import styles from './CreateProposal.module.scss';

interface TextBinding {
  html: any;
  text: string;
}

const cx = classNames.bind(styles);
const mdParser = new MarkdownIt();
const CreateProposal: React.FC = () => {
  const dispatch = useDispatch();
  const currentAccount = useAppSelector((state) => state.wallet);
  const [maxOperation, setMaxOperation] = useState(0);
  const [description, setDescription] = useState('');
  const theme = useAppSelector((state) => state.theme.themeMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [title, setTitle] = useState('');
  const [triggerAlert, setTriggerAlert] = useState(false);
  const wallet = useAppSelector((state) => state.wallet);
  const [errorFromChild, setErrorFromChild] = useState(false);
  const [formData, setFormData] = useState<SFormData[]>([
    {
      isRemove: false,
      targetAddress: '',
      value: [],
      signature: '',
      callData: []
    }
  ]);

  const openDialog = useAppSelector((state) => state.governance.openCreateProposalDialog);
  const handleCloseConnectDialog = () => {
    dispatch(setOpenCreateProposalDialog(false));
    setFormData([
      {
        isRemove: false,
        targetAddress: '',
        value: [],
        signature: '',
        callData: []
      }
    ]);
    setDescription('');
    setErrorMsg('');
  };
  const handleErrorFromChild = (param: boolean) => {
    setErrorFromChild(param);
  }
  const handleClickConfirm = async () => {
    // ================= check required input form =================

    setErrorMsg('');
    setTriggerAlert((prev) => !prev);
    let isFulfilledInput = true;
    if (title.trim().length === 0) {
      isFulfilledInput = false;
    }

    // check form data (action input forms)
    for (const data of formData) {
      if (data.isRemove !== true) {
        if (data.targetAddress.trim().length === 0 || data.signature.trim().length === 0) {
          isFulfilledInput = false;
          break;
        }
      }
    }

    if (description.trim().length === 0) {
      setErrorMsg('Description is required');
      isFulfilledInput = false;
    }

    if (!isFulfilledInput) return;
    
    if (errorFromChild) return;

    // =============== end check input form ==================

    const targetAddresses = [];
    const values = [];
    const signatures = [];
    const callDatas = [];

    try {
      for (let i = 0; i < formData.length; i += 1) {
        if (formData[i].isRemove !== true) {
          const callDataValues = [];
          let callDataTypes = [];
          targetAddresses.push(formData[i]['targetAddress']);
          values.push(0); // Web3.utils.toWei(formValues[`value${i}`], 'ether')
          signatures.push(formData[i]['signature']);
          callDataTypes = getArgs(formData[i]['signature']);
          for (let j = 0; j < formData[i].callData.length; j += 1) {
            if (callDataTypes[j].toLowerCase() === 'bool') {
              callDataValues.push(formData[i].callData[j].toLowerCase() === 'true');
            } else {
              callDataValues.push(formData[i].callData[j]);
            }
          }
          callDatas.push(encodeParameters(callDataTypes, callDataValues));
        }
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          message: 'Proposal parameters are invalid!',
          variant: SnackbarVariant.ERROR
        })
      );
      return;
    }
    setIsLoading(true);
    const governanceContract = await governance();
    try {
      const responseCreate = await governanceContract.propose(
        targetAddresses,
        values,
        signatures,
        callDatas,
        description
      );
      const res = await responseCreate.wait();

      if (res) {
        const response = res.events[0].args;
        const proposalId = Number(response.id.toString());
        const proposalState = await governanceContract.state(proposalId);
        // call API create proposal in DB
        const options = {
          baseUrl: process.env.REACT_APP_BACKEND
        };
        const body = {
          proposalId: proposalId,
          title: title,
          description: description,
          values: values,
          signatures: signatures,
          callDatas: callDatas,
          targets: targetAddresses,
          proposer: currentAddress(currentAccount),
          startBlock: Number(response.startBlock.toString()),
          endBlock: Number(response.endBlock.toString()),
          createdBlock: res.blockNumber,
          createdTxHash: res.transactionHash,
          state: proposalState
        };
        await axiosInstance(options)
          .post('/proposal', body)
          .then((res) => console.log('[API]: RESPONSE: ', res))
          .catch((err) => console.log('[API]: ERROR: ', err));
        setIsLoading(false);
        dispatch(setOpenCreateProposalDialog(false));
        dispatch(
          openSnackbar({
            message: 'Create proposal successfully!',
            variant: SnackbarVariant.SUCCESS
          })
        );
        dispatch(getProposalList({ page: 1, limit: 5 }));
      }
    } catch (error: any) {
      if (error.code === 4001) {
        dispatch(
          openSnackbar({ message: 'User denied transaction!', variant: SnackbarVariant.ERROR })
        );
      }
      setIsLoading(false);
    } finally {
      handleCloseConnectDialog();
    }
  };
  const getMaxOperation = async () => {
    try {
      const voteContract = await governance();
      const maxOperation = await voteContract.proposalMaxOperations();
      setMaxOperation(maxOperation.toString());
    } catch (err) {
      console.log('getMaxOperation', err);
    }
  };

  const handleEditorChange = (text: TextBinding) => {
    setDescription(text.text);
  };

  const childUpdateFormData = (newFormData: SFormData[]) => {
    setFormData([...JSON.parse(JSON.stringify(newFormData))]);
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  useEffect(() => {
    if (currentAccount.ethereumAddress) {
      getMaxOperation();
    }
  }, [currentAccount.ethereumAddress]);

  useEffect(() => {
    setDescription('');
    setTitle('');
  }, [wallet]);

  let collapseIndex = -1;
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseConnectDialog}
      fullWidth={true}
      maxWidth={'md'}
      disableEscapeKeyDown={true}
      PaperProps={{
        style: {
          backgroundColor: 'var(--background-dialog-color)',
          padding: '25px',
          borderRadius: '20px'
        }
      }}>
      {/* header: title + btn close */}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
          marginBottom: '20px'
        }}>
        <Typography component={'div'} className={cx('title')}>
          <Box>
            <div className={cx('text-title')}>Create Proposal</div>
          </Box>
        </Typography>
        <Typography component={'div'}>
          <IconButton
            onClick={handleCloseConnectDialog}
            size={'small'}
            className={cx('close-button')}>
            <CloseIcon />
          </IconButton>
        </Typography>
      </Box>
      <Box>
        {maxOperation && (
          <div className={cx('title-maxoperation')}>
            You can add {maxOperation} actions as maximum
          </div>
        )}
      </Box>
      <Box>
        <div className={cx('body-proposal')}>
          <div className={cx('left-popup')}>
            <div className={cx('sub-title-text')}>Proposal Description</div>
            <div className={cx('box-title')}>Title</div>
            <div className={cx('div-input')}>
              <StakeInputBase
                onChange={handleChangeTitle}
                validate={true}
                name={'Title'}
                triggerAlert={triggerAlert}
                regexValidate={{regexRole: VALIDATE_ONLY_NUMBER_ALPHABETS, message: 'Only number and alphabets!'}}
                errorFromChild={handleErrorFromChild}
              />
            </div>
            <div className={cx('box-title')}>Details</div>
            <div className={cx('div-input')}>
              <MdEditor
                value={description}
                style={{
                  height: '300px',
                  borderRadius: '15px'
                }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />
              {errorMsg && <p className={cx('details-error-message')}>{errorMsg}</p>}
            </div>
          </div>
          <div className={cx('right-popup')}>
            <div className={cx('sub-title-text', 'sub-title-action')}>Actions</div>
            <div className={cx(`card-style`, `${theme === 'dark' ? 'card-style-border' : ''}`)}>
              {formData.map((f, index) => {
                if (!f.isRemove) {
                  collapseIndex += 1;
                  return (
                    <div key={index}>
                      <CollapseItem
                        collapseIndex={collapseIndex}
                        index={index}
                        formData={formData}
                        maxOperation={maxOperation}
                        fCallData={f.callData}
                        setFormData={childUpdateFormData}
                        triggerAlert={triggerAlert}
                        errorFromChild={handleErrorFromChild}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </Box>
      {/* footer: btn confirm */}
      <Box
        sx={{
          margin: '10px 0',
          paddingRight: '10px'
        }}>
        <div className={cx('wrap-btn')}>
          {/* <div className={cx('btn-confirm')} onClick={handleClickConfirm}>
            Confirm
          </div> */}
          <Button
            className={cx('btn-create')}
            // disabled={isLoading || formData.length > maxOperation || description.trim().length === 0}
            onClick={handleClickConfirm}>
            {isLoading && (
              <div>
                <CircularProgress size={20} color="inherit" />
                <span className={cx('btn-create-inloading')}>Create Proposal</span>
              </div>
            )}
            {!isLoading && 'Create Proposal'}
          </Button>
        </div>
      </Box>
    </Dialog>
  );
};
export default CreateProposal;
