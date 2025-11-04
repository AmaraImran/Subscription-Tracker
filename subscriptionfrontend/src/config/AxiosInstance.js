import axios from "axios";
import BASE_URL from "./Apiconfig";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allows cookies (JWT)
});

export default api;
