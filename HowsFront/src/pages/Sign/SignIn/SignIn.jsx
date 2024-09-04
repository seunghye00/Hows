import styles from './SignIn.module.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SignIn = () => {

  const navi = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    pw: '',
    name: '',
    ssn: '',
    nickName: '',
    email: '',
    phone: '',
    address: ''
  });
  return (
    <div className={styles.container}>

      <div className={styles.loginBox}>
        <h1 className={styles.title}>How's</h1>
        <input type="text" placeholder="아이디" className={styles.input} />
        <input type="password" placeholder="비밀번호" className={styles.input} />
        <button className={styles.loginBtn}>로그인</button>
        <button className={styles.kakaoLoginBtn}>카카오톡으로 로그인</button>
        <div className={styles.links}>
          <button className={styles.linkBtn}>아이디 찾기</button>
          <button className={styles.linkBtn}>비밀번호 찾기</button>
        </div>
        <button className={styles.signUpBtn} onClick={() => navi("/signUp")}>
          회원가입
        </button>

        {/* 임시 경로 */}
        <span onClick={() => navi("/mypage/main")}>마이페이지</span>
      </div>
    </div>
  );
}