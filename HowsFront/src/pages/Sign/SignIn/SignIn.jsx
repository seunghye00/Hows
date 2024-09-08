import styles from './SignIn.module.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../../../assets/images/logo_how.png'
import axios from "axios";
import { api } from '../../../config/config';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from './../../../store/store';
import { host } from './../../../config/config';
import { FindId } from './FindId/FindId';


export const SignIn = () => {

  const navi = useNavigate();
  const [user, setUser] = useState({ member_id: '', pw: '' });
  const { login } = useAuthStore();
  const [page, setPage] = useState('login'); // main으로 해야하나


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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (page === 'findId') {
    return <FindId onBack={() => handlePageChange('login')} />;
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
        {/* <button className={styles.kakaoLoginBtn}>카카오톡으로 로그인</button> */}
        <div className={styles.links}>
          <button onClick={() => handlePageChange('findId')} className={styles.linkBtn}>아이디 찾기</button>
          <button onClick={() => handlePageChange('findPw')} className={styles.linkBtn}>비밀번호 찾기</button>
        </div>
        <button className={styles.signUpBtn} onClick={() => navi("/signUp")}>
          회원가입
        </button>
      </div>
    </div>
  );
}