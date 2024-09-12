import styles from "../FindPw.module.css"
import { useState } from "react";
import logo from '../../../../../assets/images/logo_how.png'
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

export const ChangePw = ({ onSubmit }) => {

    const navi = useNavigate();

    const [newPw, setNewPw] = useState('');
    const [newPw2, setNewPw2] = useState('');
    const [pwValid, setPwValid] = useState(null);
    const [checkPw, setCheckPw] = useState(true);

    const validatePassword = (newPw, newPw2) => {
        const isPasswordMatch = newPw === newPw2;
        setCheckPw(isPasswordMatch);

        // 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // 8자 이상, 영문, 숫자, 특수문자 포함
        const isValid = passwordRegex.test(newPw);
        setPwValid(isValid);
        return isValid && isPasswordMatch; // 새 비밀번호 유효성 상태 업데이트
    };

    const handleNewPw = (e) => {
        const value = e.target.value;
        setNewPw(value);
        validatePassword(value, newPw2);
    };

    const handleNewPw2 = (e) => {
        const value = e.target.value;
        setNewPw2(value);
        validatePassword(newPw, value);
    };

    // input창의 borderColor 결정
    const getInputBorderColor = (type) => {
        if (type === "newPw") {
            if (newPw === "") return ""; // 기본 CSS 적용
            return pwValid ? "var(--hows-blue-dark)" : "var(--hows-red-dark)";
        } else if (type === "newPw2") {
            if (newPw2 === "") return ""; // 기본 CSS 적용
            return newPw === newPw2 ? "var(--hows-blue-dark)" : "var(--hows-red-dark)";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 유효성 검사
        if (!checkPw) {
            Swal.fire({
                title: "경고!",
                text: "새 비밀번호와 일치하지 않습니다.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }
        if (!pwValid) {
            Swal.fire({
                title: "경고!",
                text: "비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }
        // 새 비밀번호 제출
        onSubmit(newPw);
        navi("/signIn");
    };


    return (
        <div className={styles.container}>
            <div className={styles.changePwBox}>
                <div className={styles.logo} onClick={() => navi("/")}>
                    <img src={logo} alt="logo" />
                    <h1 className={styles.title}>How's</h1>
                </div>
                <span className={styles.subTitle}>새 비밀번호 입력</span>
                <input
                    type="password"
                    value={newPw}
                    onChange={handleNewPw}
                    placeholder="새 비밀번호를 입력해주세요."
                    style={{ borderColor: getInputBorderColor("newPw") }}
                // style={{ borderColor: pwValid ? "var(--hows-blue-dark)" : "var(--hows-red-dark)" }}
                />
                <input
                    type="password"
                    value={newPw2}
                    onChange={handleNewPw2}
                    placeholder="한 번 더 입력해주세요."
                    style={{ borderColor: getInputBorderColor("newPw2") }}
                // style={{ borderColor: checkPw ? "var(--hows-blue-dark)" : "var(--hows-red-dark)" }}
                />
                <button className={styles.btn} onClick={handleSubmit}>변경 완료</button>
            </div>
        </div>
    )
}