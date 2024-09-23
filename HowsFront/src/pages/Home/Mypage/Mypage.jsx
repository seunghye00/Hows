import styles from "./Mypage.module.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Main } from "./Main/Main";
import { Update } from "./Update/Update";
import { ScrollTop } from "../../../components/ScrollTop/ScrollTop";

export const Mypage = () => {

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
