import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useFormik} from "formik";
import * as yup from "yup";
import {useSnackbar} from 'notistack';

import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import {USER_STORE_KEY} from "../../constants/localstorage";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Required"),
});

function Login() {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const {setAuth} = useAuth();

  const [loading, setLoading] = useState(false);

  const submit = ({email, password}) => {
    setLoading(true);
    axios
      .post("/login", JSON.stringify({email, password}), {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
      })
      .then((response) => response.data)
      .then((response) => {
        setAuth({user: response.data});
        localStorage.setItem(USER_STORE_KEY, JSON.stringify(response.data));
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log("error: " + err);
        setLoading(false)
        enqueueSnackbar(err?.message, {variant: "error"});
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: submit,
  });

  return (
    <Container component="main" maxWidth="xs">
      <Card
        sx={{
          marginTop: 8
        }}
      >
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Typography block align="center" variant="h5" sx={{mb: 2}}>
              Login
            </Typography>
            <TextField
              fullWidth
              sx={{mb: 2}}
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              sx={{mb: 2}}
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <LoadingButton
              loading={loading}
              color="primary"
              variant="contained"
              sx={{mt: 3, mb: 2}}
              fullWidth
              type="submit"
            >
              Submit
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
