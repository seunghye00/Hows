import axios from "axios";

/** 설정 변수 또는 함수 만들어서 보관 **/
const { REACT_APP_BASE_URL } = process.env

// API base url
export const host = REACT_APP_BASE_URL;


export const api = axios.create({
  baseURL: `${host}`
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }
);
