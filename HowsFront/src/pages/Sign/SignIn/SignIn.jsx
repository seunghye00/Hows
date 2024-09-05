import styles from './SignIn.module.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../../../assets/images/logo_how.png'
import axios from "axios";
import { api } from '../../../config/config';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from './../../../store/store';


export const SignIn = () => {

  const navi = useNavigate();
  const [user, setUser] = useState({ member_id: '', pw: '' });
  const { login } = useAuthStore();

  const handleLogin = () => {
    api.post(`/auth`, user).then(resp => {
      const token = resp.data;

      // token 값을 json 형식으로 추출
      const decoded = jwtDecode(token);
      console.log(decoded);

      sessionStorage.setItem("token", token);
      login(token);
    })

  }


  return (
    <div className={styles.container}>

      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src={logo}></img>
          <h1 className={styles.title}>How's</h1>
        </div>
        <input type="text" name='member_id' placeholder="아이디" className={styles.input} />
        <input type="password" name='pw' placeholder="비밀번호" className={styles.input} />
        <button className={styles.loginBtn} onClick={handleLogin}>로그인</button>
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