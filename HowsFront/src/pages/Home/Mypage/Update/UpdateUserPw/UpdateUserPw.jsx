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
    const [isCurrentPwValid, setIsCurrentPwValid] = useState(false); // 현재 비밀번호 확인 결과
    const [showNewPwFields, setShowNewPwFields] = useState(false); // 새 비밀번호 입력 필드 표시 여부


    const validatePassword = (newPw, newPw2) => {
        const isPasswordMatch = newPw === newPw2;
        setCheckResult(isPasswordMatch);

        // 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        setIsPasswordValid(passwordRegex.test(newPw));
    }
    // 현재 사용 중인 비밀번호
    const handleCurrentPw = (e) => {
        setCurrentPw(e.target.value);
    }

    // 비밀번호 존재 여부 확인
    const handleIsCurrentPw = () => {
        api.post(`/member/checkPw`, { pw: currentPw }).then(resp => {
            if (resp.data) {
                setIsCurrentPwValid(true);
                setShowNewPwFields(true);
            } else {
                setIsCurrentPwValid(false);
                alert("현재 비밀번호가 일치하지 않습니다.")
            }
        })
    }


    // 새 비밀번호
    const handleNewPw = (e) => {
        const value = e.target.value;
        setNewPw(value);
        validatePassword(value, newPw2);
    }
    // 새 비밀번호 확인
    const handleNewPw2 = (e) => {
        const value = e.target.value;
        setNewPw2(value);
        validatePassword(newPw, value);
    }

    // 비밀번호 변경 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사, 비밀번호 일치 확인
        if (!isCurrentPwValid) {
            alert('현재 비밀번호가 맞지 않습니다.');
            return;
        }

        if (!checkResult) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!isPasswordValid) {
            alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');
            return;
        }

        // 서버로 새 비밀번호 전송
        api.put(`/member/updatePw`, { pw: newPw }).then(resp => {

            console.log("변경성공? : ", resp.data)

            if (resp.data > 0) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                navi("/mypage/main");
            } else {
                alert('비밀번호 변경에 실패했습니다.');
            }
        });

    };





    //======================================================


    // 유효성 검사
    // const validateFormData = formData => {
    //     // 현재 비밀번호 검사
    //     if (!formData.currentPw) {
    //         alert('현재 비밀번호를 입력하세요.');
    //         return false;
    //     }

    //     // 새 비밀번호 검사
    //     if (!formData.newPw) {
    //         alert('새 비밀번호를 입력하세요.');
    //         return false;
    //     }

    //     // 새 비밀번호와 확인 비밀번호가 일치하는지 검사
    //     if (formData.newPw !== formData.newPw2) {
    //         alert('새 비밀번호가 일치하지 않습니다.');
    //         return false;
    //     }

    //     // 비밀번호 유효성 검사: 최소 8자 이상, 영문자, 숫자, 특수문자 포함
    //     const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //     if (!pwPattern.test(formData.newPw)) {
    //         alert('비밀번호는 최소 8자 이상이어야 하며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
    //         return false;
    //     }

    //     return true;
    // };



    // 비밀번호 변경 완료 버튼 클릭 시
    // const handleSubmit = e => {
    //     e.preventDefault(); // 기본 폼 제출 방지

    //     // 유효성 검사 실행
    //     if (!isPasswordValid) {
    //         alert("비밀번호는 최소 8자 이상이어야 하며, 영문자, 숫자, 특수문자를 포함해야 합니다.")
    //         return;
    //     }

    //     // 유효성 검사를 통과하면 서버에 데이터 전송
    //     api.put(`/member/pwUpdate`, { pw: newPw }).then(resp => {
    //         console.log(resp.data);

    //         if (resp.data.success) {
    //             alert('비밀번호가 성공적으로 변경되었습니다.');
    //             navi("/mypage/main");
    //         } else {
    //             // 비밀번호가 일치하지 않으면 오류 메시지 출력
    //             alert('현재 비밀번호가 일치하지 않습니다.');
    //         }

    //     }).catch(error => {
    //         alert('비밀번호 변경 중 오류가 발생했습니다.');
    //     });
    // };

    return (
        <div className={styles.container}>
            <div className={styles.updatePw}>
                <div className={styles.currentPw}>
                    <span className={styles.title}>현재 비밀번호</span>
                    <input
                        type="password"
                        placeholder="현재 사용 중인 비밀번호를 입력해주세요."
                        onChange={handleCurrentPw}
                        className={styles.inputName}
                    />
                </div>
                <div className={styles.isCurrentPwBtn}>
                    <button onClick={handleIsCurrentPw}>확인</button>
                </div>

                {/* 새 비밀번호 입력 필드 */}
                {showNewPwFields && (
                    <>
                        <div className={styles.newPw}>
                            <span className={styles.title}>새 비밀번호</span>
                            <span>영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.</span>
                            <input
                                type="password"
                                placeholder="새 비밀번호를 입력해주세요."
                                onChange={handleNewPw}
                                className={styles.inputPw}
                            />
                        </div>
                        <div className={styles.newPw2}>
                            <span className={styles.title}>새 비밀번호 확인</span>
                            <input
                                type="password"
                                placeholder="한 번 더 입력해주세요."
                                onChange={handleNewPw2}
                                className={styles.inputPw2}
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