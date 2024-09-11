import styles from "./Mypage.module.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Main } from "./Main/Main";
import { Update } from "./Update/Update";

export const Mypage = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="main" replace />} />
        {/* <Route path="main/*" element={<Main setMain={Main} />} /> */}
        {/* <Route path="main/*" element={<Main />} /> */}
        <Route path="main/:member_id/*" element={<Main />} />
        <Route path="update/*" element={<Update />} />
      </Routes>
    </div>
  );
};
