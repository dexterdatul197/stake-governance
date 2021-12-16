import { Dialog, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/system';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../store/hooks';
import { setOpenCreateProposalDialog } from '../../redux/Governance';
import styles from './CreateProposal.module.scss';

const cx = classNames.bind(styles);

const CreateProposal: React.FC = () => {
  const dispatch = useDispatch();
  const openDialog = useAppSelector(
    (state) => state.governance.openCreateProposalDialog
  );
  const handleCloseConnectDialog = () => {
    dispatch(setOpenCreateProposalDialog(false));
  };
  const handleClickConfirm = () => {
    dispatch(setOpenCreateProposalDialog(false));
  }
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseConnectDialog}
      fullWidth={true}
      maxWidth={'xs'}
      disableEscapeKeyDown={true}
      PaperProps={{
        style: {
          backgroundColor: 'var(--background-dialog-color)',
          padding: '25px'
        }
      }}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
            marginBottom: '20px'
        }}
      >
        <Typography component={'div'} className={cx('title')}>
          <Box>
            <div className={cx('text-title')}>
              Create Proposal
            </div>
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
      <Box sx={{
          margin: '10px 0'
      }}>
        <div className={cx('box-title')} >Title</div>
        <div className={cx('div-input')} >
            <input type="text" name="" id="" className={cx('input-style')} />
        </div>
      </Box>
      <Box sx={{
          margin: '10px 0'
      }}>
        <div className={cx('box-title')} >Details</div>
        <div className={cx('div-input')} >
            <textarea name="" id="" cols={50} rows={10} className={cx('input-style', 'text-area-style')}></textarea>
        </div>
      </Box>
      <Box sx={{
          margin: '10px 0'
      }}>
        <div className={cx('box-title')} >Address</div>
        <div className={cx('div-input')} >
            <input type="text" name="" id="" className={cx('input-style')} />
        </div>
      </Box>
      <Box sx={{
          margin: '10px 0'
      }}>
        <div className={cx('box-title')} >Signature</div>
        <div className={cx('div-input')} >
            <input type="text" name="" id="" className={cx('input-style')} />
        </div>
      </Box>
      <Box sx={{
          margin: '10px 0'
      }}>
        <div className={cx('box-title')} >Params</div>
        <div className={cx('div-input')} >
            <input type="text" name="" id="" className={cx('input-style')} />
        </div>
      </Box>
      <Box sx={{
          margin: '10px 0',
          paddingRight: '10px'
      }}>
        <button 
            className={cx('btn-confirm')} 
            onClick={handleClickConfirm}
        >Confirm</button>
      </Box>
      
    </Dialog>
  );
};
export default CreateProposal;
