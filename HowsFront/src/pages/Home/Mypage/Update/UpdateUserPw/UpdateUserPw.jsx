import { api } from "../../../../../config/config";
import styles from "./UpdateUserPw.module.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UpdateUserPw = () => {

    const navi = useNavigate()
    const [formData, setFormData] = useState({ currentPw: '', newPw: '', newPw2: '' });
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newPw2, setNewPw2] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [checkResult, setCheckResult] = useState(true);

    // const handleChange = e => {
    //     const { name, value } = e.target
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value,
    //     }))
    // }

    const handleCurrentPw = (e) => {
        // console.log(e.target.value);
        setCurrentPw(e.target.value);
    }

    const handleNewPw = (e) => {
        const value = e.target.value;
        setNewPw(value);
        validatePassword(value, newPw2);
    }

    const handleNewPw2 = (e) => {
        const value = e.target.value;
        setNewPw2(value);
        validatePassword(newPw, value);
    }

    const validatePassword = (newPassword, confirmPassword) => {
        const isPasswordMatch = newPassword === confirmPassword;
        setCheckResult(isPasswordMatch);

        // 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        setIsPasswordValid(passwordRegex.test(newPassword));
    }



    // 유효성 검사
    const validateFormData = formData => {
        // 현재 비밀번호 검사
        if (!formData.currentPw) {
            alert('현재 비밀번호를 입력하세요.');
            return false;
        }

        // 새 비밀번호 검사
        if (!formData.newPw) {
            alert('새 비밀번호를 입력하세요.');
            return false;
        }

        // 새 비밀번호와 확인 비밀번호가 일치하는지 검사
        if (formData.newPw !== formData.newPw2) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return false;
        }

        // 비밀번호 유효성 검사: 최소 8자 이상, 영문자, 숫자, 특수문자 포함
        const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwPattern.test(formData.newPw)) {
            alert('비밀번호는 최소 8자 이상이어야 하며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
            return false;
        }

        return true;
    };



    // 비밀번호 변경 완료 버튼 클릭 시
    const handleSubmit = e => {
        e.preventDefault(); // 기본 폼 제출 방지

        // 유효성 검사 실행
        if (!validateFormData(formData)) {
            return;
        }

        // 서버로 보낼 데이터 준비 (새 비밀번호를 'pw'로 보내기)
        const pwData = {
            currentPw: formData.currentPw,  // 현재 비밀번호
            pw: formData.newPw              // 새 비밀번호 (pw 키값으로 전송)
        };

        // 유효성 검사를 통과하면 서버에 데이터 전송
        api.update(`/member/pwUpdate`, { pw: newPw }).then(resp => {
            console.log(resp.data);

            if (resp.data.success) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                navi("/mypage/main");
            } else {
                // 비밀번호가 일치하지 않으면 오류 메시지 출력
                alert('현재 비밀번호가 일치하지 않습니다.');
            }

        }).catch(error => {
            alert('비밀번호 변경 중 오류가 발생했습니다.');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.updatePw}>
                <div className={styles.currentPw}>
                    <span className={styles.title}>현재 비밀번호</span>
                    <input
                        type="password"
                        placeholder="현재 사용 중인 비밀번호를 입력해주세요."
                        name="name"
                        onChange={handleCurrentPw}
                        className={styles.inputName}
                    ></input>
                </div>
                <div className={styles.newPw}>
                    <span className={styles.title}>새 비밀번호</span>
                    <span>
                        영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를
                        입력해주세요.
                    </span>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 입력해주세요."
                        name="pw"
                        onChange={handleNewPw}
                        className={styles.inputPw}
                    ></input>
                </div>
                <div className={styles.newPw2}>
                    <span className={styles.title}>새 비밀번호 확인</span>
                    <input
                        type="password"
                        placeholder="한 번 더 입력해주세요."
                        name="pw2"
                        onChange={handleNewPw2}
                        className={styles.inputPw2}
                    ></input>
                </div>
                <div className={styles.okBtn}>
                    <button onClick={handleSubmit}>변경 완료</button>
                </div>
            </div>
        </div>
    )
}