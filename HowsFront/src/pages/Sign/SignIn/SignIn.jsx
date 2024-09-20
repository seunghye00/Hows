import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../../assets/images/로그인_로고.png";
import { jwtDecode } from "jwt-decode";
import { useAuthStore, useMemberStore } from "./../../../store/store";
import { FindId } from "./FindId/FindId";
import { loginUser } from "../../../api/member";
import Swal from "sweetalert2";

export const SignIn = () => {
  const navi = useNavigate();
  const [user, setUser] = useState({ member_id: "", pw: "" });
  const { login } = useAuthStore();
  const { setCurrentUser } = useMemberStore();
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
        const { token } = resp.data; // 서버 응답에서 token과 memberId 분해 할당
        const decoded = jwtDecode(token);

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("member_id", decoded.sub); // 사용자 ID도 저장
        sessionStorage.setItem("nickname", decoded.nickname); // 사용자 닉네임 저장
        sessionStorage.setItem("member_avatar", decoded.member_avatar); // 사용자 프로필사진 저장

        setCurrentUser({
          nickname: decoded.nickname,
          member_avatar: decoded.member_avatar,
        });

        login(token);

        Swal.fire({
          title: "로그인",
          text: `${decoded.nickname} 님 환영합니다.`,
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
        <div className={styles.logo} onClick={() => navi("/")}>
          <div className={styles.logoBox}>
            <img src={logo} />
          </div>
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
          onKeyDown={(e) => e.key === "Enter" && handleLoginBtn()}
          placeholder="비밀번호"
          className={styles.input}
        />
        <button className={styles.loginBtn} onClick={handleLoginBtn}>
          로그인
        </button>
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
