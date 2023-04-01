import React, {useState, useEffect, useCallback} from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import {useSnackbar} from 'notistack';

import './style.css';
import TaskItem from "../../components/TaskItem";
import axios from "../../api/axios";
import {USER_STORE_KEY} from "../../constants/localstorage";
import TaskFormDialog from "../../components/TaskFormDialog";
import _ from "lodash";
import DeleteWarningAlertDialog from "../../components/DeleteWarningAlertDialog";

function Home() {
  const {enqueueSnackbar} = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [taskFormDialogOpen, setTaskFormDialogOpen] = useState(false);
  const [taskFormDialogOperationMode, setTaskFormDialogOperationMode] = useState("add");
  const [taskDataToEdit, setTaskDataToEdit] = useState(null);

  const toggleTaskFormDialog = (e, operationMode = "add", taskData = null) => {
    e?.preventDefault();
    setTaskFormDialogOpen(prev => !prev);
    setTaskFormDialogOperationMode(operationMode);
    setTaskDataToEdit(taskData);
  }

  const [taskDeleteWarningDialogOpen, setTaskDeleteWarningDialogOpen] = useState(false);
  const [taskToBeDeleted, setTaskToBeDeleted] = useState(null);

  const toggleTaskDeleteWarningDialog = (e, taskId = null) => {
    e?.preventDefault();
    setTaskDeleteWarningDialogOpen(prev => !prev);
    setTaskToBeDeleted(taskId)
  }

  const fetchTasks = () => {
    axios.get("/tasks")
      .then((response) => response.data)
      .then((response) => {
        setTasks(response)
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(err?.message, {variant: "error"});
      });
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  const delayedRefetchXHR = useCallback(_.debounce(() => fetchTasks(), 619), []);

  return <Container className="list__container" component="main" maxWidth="xs">

    <Grid
      container
      spacing={2}
      sx={{
        marginTop: 8
      }}
    >
      <Grid item xs={12}>
        <Box justifyContent="space-between" sx={{display: "flex"}}>
          <Typography variant="h5">
            Tasks List
          </Typography>
          <IconButton onClick={toggleTaskFormDialog}>
            <AddIcon/>
          </IconButton>
        </Box>
      </Grid>

      {
        tasks && tasks.length > 0 ? tasks.map((task, index) => (
          <Grid item xs={12} key={task.id}>
            <TaskItem
              deleteTask={toggleTaskDeleteWarningDialog}
              refetch={delayedRefetchXHR}
              {...task}
            />
          </Grid>
        )) : <Grid item xs={12}>
          <Box block align="center">
            <Typography variant="caption">No tasks</Typography>
          </Box>
        </Grid>
      }
    </Grid>

    <TaskFormDialog
      open={taskFormDialogOpen}
      operationMode={taskFormDialogOperationMode}
      toggle={toggleTaskFormDialog}
      dataToEdit={taskDataToEdit}
      refetch={delayedRefetchXHR}
    />

    <DeleteWarningAlertDialog
      open={taskDeleteWarningDialogOpen}
      toggle={toggleTaskDeleteWarningDialog}
      taskId={taskToBeDeleted}
      refetch={delayedRefetchXHR}
    />


  </Container>
}

export default Home;
