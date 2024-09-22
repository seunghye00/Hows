import styles from "./Mypage.module.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Main } from "./Main/Main";
import { Update } from "./Update/Update";
import { ScrollTop } from "../../../components/ScrollTop/ScrollTop";
import { useAuthStore } from "../../../store/store";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const Mypage = () => {
  const { isAuth, login } = useAuthStore();
  const navi = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // 토큰이 있을 경우 로그인 상태를 업데이트
      login(token);
    }
    setIsLoading(false); // 토큰 확인 후 로딩 상태를 false로 설정
  }, [login]);

  useEffect(() => {
    if (!isLoading) {
      // 로딩이 끝났을 때만 실행
      if (!isAuth) {
        Swal.fire({
          type: "warning",
          text: "로그인이 필요한 서비스입니다.",
          icon: "warning",
        });
        navi("/signIn");
      }
    }
  }, [isAuth, isLoading, navi]);

  if (isLoading) {
    // 로딩 중일 때 렌더링을 막기 위해 아무것도 표시하지 않음 (또는 로딩 스피너 추가 가능)
    return null;
  }

  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="main" replace />} />
        <Route path="main/:member_id/*" element={<Main />} />
        <Route path="update/*" element={<Update />} />
      </Routes>
      <ScrollTop></ScrollTop>
    </div>
  );
};
