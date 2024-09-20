import styles from "./FindId.module.css";
import { useState } from "react";
import logo from "../../../../assets/images/로그인_로고.png";
import { findId } from "../../../../api/member";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const FindId = ({ onBack }) => {
  const navi = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleFindBtn = () => {
    findId(name, email)
      .then((resp) => {
        if (resp.data != false) {
          Swal.fire({
            title: "성공!",
            text: `아이디는 ${resp.data}입니다.`,
            icon: "success",
            confirmButtonText: "확인",
          });
          onBack();
        } else if (resp.data == false) {
          Swal.fire({
            title: "경고!",
            text: "아이디를 찾을 수 없습니다. 입력하신 정보를 확인하세요.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "경고!",
          text: "아이디를 찾을 수 없습니다. 입력하신 정보를 확인하세요.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.findIdBox}>
        <div className={styles.logo}>
          <div className={styles.logoBox}>
            <img src={logo} onClick={() => navi("/")} />
          </div>
        </div>
        <span className={styles.subTitle}>아이디 찾기</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
        />
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <button className={styles.findBtn} onClick={handleFindBtn}>
          아이디 찾기
        </button>
        <button className={styles.backBtn} onClick={onBack}>
          {" "}
          뒤로가기
        </button>
      </div>
    </div>
  );
};
