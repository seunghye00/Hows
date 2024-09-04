import styles from './SignUp.module.css'
import DaumPostcode from "react-daum-postcode";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { host } from '../config/config';
import { useMemberStore } from '../store/store';

export const SignUp = () => {
    const navi = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        pw: "",
        pw2: "",
        name: "",
        birth: "",
        gender: "",
        nickname: "",
        email: "",
        phone: "",
        zipCode: "",
        address: "",
        detailAddress: "",
    });
    // const { member, setMember } = useMemberStore(); // Zustand store 사용
    const [gender, setGender] = useState({ male: false, female: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    useEffect(() => {
        // 다음 주소 API 스크립트 로드
        const script = document.createElement("script");
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => {
            // 스크립트가 로드되면 Postcode 사용 가능
            console.log("다음 주소 API가 로드되었습니다.");
        };
        document.head.appendChild(script);

        // 클린업 함수 (옵션)
        return () => {
            document.head.removeChild(script);
        };
    }, []);
    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                // 주소와 우편번호 데이터를 formData 상태에 저장
                setFormData((prev) => ({
                    ...prev,
                    address: data.address,
                    zipCode: data.zonecode,
                }));
            },
        }).open();
    };



    // 체크박스 상태 변경 핸들러
    const handleCheckboxChange = (event) => {
        const value = event.target.value;

        let genderText = "";
        if (value === "male") {
            genderText = "남";
        } else if (value === "female") {
            genderText = "여";
        }

        setFormData((prev) => ({
            ...prev,
            gender: genderText,
        }));
    };



    // 유효성
    const validateFormData = (formData) => {
        // 아이디 검사
        if (!formData.id) {
            alert('아이디를 입력하세요.');
            return false;
        }
        // 아이디 유효성 검사: 4~12글자, 영어, 숫자만 허용
        const idPattern = /^[a-zA-Z0-9]{4,12}$/;
        if (!idPattern.test(formData.id)) {
            alert('아이디는 영어, 숫자로 이루어진 4~12자를 입력해주세요.');
            return false;
        }

        // 비밀번호 검사
        if (!formData.pw) {
            alert('비밀번호를 입력하세요.');
            return false;
        }
        // 비밀번호 확인
        if (formData.pw !== formData.pw2) {
            alert('비밀번호가 일치하지 않습니다.');
            return false;
        }
        // 비밀번호 유효성 검사: 최소 8자 이상, 영문자, 숫자, 특수문자 포함
        const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwPattern.test(formData.pw)) {
            alert('비밀번호는 최소 8자 이상이어야 하며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
            return false;
        }

        // 이름 검사
        if (!formData.name) {
            alert('이름을 입력하세요.');
            return false;
        }
        const namePattern = /^[가-힣]{2,5}$/;
        if (!namePattern.test(formData.name)) {
            alert('이름은 한글로 2글자에서 5글자까지 입력할 수 있습니다.');
            return false;
        }

        // 닉네임 검사
        if (!formData.nickname) {
            alert('닉네임을 입력하세요.');
            return false;
        }
        const nicknamePattern = /^[가-힣]{2,10}$/; // ***********수정하기 
        if (!nicknamePattern.test(formData.nickname)) {
            alert('닉네임은 한글, 영문자, 숫자 포함하여 2~10자까지 입력할 수 있습니다.');
            return false;
        }

        // 생년월일 검사
        if (!formData.birth) {
            alert('생년월일을 입력하세요.');
            return false;
        }
        const birthPattern = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
        if (formData.birth && !birthPattern.test(formData.birth)) {
            alert('유효한 생년월일을 입력하세요. (예: 19900101)');
            return false;
        }
        // 성별 검사
        if (!formData.gender) {
            alert('성별을 선택하세요.');
            return false;
        }
        // 이메일 검사
        if (!formData.email) {
            alert('이메일을 입력하세요.');
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org)$/;
        if (!emailPattern.test(formData.email)) {
            alert('사용할 수 없는 형식의 이메일입니다');
            return false;
        }

        // 전화번호 검사
        if (!formData.phone) {
            alert('전화번호를 입력하세요.');
            return false;
        }
        // 전화번호 유효성 검사: 한국 전화번호 형식 (예: 01012345678)
        const phonePattern = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/;
        if (formData.phone && !phonePattern.test(formData.phone)) {
            alert('유효한 전화번호를 입력하세요. (예: 01012345678)');
            return false;
        }

        // 주소 검사
        if (!formData.zipCode || !formData.address) {
            alert('주소를 입력해주세요.');
            return false;
        }
        if (!formData.detailAddress) {
            alert('상세주소를 입력해주세요.');
            return false;
        }

        // 모든 필드가 채워진 경우 true 반환
        return true;
    };






    // 회원가입 버튼
    const handleSubmit = (e) => {
        // e.preventDefault(); // 기본 폼 제출 방지
        // if (validateFormData(formData)) {
        //     console.log("폼 데이터가 유효합니다:", formData);
        // }

        //===============================
        e.preventDefault();

        // 유효성 검사 실행
        if (!validateFormData(formData)) {
            // 유효성 검사를 통과하지 못하면 더 이상 진행하지 않음
            return;
        }

        // // 유효성 검사를 통과하면 서버에 데이터 전송
        axios.post(`${host}/member`, formData).then(resp => {
            console.log("회원가입 : ", resp.data);
            alert('회원가입이 성공적으로 완료되었습니다.');
            // setMember([...member, resp.data]);
            // navi("/");

        }).catch(error => {
            alert('회원가입 중 오류가 발생했습니다.');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.signUpBox}>
                <h3>회원가입</h3>
                <div className={styles.idBox}>
                    <span>ID</span>
                    <span>
                        영어, 숫자로만 이루어진 4~12자의 ID를 입력해주세요.
                    </span>
                    <div className={styles.formGrop}>
                        <input
                            type="text"
                            placeholder="ID"
                            name="id"
                            onChange={handleChange}
                            className={styles.inputId}
                        ></input>
                        <button className={styles.chkBtn}>중복확인</button>
                    </div>
                </div>
                <div className={styles.pwBox}>
                    <span>비밀번호</span>
                    <span>
                        영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.
                    </span>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        name="pw"
                        onChange={handleChange}
                        className={styles.inputPw}
                    ></input>
                </div>
                <div className={styles.pwBox2}>
                    <span>비밀번호 확인</span>
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        name="pw2"
                        onChange={handleChange}
                        className={styles.inputPw2}
                    ></input>
                </div>
                <div className={styles.nameBox}>
                    <span>이름</span>
                    <input
                        type="text"
                        placeholder="이름"
                        name="name"
                        onChange={handleChange}
                        className={styles.inputName}
                    ></input>
                </div>
                <div className={styles.nicknameBox}>
                    <span>닉네임</span>
                    <span>
                        한글, 영문자, 숫자 포함 2~10자의 닉네임을 입력해주세요.
                    </span>
                    <div className={styles.formGrop}>
                        <input
                            type="text"
                            placeholder="닉네임"
                            name="nickname"
                            onChange={handleChange}
                            className={styles.inputNickname}
                        ></input>
                        <button className={styles.chkBtn}>중복확인</button>
                    </div>
                </div>
                <div className={styles.birthBox}>
                    <span>생년월일</span>
                    <input
                        type="text"
                        placeholder="YYYYMMDD"
                        name="birth"
                        onChange={handleChange}
                        className={styles.inputBirth}
                    ></input>
                </div>
                <div className={styles.genderBox}>
                    <label>
                        남
                        <input
                            type="checkbox"
                            name="gender"
                            value="male"
                            checked={formData.gender === "남"}
                            onChange={handleCheckboxChange}
                        />
                    </label>
                    <label>
                        여
                        <input
                            type="checkbox"
                            name="gender"
                            value="female"
                            checked={formData.gender === "여"}
                            onChange={handleCheckboxChange}
                        />
                    </label>
                </div>
                <div className={styles.emailBox}>
                    <span>이메일</span>
                    <span>.com / .net / .org 형식의 이메일만 가능합니다.</span>
                    <input
                        type="text"
                        placeholder="이메일"
                        name="email"
                        onChange={handleChange}
                        className={styles.inputEmail}
                    ></input>
                </div>
                <div className={styles.phoneBox}>
                    <span>전화번호</span>
                    <input
                        type="text"
                        placeholder="( - ) 제외 ex) 01011112222"
                        name="phone"
                        onChange={handleChange}
                        className={styles.inputPhone}
                    ></input>
                </div>
                <div className={styles.addressBox}>
                    <span>주소</span>
                    <input
                        type="text"
                        placeholder="우편번호"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        // readOnly
                        required
                    />
                    <input
                        type="text"
                        placeholder="주소"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        // readOnly
                        required
                    />
                    <input
                        type="text"
                        placeholder="상세주소"
                        name="detailAddress"
                        value={formData.detailAddress}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.addressBtn}
                        onClick={handleAddressSearch}
                    >
                        주소 검색
                    </button>
                </div>
                <div className={styles.btns}>
                    <button onClick={handleSubmit}>회원가입</button>
                    <button>취소</button>
                </div>
                <div className={styles.login}>
                    <span>이미 아이디가 있으신가요? </span>
                    <button className={styles.linkBtn} onClick={() => navi("/")}>로그인</button>
                </div>
            </div>
        </div>
    );
};
