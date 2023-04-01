import React, {useState, useEffect, useCallback} from "react";
import {Button, Grid, TextareaAutosize, TextField} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import * as yup from "yup";
import {useFormik} from "formik";
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "../api/axios";
import {USER_STORE_KEY} from "../constants/localstorage";
import _ from "lodash";
import {useSnackbar} from "notistack";

const validationSchema = yup.object({
  taskName: yup.string().required("Required"),
  description: yup.string().required("Required"),
});

function TaskFormDialog(
  {
    open,
    toggle,
    operationMode,
    dataToEdit,
    refetch
  }
) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');

  useEffect(() => {
    setDialogTitle(`${operationMode === "add" ? "Add new" : "Edit"} task`)
  }, [open])

  const submit = ({taskName, description}) => {
    setLoading(true)
    axios
      .post("/tasks", JSON.stringify({taskName, description}), {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
      })
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
  }

  const formik = useFormik({
    initialValues: {
      taskName: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: submit,

  });

  useEffect(() => {
    if (operationMode === "add") {
      formik.resetForm({
        taskName: "",
        description: "",
      })
    } else {
      formik.resetForm({
        taskName: dataToEdit?.taskName || "",
        description: dataToEdit?.description || "",
      })
    }
  }, [open])

  return (
    <Dialog
      fullWidth={"sm"}
      open={open}
      onClose={toggle}
    >
      <form onSubmit={formik.handleSubmit}>

        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{marginTop: 0.25}}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="taskName"
                name="taskName"
                label="Task Title"
                value={formik.values.taskName}
                onChange={formik.handleChange}
                error={formik.touched.taskName && Boolean(formik.errors.taskName)}
                helperText={formik.touched.taskName && formik.errors.taskName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                id="description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={toggle}>Cancel</Button>
          <LoadingButton type="submit" loading={loading}>Save</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskFormDialog;