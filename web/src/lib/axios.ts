import myAxios from "axios";

const axios = myAxios.create({
  baseURL: "http://localhost:8000",
  // baseURL: import.meta.env.VITE_API_ENDPOINT,
  // headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
});

export default axios;
