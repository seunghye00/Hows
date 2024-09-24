import axios from "axios";
import { useAuthStore } from "../store/store";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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

api.interceptors.response.use(
  (response) => response, // axios 응답이 정상응답일 때는 then으로 가게 방치
  (error) => {
    switch (error.response.status) {
      case 401:
        sessionStorage.removeItem("token");
        useAuthStore.getState().logout(); // useAuthStore에 있는 state값을 가져와서 logout 시키겠다.
        break;

      case 403:
        sessionStorage.removeItem("token");
        useAuthStore.getState().logout(); // useAuthStore에 있는 state값을 가져와서 logout 시키겠다.

        Swal.fire({
          icon: 'warning',
          text: '로그인 후 이용할 수 있습니다.!!!!!!!!!!!',
          showConfirmButton: true,
        }).then(() => {
          window.location.href = "/signIn";
        })
        break;
    }
  }
);