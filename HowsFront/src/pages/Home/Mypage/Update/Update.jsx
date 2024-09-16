import styles from "./Update.module.css";
import {
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { UpdateUserInfo } from './../Update/UpdateUserInfo/UpdateUserInfo';
import { UpdateUserPw } from './../Update/UpdateUserPw/UpdateUserPw';

export const Update = () => {
    const navi = useNavigate();
    const location = useLocation();

    return (
        <div className={styles.container}>
            <div className={styles.menus}>
                <div
                    className={`${styles.updateInfo} ${location.pathname.includes('updateUserInfo') ? styles.active : ''}`}
                    onClick={() => navi("updateUserInfo")}
                >
                    회원정보수정
                </div>
                <div
                    className={`${styles.updatePw} ${location.pathname.includes('updateUserPw') ? styles.active : ''}`}
                    onClick={() => navi("updateUserPw")}
                >
                    비밀번호변경
                </div>
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

