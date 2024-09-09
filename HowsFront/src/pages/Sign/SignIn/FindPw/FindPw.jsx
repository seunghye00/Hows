import styles from "./FindPw.module.css"
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import logo from '../../../../assets/images/logo_how.png'
import axios from "axios";
import { host } from './../../../../config/config';
import { ChangePw } from "./ChangePw/ChangePw";

export const FindPw = ({ onBack }) => {

    const navi = useNavigate();

    const [auth, setAuth] = useState({ member_id: '', email: '' });
    const [isVerify, setIsVerify] = useState(false); // 인증 여부
    const [showNewPw, setShowNewPw] = useState(false); // 새 비밀번호 입력 필드 표시 여부
    // const [code, setCode] = useState('');
    // const [isCodeValid, setIsCodeValid] = useState(null); // 인증 코드 유효성

    const handleInput = (e) => {
        const { name, value } = e.target
        setAuth(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSendEmail = () => {
        axios.post(`${host}/auth/verifyUser`, null, {
            params: {
                member_id: auth.member_id,
                email: auth.email
            }
        }).then(resp => {
            if (resp.data) {
                // alert("인증번호가 이메일로 전송되었습니다.");
                setIsVerify(true);
                setShowNewPw(true);
            } else {
                alert("아이디와 이메일이 일치하지 않습니다.");
            }
        })
    }


    // const handleVerifyCode = () => {
    //     // 인증번호 확인 로직 추가
    //     // 인증번호가 맞다면 비밀번호 입력 폼을 보여줌

    //     // 임시 인증번호 123 확인
    //     if (code === '123') {
    //         setIsCodeValid(true);
    //         setShowNewPw(true); // 인증번호가 맞으면 새 비밀번호 입력 폼 표시
    //         alert("인증번호가 확인되었습니다.");

    //         // 새 비밀번호 입력 필드 표시
    //         // handleShowNewPasswordFields(); // 새 비밀번호 입력 필드를 표시하는 함수 호출
    //     } else {
    //         setIsCodeValid(false);
    //         alert("인증번호가 잘못되었습니다.");
    //     }
    // };

    const handleSubmitNewPw = (newPw) => {
        axios.post(`${host}/auth/changePw`, null, {
            params: {
                member_id: auth.member_id,
                pw: newPw,
                email: auth.email
            }
        })
            .then(resp => {
                console.log("변경 성공 : ", resp.data);
                if (resp.data > 0) {
                    alert("비밀번호가 성공적으로 변경되었습니다.");
                    navi("/signIn");
                }
            })
            .catch(() => {
                alert("비밀번호 변경에 실패했습니다.");
            });
    };

    return (
        <div className={styles.container}>
            {!showNewPw ? (
                // !isVerify ? (
                <div className={styles.findPwBox}>
                    <div className={styles.logo}>
                        <img src={logo} alt="logo" />
                        <h1 className={styles.title}>How's</h1>
                    </div>
                    <span className={styles.subTitle}>비밀번호 찾기</span>
                    <input type="text" name='member_id' onChange={handleInput} placeholder="아이디" />
                    <input type="text" name='email' onChange={handleInput} placeholder="이메일" />
                    <button className={styles.btn} onClick={handleSendEmail}>비밀번호 찾기</button>
                    <button className={styles.backBtn} onClick={onBack}> 뒤로가기</button>
                </div>
                // ) : (
                //     <div className={styles.isVerify}>
                //         <div className={styles.logo}>
                //             <img src={logo} alt="logo" />
                //             <h1 className={styles.title}>How's</h1>
                //         </div>
                //         <span className={styles.subTitle}>인증번호 입력</span>
                //         <input
                //             type="text"
                //             value={code}
                //             onChange={(e) => setCode(e.target.value)}
                //             placeholder="인증번호 입력"
                //         />
                //         <button className={styles.btn} onClick={handleVerifyCode}>확인</button>
                //     </div>
                // )
            ) : (
                <ChangePw onSubmit={handleSubmitNewPw} />
            )}

        </div>
    )
}