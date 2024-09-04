import styles from './Mypage.module.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Main } from './Main/Main';
import { UpdateInfo } from './UpdateInfo/UpdateInfo';
import { UserDashboard } from './UserDashboard/UserDashboard';

export const Mypage = () => {
  return (
    <div className={styles.container}>
      Mypage
      <Routes>
        <Route path="/" element={<Navigate to="main" replace />} />
        <Route path="main" element={<Main />} />
        {/* <Route path="updateInfo/*" element={<UpdateInfo />} />
        <Route path="userDashboard/*" element={<UserDashboard />} /> */}
      </Routes>
    </div>
  );
}