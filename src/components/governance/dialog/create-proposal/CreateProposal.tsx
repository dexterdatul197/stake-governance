import { Dialog, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/system';
import classNames from 'classnames/bind';
import MarkdownIt from 'markdown-it';
import { useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useDispatch } from 'react-redux';
import { governance } from '../../../../helpers/ContractService';
import { SFormData } from '../../../../interfaces/SFormData';
import { useAppSelector } from '../../../../store/hooks';
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
  const [formData, setFormData] = useState<SFormData[]>([
    {
      targetAddress: '',
      value: '',
      signature: '',
      callData: [],
    },
  ]);
  const openDialog = useAppSelector(
    (state) => state.governance.openCreateProposalDialog
  );
  const handleCloseConnectDialog = () => {
    dispatch(setOpenCreateProposalDialog(false));
  };
  const handleClickConfirm = () => {
    dispatch(setOpenCreateProposalDialog(false));
  };
  const getMaxOperation = async () => {
    const voteContract = governance();
    const maxOperation = await voteContract.methods
      .proposalMaxOperations()
      .call();
    setMaxOperation(maxOperation);
  };

  const handleEditorChange = (text: TextBinding) => {
    setDescription(text.text);
  };

  useEffect(() => {
    getMaxOperation();
  }, [currentAccount]);

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
        },
      }}
    >
      {/* header: title + btn close */}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
          marginBottom: '20px',
        }}
      >
        <Typography component={'div'} className={cx('title')}>
          <Box>
            <div className={cx('text-title')}>Create Proposal</div>
          </Box>
        </Typography>
        <Typography component={'div'}>
          <IconButton
            onClick={handleCloseConnectDialog}
            size={'small'}
            className={cx('close-button')}
          >
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
              <StakeInputBase />
            </div>
            <div className={cx('box-title')}>Details</div>
            <div className={cx('div-input')}>
              <MdEditor
                value={description}
                style={{ height: '200px' }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />

            </div>
          </div>
          <div className={cx('right-popup')}>
            <div className={cx('sub-title-text', 'sub-title-action')}>Actions</div>
            <div className={cx(`card-style`,  `${theme === 'dark' ? 'card-style-border' : ''}`)}>
              {/* foreach here */}
              {formData.map((f, index) => {
                return <CollapseItem 
                        index={index} 
                        formData={formData} 
                        maxOperation={maxOperation}
                      />
              })}
            </div>
          </div>
        </div>
      </Box>
      {/* footer: btn confirm */}
      <Box
        sx={{
          margin: '10px 0',
          paddingRight: '10px',
        }}
      >
        <div className={cx('wrap-btn')}>
          <div className={cx('btn-confirm')} onClick={handleClickConfirm}>Confirm</div>
        </div>
      </Box>
    </Dialog>
  );
};
export default CreateProposal;
