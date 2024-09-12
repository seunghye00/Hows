import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../../assets/images/logo_how.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "./../../../store/store";
import { host } from "./../../../config/config";
import { FindId } from "./FindId/FindId";
import { FindPw } from "./FindPw/FindPw";
import { loginUser } from "../../../api/member";
import Swal from "sweetalert2";

export const SignIn = () => {
  const navi = useNavigate();
  const [user, setUser] = useState({ member_id: "", pw: "" });
  const { login } = useAuthStore();
  const [page, setPage] = useState("login"); // main으로 해야하나

  const handleInputLogin = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginBtn = () => {
    loginUser(user)
      .then((resp) => {
        const { token, member_id } = resp.data; // 서버 응답에서 token과 memberId 분해 할당
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("member_id", member_id); // 사용자 ID도 저장
        login(token);

        Swal.fire({
          title: "성공!",
          text: `${member_id} 님 환영합니다.`,
          icon: "success",
          confirmButtonText: "확인",
        });
        navi("/");
      })
      .catch((error) => {
        Swal.fire({
          title: "경고!",
          text: "로그인에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (page === "findId") {
    return <FindId onBack={() => handlePageChange("login")} />;
  }
  if (page === "findPw") {
    navi("/signIn/findPw");
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src={logo}></img>
          <h1 className={styles.title}>How's</h1>
        </div>
        <input
          type="text"
          name="member_id"
          onChange={handleInputLogin}
          placeholder="아이디"
          className={styles.input}
        />
        <input
          type="password"
          name="pw"
          onChange={handleInputLogin}
          placeholder="비밀번호"
          className={styles.input}
        />
        <button className={styles.loginBtn} onClick={handleLoginBtn}>
          로그인
        </button>
        {/* <button className={styles.kakaoLoginBtn}>카카오톡으로 로그인</button> */}
        <div className={styles.links}>
          <button
            onClick={() => handlePageChange("findId")}
            className={styles.linkBtn}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => handlePageChange("findPw")}
            className={styles.linkBtn}
          >
            비밀번호 찾기
          </button>
        </div>
        <button className={styles.signUpBtn} onClick={() => navi("/signUp")}>
          회원가입
        </button>
      </div>
    </div>
  );
};
