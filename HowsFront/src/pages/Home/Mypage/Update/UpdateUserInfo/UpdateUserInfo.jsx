import styles from "./UpdateUserInfo.module.css"
import profile from "../../../../../assets/images/마이페이지_프로필사진.jpg";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { host } from '../../../../../config/config'
import { api } from "../../../../../config/config";
import { format } from "date-fns";
import { useAuthStore } from "../../../../../store/store";
import { userInfo } from "../../../../../api/member";

export const UpdateUserInfo = () => {

    const navi = useNavigate()
    const [formData, setFormData] = useState({
        member_id: '',
        pw: '',
        pw2: '',
        name: '',
        birth: '',
        gender: '',
        nickname: '',
        email: '',
        phone: '',
        zip_code: '',
        address: '',
        detail_address: '',
    })
    const [user, setUser] = useState([]);
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
    const [nicknameAvailable, setNicknameAvailable] = useState(null);
    const [checkNicknameStatus, setCheckNicknameStatus] = useState('');
    const [nicknameChecked, setNicknameChecked] = useState(false); // 중복확인 상태 검사
    const { setIsAuth } = useAuthStore();

    useEffect(() => {
        // 회원정보 가져오기
        userInfo().then((resp) => {
            setUser(resp.data);
        });
    }, []);

    useEffect(() => {
        // user 데이터가 있을 경우, formData 초기화
        if (user) {
            setFormData({
                member_id: user.member_id,
                pw: '',
                pw2: '',
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'nickname') {
            setNicknameChecked(false);
        }
    };

    // 닉네임 중복확인 핸들러
    const handleCheckNickname = () => {
        // 닉네임 유효성 검사
        const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,7}$/;
        if (!nicknamePattern.test(formData.nickname)) {
            alert('닉네임은 한글, 영문자, 숫자로 이루어진 2~7자를 입력해주세요.');
            setNicknameErrorMessage('다시 입력해주세요');
            setNicknameAvailable(null);
            return;
        } else {
            setNicknameErrorMessage(''); // 오류 메시지 초기화
        }

        // 중복확인 요청
        checkNickname(formData.nickname).then((resp) => {
            console.log("nickname : ", resp.data);
            setNicknameAvailable(resp.data);
            setNicknameChecked(!resp.data);
            setCheckNicknameStatus(
                resp.data
                    ? "이미 사용 중인 닉네임입니다."
                    : "사용 가능한 닉네임입니다."
            );
        });
    }



    useEffect(() => {
        // 다음 주소 API 스크립트 로드
        const script = document.createElement('script')
        script.src =
            'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        script.async = true
        script.onload = () => {
            // 스크립트가 로드되면 Postcode 사용 가능
            console.log('다음 주소 API가 로드되었습니다.')
        }
        document.head.appendChild(script)

        // 클린업 함수 (옵션)
        return () => {
            document.head.removeChild(script)
        }
    }, [])
    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                // 주소와 우편번호 데이터를 formData 상태에 저장
                setFormData(prev => ({
                    ...prev,
                    address: data.address,
                    zip_code: data.zonecode,
                }))
            },
        }).open()
    }


    // 유효성
    const validateFormData = formData => {
        // 닉네임 검사
        if (!formData.nickname) {
            alert('닉네임을 입력하세요.')
            return false
        }
        const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,7}$/
        if (!nicknamePattern.test(formData.nickname)) {
            alert(
                '닉네임은 한글, 영문자, 숫자 포함하여 2~7자까지 입력할 수 있습니다.'
            )
            return false
        }

        // 이메일 검사
        if (!formData.email) {
            alert('이메일을 입력하세요.')
            return false
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org)$/
        if (!emailPattern.test(formData.email)) {
            alert('사용할 수 없는 형식의 이메일입니다')
            return false
        }

        // 전화번호 검사
        if (!formData.phone) {
            alert('전화번호를 입력하세요.')
            return false
        }
        // 전화번호 유효성 검사: 한국 전화번호 형식 (예: 01012345678)
        const phonePattern = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/
        if (formData.phone && !phonePattern.test(formData.phone)) {
            alert('유효한 전화번호를 입력하세요. (예: 01012345678)')
            return false
        }

        // 주소 검사
        if (!formData.zip_code || !formData.address) {
            alert('주소를 입력해주세요.')
            return false
        }
        if (!formData.detail_address) {
            alert('상세주소를 입력해주세요.')
            return false
        }

        // 모든 필드가 채워진 경우 true 반환
        return true
    }

    // 정보수정 완료 버튼
    const handleSubmit = e => {
        e.preventDefault(); // 기본 폼 제출 방지
        // 유효성 검사 실행
        if (!validateFormData(formData)) {
            return
        }

        if (!nicknameChecked) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        // 유효성 검사를 통과하면 서버에 데이터 전송
        api.put(`/member/updateInfo`, formData).then(resp => {
            if (resp.data > 0) {
                alert('회원정보가 성공적으로 수정되었습니다.')
                navi("/mypage/main");
            }
        }).catch(error => {
            alert('회원정보수정 중 오류가 발생했습니다.')
        })
    }

    const handleDelete = () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");
        if (confirmDelete) {
            api.delete(`/member/deleteUser/${user.member_id}`).then(resp => {
                if (resp.data > 0) {
                    alert("성공적으로 탈퇴되었습니다.");
                    sessionStorage.removeItem('token'); // 토큰 삭제
                    setIsAuth(false); // 인증 상태 업데이트
                    navi("/")
                } else {
                    console.log("탈퇴 중 오류 발생: ", resp.data);
                }
            }).catch(error => {
                console.error("탈퇴 중 오류 발생: ", error);
            });
        }
    };



    const signup_date = new Date(user.signup_date);
    const signup_currentDate = !isNaN(signup_date)
        ? format(signup_date, "yyyy-MM-dd")
        : "Invalid Date";

    return (
        <div className={styles.container}>
            <div className={styles.updateInfo}>
                <div className={styles.profileBox}>
                    <div className={styles.img}>
                        <img src={profile}></img>
                    </div>
                    <div className={styles.profileBtns}>
                        <button>변경</button>
                        <button>삭제</button>
                    </div>
                </div>
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
                                    checked={formData.gender === 'M'}
                                    disabled
                                />
                            </label>
                            <label>
                                여
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'F'}
                                    disabled
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className={styles.nicknameBox}>
                    <span className={styles.title}>닉네임</span>
                    <span>
                        한글, 영문자, 숫자로만 이루어진 2~7자의 닉네임을
                        입력해주세요.
                    </span>
                    <div className={styles.formGrop}>
                        <input
                            type="text"
                            value={formData.nickname}
                            name="nickname"
                            onChange={handleChange}
                            className={styles.inputNickname}
                        />
                        <button className={styles.chkBtn} onClick={handleCheckNickname}>중복확인</button>
                    </div>
                    {nicknameErrorMessage && <p style={{ color: 'red' }} className={styles.error}>{nicknameErrorMessage}</p>} {/* 정규표현식 오류 메시지 */}
                    {nicknameAvailable === false && (
                        <p style={{ color: 'green' }} className={styles.valid}>사용 가능한 닉네임입니다.</p>
                    )}
                    {nicknameAvailable === true && (
                        <p style={{ color: 'red' }} className={styles.valid}>이미 사용 중인 닉네임입니다.</p>
                    )}
                </div>
                <div className={styles.emailBox}>
                    <span className={styles.title}>이메일</span>
                    <span>.com / .net / .org 형식의 이메일만 가능합니다.</span>
                    <input
                        type="text"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                        className={styles.inputEmail}
                    ></input>
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
                        onClick={handleAddressSearch}
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
                    <button className={styles.linkBtn} onClick={handleDelete}>탈퇴하기</button>
                </div>
                <div className={styles.btns}>
                    <button onClick={handleSubmit}>완료</button>
                    <button onClick={() => navi("/mypage/main")}>취소</button>
                </div>
            </div>
        </div >
    )

}