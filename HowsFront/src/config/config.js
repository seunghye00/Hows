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

// axios.interceptors.response.use(
//   (response) => response, // 응답이 정상일 때 그대로 반환
//   (error) => {
//     // error.response가 없을 경우 (네트워크 에러 등)
//     if (!error.response) {
//       Swal.fire({
//         icon: 'error',
//         text: '서버에 연결할 수 없습니다. 다시 시도해주세요.',
//         showConfirmButton: true,
//       });
//       return Promise.reject(error);
//     }

//     const { status } = error.response;

//     switch (status) {
//       case 401:
//         // 401 Unauthorized 처리
//         Swal.fire({
//           icon: 'warning',
//           text: '로그인 후 이용할 수 있습니다.',
//           showConfirmButton: true,
//         }).then(() => {
//           window.location.href = "/signIn"; // 로그인 페이지로 리다이렉트
//         });
//         break;

//       case 403:
//         // 403 Forbidden 처리
//         Swal.fire({
//           icon: 'warning',
//           text: '접근 권한이 없습니다.',
//           showConfirmButton: true,
//         }).then(() => {
//           window.location.href = "/signIn"; // 로그인 페이지로 리다이렉트
//         });
//         break;

//       default:
//         // 기타 에러 처리
//         Swal.fire({
//           icon: 'error',
//           text: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
//           showConfirmButton: true,
//         });
//         break;
//     }

//     return Promise.reject(error); // 에러를 다시 던져서 필요한 곳에서 catch할 수 있게 처리
//   }
// );


// axios.interceptors.response.use(
//   (response) => response, // axios 응답이 정상응답일 때는 then으로 가게 방치
//   (error) => {
//     switch (error.response.status) {
//       case 401:
//         sessionStorage.removeItem("token");
//         useAuthStore.getState().logout(); // useAuthStore에 있는 state값을 가져와서 logout 시키겠다.
//         break;

//       case 403:
//         sessionStorage.removeItem("token");
//         useAuthStore.getState().logout(); // useAuthStore에 있는 state값을 가져와서 logout 시키겠다.

//         Swal.fire({
//           icon: 'warning',
//           text: '로그인 후 이용할 수 있습니다.!!!!!!!!!!!',
//           showConfirmButton: true,
//         }).then(() => {
//           window.location.href = "/signIn";
//         })
//         break;
//     }
//   }
// );