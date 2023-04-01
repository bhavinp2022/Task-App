import axios from "axios";

export default axios.create({
  withCredentials: true,
  baseURL: "https://t3kelxbrkj.execute-api.us-east-1.amazonaws.com/dev",
  // baseURL: "http://localhost:3000/dev",
});
