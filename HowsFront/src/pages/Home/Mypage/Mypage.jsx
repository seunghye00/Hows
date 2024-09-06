import styles from "./Mypage.module.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Main } from "./Main/Main";
import { Update } from "./Update/Update";
import { UserDashboard } from "./UserDashboard/UserDashboard";

export const Mypage = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="main" replace />} />
        <Route path="main/*" element={<Main />} />
        <Route path="update/*" element={<Update />} />
        <Route path="userDashboard/*" element={<UserDashboard />} />
      </Routes>
    </div>
  );
};
