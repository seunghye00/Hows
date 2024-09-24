import styles from "./UpdateUserInfo.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../../../../config/config";
import { format } from "date-fns";
import { useAuthStore } from "../../../../../store/store";
import { checkEmail, checkNickname, deleteUser, userInfo } from "../../../../../api/member";
import Swal from "sweetalert2";
import DaumPostcode from "react-daum-postcode";
import { SwalComp } from "../../../../../commons/commons";
import { Modal } from "./../../../../../components/Modal/Modal";

export const UpdateUserInfo = () => {
  const navi = useNavigate();
  const [formData, setFormData] = useState({
    member_id: "",
    pw: "",
    pw2: "",
    name: "",
    birth: "",
    gender: "",
    nickname: "",
    email: "",
    phone: "",
    zip_code: "",
    address: "",
    detail_address: "",
  });
  const [user, setUser] = useState([]);
  const member_id = sessionStorage.getItem('member_id') || ''; // 세션에서 member_id 가져오기, 없으면 빈 문자열

  /* 중복검사 (true일 경우 이미 사용 중) */
  const [nicknameAvailable, setNicknameAvailable] = useState(null); // 중복검사 후 사용가능한지 / false가 사용가능
  const [emailAvailable, setEmailAvailable] = useState(null);

  /* 중복검사 후 보여지는 span 상태 */
  const [checkNicknameStatus, setCheckNicknameStatus] = useState(""); // 중복확인 후 메세지 상태
  const [checkEmailStatus, setCheckEmailStatus] = useState('');

  /* 에러 메세지 */
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  /* 중복확인 버튼 눌렀는지 (false일 경우 누르지 않은) */
  const [nicknameChecked, setNicknameChecked] = useState(true); // 중복확인 버튼 누르면 true
  const [emailChecked, setEmailChecked] = useState(false); // 중복확인 상태 검사

  const { setIsAuth } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [addressCheck, setAddressCheck] = useState({
    default: true,
    direct: false,
  }); // 주소 체크 항목

  // 회원정보 가져오기
  useEffect(() => {
    userInfo().then((resp) => {
      setUser(resp.data);
    });
  }, []);

  useEffect(() => {
    // user 데이터가 있을 경우, formData 초기화
    if (user) {
      setFormData({
        member_id: user.member_id,
        pw: "",
        pw2: "",
        name: user.name,
        birth: user.birth,
        gender: user.gender,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        zip_code: user.zip_code,
        address: user.address,
        detail_address: user.detail_address,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "nickname") {
      setNicknameChecked(false); // 닉네임 input 창 onChange시, 중복확인 버튼 false로 변경
    }
  };

  // 닉네임 중복확인 핸들러
  const handleCheckNickname = () => {
    // 닉네임 유효성 검사
    const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,10}$/;
    if (!nicknamePattern.test(formData.nickname)) {
      Swal.fire({
        title: "경고!",
        text: "닉네임은 한글, 영문자, 숫자로 이루어진 2~10자를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      setNicknameErrorMessage("다시 입력해주세요");
      setNicknameChecked(false); // 중복확인 버튼 상태 초기화
      return;
    } else {
      setNicknameErrorMessage(""); // 오류 메시지 초기화
    }

    // 현재 사용 중인 닉네임과 입력된 닉네임 비교
    if (formData.nickname === user.nickname) {
      setNicknameAvailable(false);
      setNicknameChecked(true); // 중복 확인 상태를 true로 설정
      return;
    }

    // 중복확인 요청
    checkNickname(formData.nickname).then((resp) => {
      setNicknameAvailable(resp.data);
      setNicknameChecked(!resp.data);
      setCheckNicknameStatus(
        resp.data ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다."
      );
    });
  };

  // 이메일 중복확인 핸들러
  const handleCheckEmail = () => {
    // 이메일 유효성 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org)$/;
    if (!emailPattern.test(formData.email)) {
      Swal.fire({
        title: "경고!",
        text: "이메일은 .com / .net / .org 형식의 이메일만 가능합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      setEmailErrorMessage("다시 입력해주세요");
      setEmailChecked(false); // 중복확인 버튼 상태 초기화
      return;
    } else {
      setEmailErrorMessage(""); // 오류 메시지 초기화
    }

    // 현재 사용 중인 닉네임과 입력된 닉네임 비교
    if (formData.email === user.email) {
      setEmailAvailable(false);
      setEmailChecked(true); // 중복 확인 상태를 true로 설정
      return;
    }

    // 중복확인 요청
    checkEmail(formData.email).then((resp) => {
      setEmailAvailable(resp.data);
      setEmailChecked(!resp.data);
      setCheckEmailStatus(
        resp.data ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다."
      );
    });
  }

  /** 주소 찾기 **/
  const handleAddress = () => {
    SwalComp({ type: "confirm", text: "주소를 변경하시곘습니까?" }).then(
      (res) => {
        if (res) {
          setAddressCheck((prev) => ({ default: false, direct: true }));
          setIsModalOpen(true);
        }
      }
    );
  };
  /** postcode data set **/
  const completeHandler = (data) => {
    setIsModalOpen(false);
    setFormData((prev) => ({
      ...prev,
      zip_code: data.zonecode,
      address: data.address,
    }));
  };

  // 유효성
  const validateFormData = (formData) => {
    // 닉네임 검사
    if (!formData.nickname) {
      Swal.fire({
        title: "경고!",
        text: "닉네임을 입력하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }
    const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,10}$/;
    if (!nicknamePattern.test(formData.nickname)) {
      Swal.fire({
        title: "경고!",
        text: "닉네임은 한글, 영문자, 숫자로 이루어진 2~10자를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }

    // 이메일 검사
    if (!formData.email) {
      Swal.fire({
        title: "경고!",
        text: "이메일을 입력하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org)$/;
    if (!emailPattern.test(formData.email)) {
      Swal.fire({
        title: "경고!",
        text: "사용할 수 없는 형식의 이메일입니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }

    // 전화번호 검사
    if (!formData.phone) {
      Swal.fire({
        title: "경고!",
        text: "전화번호를 입력하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }
    // 전화번호 유효성 검사: 한국 전화번호 형식 (예: 01012345678)
    const phonePattern = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/;
    if (formData.phone && !phonePattern.test(formData.phone)) {
      Swal.fire({
        title: "경고!",
        text: "유효한 전화번호를 입력하세요. (예: 01012345678)",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }

    // 주소 검사
    if (!formData.zip_code || !formData.address) {
      Swal.fire({
        title: "경고!",
        text: "주소를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }
    if (!formData.detail_address) {
      Swal.fire({
        title: "경고!",
        text: "상세주소를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return false;
    }

    // 모든 필드가 채워진 경우 true 반환
    return true;
  };

  // 정보수정 완료 버튼
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    if (formData.nickname === user.nickname) {
      setNicknameAvailable(false);
      setNicknameChecked(true); // 중복 확인 상태를 true로 설정
    }

    if (formData.email === user.email) {
      setEmailAvailable(false);
      setEmailChecked(true); // 중복 확인 상태를 true로 설정
    }

    // 유효성 검사 실행
    if (!validateFormData(formData)) {
      return;
    }

    if (!nicknameChecked) {
      Swal.fire({
        title: "경고!",
        text: "닉네임 중복 확인을 해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    if (!emailChecked) {
      Swal.fire({
        title: "경고!",
        text: "이메일 중복 확인을 해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    // 유효성 검사를 통과하면 서버에 데이터 전송
    api
      .put(`/member/updateInfo`, formData)
      .then((resp) => {
        if (resp.data > 0) {
          Swal.fire({
            title: "성공!",
            text: "회원정보가 성공적으로 수정되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
          navi(`/mypage/main/${member_id}`);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "경고!",
          text: "회원정보수정 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "확인",
      text: "정말 탈퇴하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user.member_id).then((resp) => {
          if (resp.data > 0) {
            Swal.fire({
              title: "성공!",
              text: "성공적으로 탈퇴되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
            sessionStorage.removeItem("token"); // 토큰 삭제
            sessionStorage.removeItem("member_id");
            sessionStorage.removeItem("nickname");
            sessionStorage.removeItem("member_avatar");

            setIsAuth(false); // 인증 상태 업데이트
            navi("/");
          } else {
            console.log("탈퇴 중 오류 발생: ", resp.data);
          }
        })
          .catch((error) => {
            console.error("탈퇴 중 오류 발생: ", error);
          });
      }
    });
  };

  const signup_date = new Date(user.signup_date);
  const signup_currentDate = !isNaN(signup_date)
    ? format(signup_date, "yyyy-MM-dd")
    : "Invalid Date";

  return (
    <div className={styles.container}>
      <div className={styles.updateInfo}>
        <div className={styles.idBox}>
          <span className={styles.title}>ID</span>
          <input
            type="text"
            value={formData.member_id}
            name="member_id"
            className={styles.inputId}
            disabled
          ></input>
        </div>
        <div className={styles.nameBox}>
          <span className={styles.title}>이름</span>
          <input
            type="text"
            value={formData.name}
            name="name"
            className={styles.inputName}
            disabled
          ></input>
        </div>
        <div className={styles.birthBox}>
          <span className={styles.title}>생년월일</span>
          <div>
            <input
              type="text"
              value={formData.birth}
              name="birth"
              className={styles.inputBirth}
              disabled
            ></input>
            <div className={styles.genderBox}>
              <label>
                남
                <input
                  type="checkbox"
                  name="gender"
                  value="male"
                  checked={formData.gender === "M"}
                  disabled
                />
              </label>
              <label>
                여
                <input
                  type="checkbox"
                  name="gender"
                  value="female"
                  checked={formData.gender === "F"}
                  disabled
                />
              </label>
            </div>
          </div>
        </div>
        <div className={styles.nicknameBox}>
          <span className={styles.title}>닉네임</span>
          <span>
            한글, 영문자, 숫자로만 이루어진 2~10자의 닉네임을 입력해주세요.
          </span>
          <div className={styles.formGrop}>
            <input
              type="text"
              value={formData.nickname}
              name="nickname"
              onChange={handleChange}
              className={styles.inputNickname}
            />
            <button className={styles.chkBtn} onClick={handleCheckNickname}>
              중복확인
            </button>
          </div>
          {nicknameErrorMessage && (
            <p style={{ color: "red" }} className={styles.error}>
              {nicknameErrorMessage}
            </p>
          )}{" "}
          {/* 정규표현식 오류 메시지 */}
          {nicknameAvailable === false && (
            <p style={{ color: "green" }} className={styles.valid}>
              사용 가능한 닉네임입니다.
            </p>
          )}
          {nicknameAvailable === true && (
            <p style={{ color: "red" }} className={styles.valid}>
              이미 사용 중인 닉네임입니다.
            </p>
          )}
        </div>
        <div className={styles.emailBox}>
          <span className={styles.title}>이메일</span>
          <span>.com / .net / .org 형식의 이메일만 가능합니다.</span>
          <div className={styles.formGrop}>
            <input
              type="text"
              value={formData.email}
              name="email"
              onChange={handleChange}
              className={styles.inputEmail}
            ></input>
            <button className={styles.chkBtn} onClick={handleCheckEmail}>중복확인</button>
          </div>
          {emailErrorMessage && (
            <p style={{ color: "red" }} className={styles.error}>
              {emailErrorMessage}
            </p>
          )}{" "}
          {/* 정규표현식 오류 메시지 */}
          {emailAvailable === false && (
            <p style={{ color: "green" }} className={styles.valid}>
              사용 가능한 이메일입니다.
            </p>
          )}
          {emailAvailable === true && (
            <p style={{ color: "red" }} className={styles.valid}>
              이미 사용 중인 이메일입니다.
            </p>
          )}
        </div>
        <div className={styles.phoneBox}>
          <span className={styles.title}>전화번호</span>
          <input
            type="text"
            value={formData.phone}
            name="phone"
            onChange={handleChange}
            className={styles.inputPhone}
          ></input>
        </div>
        <div className={styles.addressBox}>
          <span className={styles.title}>주소</span>
          <input
            type="text"
            value={formData.zip_code}
            name="zip_code"
            onChange={handleChange}
            // readOnly
            required
          />
          <input
            type="text"
            value={formData.address}
            name="address"
            onChange={handleChange}
            // readOnly
            required
          />
          <input
            type="text"
            value={formData.detail_address}
            name="detail_address"
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={styles.addressBtn}
            onClick={handleAddress}
          >
            주소 검색
          </button>
        </div>
        <div className={styles.signupDateBox}>
          <span className={styles.title}>가입일자</span>
          <input
            type="text"
            value={signup_currentDate}
            name="name"
            disabled
          ></input>
        </div>
        <div className={styles.signout}>
          <button className={styles.linkBtn} onClick={handleDelete}>
            탈퇴하기
          </button>
        </div>
        <div className={styles.btns}>
          <button onClick={handleSubmit}>완료</button>
          <button onClick={() => navi("/mypage/main")}>취소</button>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalBox}>
            <DaumPostcode
              onComplete={completeHandler}
              style={{ height: "95%" }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
