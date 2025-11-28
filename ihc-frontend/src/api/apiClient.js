import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Por ahora local el backend xd
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;