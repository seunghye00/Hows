import { api } from "../../../../../config/config";
import styles from "./UpdateUserPw.module.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UpdateUserPw = () => {

    const navi = useNavigate()
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newPw2, setNewPw2] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [checkResult, setCheckResult] = useState(true);
    const [isCurrentPwValid, setIsCurrentPwValid] = useState(null); // 현재 비밀번호 확인 결과
    const [showNewPwFields, setShowNewPwFields] = useState(false); // 새 비밀번호 입력 필드 표시 여부
    const [currentPwValid, setCurrentPwValid] = useState(null); // 비밀번호 일치 여부 상태


    const validatePassword = (newPw, newPw2) => {
        const isPasswordMatch = newPw === newPw2;
        setCheckResult(isPasswordMatch);

        // 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const isValid = passwordRegex.test(newPw);
        setIsPasswordValid(isValid);
        return isValid && isPasswordMatch; // 새 비밀번호 유효성 상태 업데이트
    }
    // 현재 사용 중인 비밀번호
    const handleCurrentPw = (e) => {
        setCurrentPw(e.target.value);
    };

    // 비밀번호 존재 여부 확인
    const handleIsCurrentPw = () => {
        api.post(`/member/checkPw`, { pw: currentPw }).then(resp => {
            // 비밀번호가 일치하면 true, 그렇지 않으면 false로 상태 업데이트
            setIsCurrentPwValid(resp.data);
            setCurrentPwValid(resp.data); // input창 색 변경
            if (resp.data) {
                setShowNewPwFields(true);
            } else {
                setShowNewPwFields(false); // 비밀번호가 틀린 경우 새 비밀번호 필드를 숨김
            }
        })
    }

    // 새 비밀번호
    const handleNewPw = (e) => {
        const value = e.target.value;
        setNewPw(value);
        validatePassword(value, newPw2);
    };
    // 새 비밀번호 확인
    const handleNewPw2 = (e) => {
        const value = e.target.value;
        setNewPw2(value);
        validatePassword(newPw, value);
    };

    // input창의 borderColor 결정
    const getInputBorderColor = (type) => {
        if (type === "newPw") {
            if (newPw === "") return ""; // 기본 CSS 적용
            return isPasswordValid ? "var(--hows-blue-dark)" : "var(--hows-red-dark)";
        } else if (type === "newPw2") {
            if (newPw2 === "") return ""; // 기본 CSS 적용
            return newPw === newPw2 ? "var(--hows-blue-dark)" : "var(--hows-red-dark)";
        } else if (type === "currentPw") {
            return currentPwValid === null ? "" : currentPwValid ? "var(--hows-blue-dark)" : "var(--hows-red-dark)";
        }
    };





    // 비밀번호 변경 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사, 비밀번호 일치 확인
        if (!isCurrentPwValid) return;
        if (!checkResult) return;
        if (!isPasswordValid) {
            alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');
            return;
        }

        // 서버로 새 비밀번호 전송
        api.put(`/member/updatePw`, { pw: newPw }).then(resp => {
            if (resp.data > 0) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                navi("/mypage/main");
            } else {
                alert('비밀번호 변경에 실패했습니다.');
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.updatePw}>
                <div className={styles.currentPw}>
                    <div>
                        <span className={styles.title}>현재 비밀번호</span>
                        <div className={styles.status}>
                            {isCurrentPwValid === null ? null : isCurrentPwValid ? (
                                <i className='bx bx-check'></i>
                            ) : (
                                <span className={styles.discord}>X</span>
                            )}
                        </div>
                    </div>
                    <input
                        type="password"
                        placeholder="현재 사용 중인 비밀번호를 입력해주세요."
                        onChange={handleCurrentPw}
                        style={{ borderColor: getInputBorderColor("currentPw") }}
                    />
                </div>
                <div className={styles.isCurrentPwBtn}>
                    <button onClick={handleIsCurrentPw}>확인</button>
                </div>

                {/* 새 비밀번호 입력 필드 */}
                {showNewPwFields && (
                    <>
                        <div className={styles.newPw}>
                            <div>
                                <span className={styles.title}>새 비밀번호</span>
                                <div className={styles.status}>
                                    {isPasswordValid ? (
                                        <i className='bx bx-check' style={{ color: "var(--hows-blue-dark)" }}></i>
                                    ) : (
                                        <span className={styles.discord} style={{ color: "var(--hows-red-dark)" }}>X</span>
                                    )}
                                </div>
                            </div>
                            <span>영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.</span>
                            <input
                                type="password"
                                placeholder="새 비밀번호를 입력해주세요."
                                onChange={handleNewPw}
                                className={styles.inputPw}
                                style={{ borderColor: getInputBorderColor("newPw") }}
                            />
                        </div>
                        <div className={styles.newPw2}>
                            <div>
                                <span className={styles.title}>새 비밀번호 확인</span>
                                <div className={styles.status}>
                                    {newPw === newPw2 ? (
                                        <i className='bx bx-check' style={{ color: "var(--hows-blue-dark)" }}></i>
                                    ) : (
                                        <span className={styles.discord} style={{ color: "var(--hows-red-dark)" }}>X</span>
                                    )}
                                </div>
                            </div>
                            <input
                                type="password"
                                placeholder="한 번 더 입력해주세요."
                                onChange={handleNewPw2}
                                className={styles.inputPw2}
                                style={{ borderColor: getInputBorderColor("newPw2") }}
                            />
                        </div>
                        <div className={styles.okBtn}>
                            <button onClick={handleSubmit}>변경 완료</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}