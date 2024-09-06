import styles from './SignIn.module.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../../../assets/images/logo_how.png'
import axios from "axios";
import { api } from '../../../config/config';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from './../../../store/store';
import { host } from './../../../config/config';


export const SignIn = () => {

  const navi = useNavigate();
  const [user, setUser] = useState({ member_id: '', pw: '' });
  const { login } = useAuthStore();


  const handleInputLogin = (e) => {
    const { name, value } = e.target
    setUser(prev => ({
      ...prev,
      [name]: value,
    }))
    console.log("로그인 : ", user)
  }

  const handleLoginBtn = () => {


    axios.post(`${host}/auth`, user).then(resp => {
      const token = resp.data;
      sessionStorage.setItem("token", token);
      login(token);

      alert("로그인 성공!")
      navi("/");

    }).catch(error => {
      alert('로그인에 실패하였습니다.')
    })
  }

  return (
    <div className={styles.container}>

      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src={logo}></img>
          <h1 className={styles.title}>How's</h1>
        </div>
        <input type="text" name='member_id' onChange={handleInputLogin} placeholder="아이디" className={styles.input} />
        <input type="password" name='pw' onChange={handleInputLogin} placeholder="비밀번호" className={styles.input} />
        <button className={styles.loginBtn} onClick={handleLoginBtn}>로그인</button>
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