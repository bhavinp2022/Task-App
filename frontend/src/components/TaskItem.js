import React, {useState, useCallback} from "react";
import _ from "lodash";

import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import axios from "../api/axios";
import {USER_STORE_KEY} from "../constants/localstorage";
import {useSnackbar} from "notistack";

function TaskItem(
  {
    id,
    taskName,
    description,
    completed,
    refetch,
    deleteTask
  }
) {
  const {enqueueSnackbar} = useSnackbar();
  const [isCompleted, setIsCompleted] = useState(completed);

  const updateTaskCompletionStatus = (completed) => {
    axios
      .put(`/tasks/${id}/${completed.toString()}`)
      .then((response) => response.data)
      .then((response) => {
        refetch && refetch();
      })
      .catch((err) => {
        console.log("error: " + err);
        enqueueSnackbar(err?.message, {variant: "error"});
      });
  }

  const delayedXHR = useCallback(_.debounce((q) => updateTaskCompletionStatus(q), 619), []);

  return <Card key={id}>
    <CardContent>
      <Grid container>
        <Grid item>
          <Checkbox
            label=""
            checked={isCompleted}
            onChange={(e) => {
              setIsCompleted(e.target.checked);
              delayedXHR(e.target.checked);
            }}
          />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="subtitle1" sx={{textDecoration: isCompleted ? "line-through" : "none"}}>
                {taskName}
              </Typography>
              <Typography variant="caption" sx={{textDecoration: isCompleted ? "line-through" : "none"}}>
                {description}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton onClick={(e) => deleteTask(e, id)}>
              <DeleteIcon color="error"/>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
}

export default TaskItem