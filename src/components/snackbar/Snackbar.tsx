import React from 'react';
import { Fade } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeSnackbar } from '../../store/snackbar';
import { RootState } from '../../store/store';
import './Snackbar.scss';

const CustomSnackbar: React.FC = () => {
  const snackbar = useAppSelector((state: RootState) => state.snackbar);
  const dispatch = useAppDispatch();
  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.isOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <div className={`snackbar color-${snackbar.variant}`}>{snackbar.message}</div>
      </Snackbar>
    </div>
  );
};

export default CustomSnackbar;
