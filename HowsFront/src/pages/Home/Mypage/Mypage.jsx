import styles from "./Mypage.module.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Main } from "./Main/Main";
import { Update } from "./Update/Update";
import { ScrollTop } from "../../../components/ScrollTop/ScrollTop";
import { useAuthStore } from "../../../store/store";
import Swal from "sweetalert2";
import { useEffect } from "react";

export const Mypage = () => {
  const { isAuth } = useAuthStore();
  const navi = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      Swal.fire({
        type: "warning",
        text: "로그인이 필요한 서비스입니다.",
        icon: "warning"
      });
      navi("/signIn");
    }
  }, [isAuth]);



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
