import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  // baseURL:"https://thedailyhub.com/api"
});
export default instance;
