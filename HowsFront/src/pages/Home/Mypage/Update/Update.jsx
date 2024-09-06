import styles from "./Update.module.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UpdateUserInfo } from './../Update/UpdateUserInfo/UpdateUserInfo';
import { UpdateUserPw } from './../Update/UpdateUserPw/UpdateUserPw';

export const Update = () => {
    const navi = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.menus}>
                <div className={styles.updateInfo} onClick={() => navi("updateUserInfo")}>회원정보수정</div>
                <div className={styles.updatePw} onClick={() => navi("updateUserPw")}>비밀번호변경</div>
            </div>
            <div className={styles.body}>
                <Routes>
                    <Route path="/" element={<Navigate to="updateUserInfo" replace />} />
                    <Route path="updateUserInfo" element={<UpdateUserInfo />} />
                    <Route path="updateUserPw" element={<UpdateUserPw />} />
                </Routes>
            </div>
        </div>
    )
}