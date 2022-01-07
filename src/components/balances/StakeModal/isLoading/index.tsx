import React from 'react';
import { CircularProgress, DialogContent, DialogActions, Button } from '@mui/material';

const isLoading = () => {
  return (
    <React.Fragment>
      <DialogContent>
        <CircularProgress />
      </DialogContent>
      <DialogActions>
        <Button>pending</Button>
        <Button>confirmation</Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default isLoading;
