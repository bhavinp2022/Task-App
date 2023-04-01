import React, {useState, useCallback} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "../api/axios";
import {useSnackbar} from "notistack";

export default function DeleteWarningAlertDialog(
  {
    open,
    toggle,
    taskId,
    refetch
  }
) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteTask = useCallback((e) => {
    e?.preventDefault();
    axios
      .delete(`/tasks/${taskId}`)
      .then((response) => response.data)
      .then((response) => {
        refetch && refetch()
        setLoading(false)
        toggle();
      })
      .catch((err) => {
        console.log("error: " + err);
        setLoading(false)
        enqueueSnackbar(err?.message, {variant: "error"});
      });
  }, [taskId])

  return (
    <div>
      <Dialog
        open={open}
        onClose={toggle}
      >
        <DialogTitle>
          {"Delete?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={toggle}>Cancel</Button>
          <LoadingButton onClick={deleteTask}>
            Yes, Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}