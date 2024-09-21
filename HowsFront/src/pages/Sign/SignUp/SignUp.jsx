import styles from './SignUp.module.css'
import DaumPostcode from 'react-daum-postcode'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { host } from '../../../config/config'
import Swal from 'sweetalert2'
import { Modal } from './../../../components/Modal/Modal';
import { checkEmailForSignUp, checkId, checkIdForSignUp, checkNicknameForSignUp } from '../../../api/member'

export const SignUp = () => {
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

    /* 중복검사 (true일 경우 이미 사용 중) */
    const [idAvailable, setIdAvailable] = useState(null);
    const [nicknameAvailable, setNicknameAvailable] = useState(null);
    const [emailAvailable, setEmailAvailable] = useState(null);

    /* 중복검사 후 보여지는 span 상태 */
    const [checkIdStatus, setCheckIdStatus] = useState('');
    const [checkNicknameStatus, setCheckNicknameStatus] = useState('');
    const [checkEmailStatus, setCheckEmailStatus] = useState('');

    /* 에러 메세지 */
    const [idErrorMessage, setIdErrorMessage] = useState('');
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    /* 중복확인 버튼 눌렀는지 (false일 경우 누르지 않은) */
    const [idChecked, setIdChecked] = useState(false); // 중복확인 상태 검사
    const [nicknameChecked, setNicknameChecked] = useState(false); // 중복확인 상태 검사
    const [emailChecked, setEmailChecked] = useState(false); // 중복확인 상태 검사

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [addressCheck, setAddressCheck] = useState({ default: true, direct: false }); // 주소 체크 항목


    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))

        // input창 변경 시
        if (name === 'member_id') {
            setIdChecked(false);
        } else if (name === 'nickname') {
            setNicknameChecked(false);
        }
    }

    // 중복확인 버튼 핸들러
    const handleCheckId = () => {
        // ID 유효성 검사
        const idPattern = /^[a-zA-Z0-9]{4,12}$/;
        if (!idPattern.test(formData.member_id)) {
            Swal.fire({
                title: "경고!",
                text: "아이디는 영어, 숫자로 이루어진 4~12자를 입력해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            setIdErrorMessage('다시 입력해주세요');
            setIdAvailable(null);
            return;
        } else {
            setIdErrorMessage(''); // 오류 메시지 초기화
        }

        // 중복확인 요청
        checkIdForSignUp(formData.member_id).then((resp) => {
            setIdAvailable(resp.data);
            setIdChecked(!resp.data);
            setCheckIdStatus(
                resp.data ? "이미 사용 중인 ID입니다." : "사용 가능한 ID입니다."
            );
        });
    }

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
            setNicknameErrorMessage('다시 입력해주세요');
            setNicknameAvailable(null);
            return;
        } else {
            setNicknameErrorMessage(''); // 오류 메시지 초기화
        }

        // 중복확인 요청
        checkNicknameForSignUp(formData.nickname).then(resp => {
            setNicknameAvailable(resp.data);
            setNicknameChecked(!resp.data);
            setCheckNicknameStatus(resp.data ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
        });
    }

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
            setEmailErrorMessage('다시 입력해주세요');
            setEmailAvailable(null);
            return;
        } else {
            setEmailErrorMessage(''); // 오류 메시지 초기화
        }

        // 중복확인 요청
        checkEmailForSignUp(formData.email).then(resp => {
            setEmailAvailable(resp.data);
            setEmailChecked(!resp.data);
            setCheckEmailStatus(resp.data ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
        });
    }



    // 주소 찾기
    const handleAddress = () => {
        // SwalComp({ type: "confirm", text: "주소를 변경하시곘습니까?" }).then(res => {
        // if (res) {
        setAddressCheck(prev => ({ default: false, direct: true }));
        setIsModalOpen(true);
        // }
        // });
    }
    /** postcode data set **/
    const completeHandler = (data) => {
        setIsModalOpen(false);
        setFormData(prev => ({
            ...prev,
            zip_code: data.zonecode,
            address: data.address
        }));
    }

    // 체크박스 상태 변경 핸들러
    const handleCheckboxChange = event => {
        const value = event.target.value

        let genderText = ''
        if (value === 'male') {
            genderText = 'M'
        } else if (value === 'female') {
            genderText = 'F'
        }

        setFormData(prev => ({
            ...prev,
            gender: genderText,
        }))
    }

    // 유효성
    const validateFormData = formData => {
        // 아이디 검사
        if (!formData.member_id) {
            Swal.fire({
                title: "경고!",
                text: "아이디를 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        // 아이디 유효성 검사: 4~12글자, 영어, 숫자만 허용
        const idPattern = /^[a-zA-Z0-9]{4,12}$/
        if (!idPattern.test(formData.member_id)) {
            Swal.fire({
                title: "경고!",
                text: "아이디는 영어, 숫자로 이루어진 4~12자를 입력해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 비밀번호 검사
        if (!formData.pw) {
            Swal.fire({
                title: "경고!",
                text: "비밀번호를 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        // 비밀번호 확인
        if (formData.pw !== formData.pw2) {
            Swal.fire({
                title: "경고!",
                text: "비밀번호가 일치하지 않습니다.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        // 비밀번호 유효성 검사: 최소 8자 이상, 영문자, 숫자, 특수문자 포함
        const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        if (!pwPattern.test(formData.pw)) {
            Swal.fire({
                title: "경고!",
                text: "비밀번호는 최소 8자 이상이어야 하며, 영문자, 숫자, 특수문자를 포함해야 합니다.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 이름 검사
        if (!formData.name) {
            Swal.fire({
                title: "경고!",
                text: "이름을 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        const namePattern = /^[가-힣]{2,5}$/
        if (!namePattern.test(formData.name)) {
            Swal.fire({
                title: "경고!",
                text: "이름은 한글로 2글자에서 5글자까지 입력할 수 있습니다.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 닉네임 검사
        if (!formData.nickname) {
            Swal.fire({
                title: "경고!",
                text: "닉네임을 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,10}$/
        if (!nicknamePattern.test(formData.nickname)) {
            Swal.fire({
                title: "경고!",
                text: "닉네임은 한글, 영문자, 숫자로 이루어진 2~10자를 입력해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 생년월일 검사
        if (!formData.birth) {
            Swal.fire({
                title: "경고!",
                text: "생년월일을 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        const birthPattern = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/
        if (formData.birth && !birthPattern.test(formData.birth)) {
            Swal.fire({
                title: "경고!",
                text: "유효한 생년월일을 입력하세요. (예: 19900101)",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        // 성별 검사
        if (!formData.gender) {
            Swal.fire({
                title: "경고!",
                text: "성별을 선택하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        // 이메일 검사
        if (!formData.email) {
            Swal.fire({
                title: "경고!",
                text: "이메일을 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org)$/
        if (!emailPattern.test(formData.email)) {
            Swal.fire({
                title: "경고!",
                text: "사용할 수 없는 형식의 이메일입니다.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 전화번호 검사
        if (!formData.phone) {
            Swal.fire({
                title: "경고!",
                text: "전화번호를 입력하세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        // 전화번호 유효성 검사: 한국 전화번호 형식 (예: 01012345678)
        const phonePattern = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/
        if (formData.phone && !phonePattern.test(formData.phone)) {
            Swal.fire({
                title: "경고!",
                text: "유효한 전화번호를 입력하세요. (예: 01012345678)",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 주소 검사
        if (!formData.zip_code || !formData.address) {
            Swal.fire({
                title: "경고!",
                text: "주소를 입력해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }
        if (!formData.detail_address) {
            Swal.fire({
                title: "경고!",
                text: "상세주소를 입력해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return false
        }

        // 모든 필드가 채워진 경우 true 반환
        return true
    }

    // 회원가입 버튼
    const handleSubmit = e => {
        e.preventDefault()

        // 유효성 검사 실행
        if (!validateFormData(formData)) {
            return;
        }

        // 중복 확인 상태 체크
        if (idAvailable === null) {
            Swal.fire({
                title: "경고!",
                text: "아이디 중복 확인을 해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }
        if (nicknameAvailable === null) {
            Swal.fire({
                title: "경고!",
                text: "닉네임 중복 확인을 해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }
        if (emailAvailable === null) {
            Swal.fire({
                title: "경고!",
                text: "이메일 중복 확인을 해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }

        // 중복 확인 버튼 감지
        if (!idChecked) {
            Swal.fire({
                title: "경고!",
                text: "아이디 중복 확인을 해주세요.",
                icon: "warning",
                confirmButtonText: "확인",
            });
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

        // 유효성 검사를 통과하면 서버에 데이터 전송
        axios
            .post(`${host}/member`, formData)
            .then(resp => {
                Swal.fire({
                    title: "성공!",
                    text: "회원가입이 성공적으로 완료되었습니다.",
                    icon: "success",
                    confirmButtonText: "확인",
                });
                navi("/");
            })
            .catch(error => {
                Swal.fire({
                    title: "경고!",
                    text: "회원가입 중 오류가 발생했습니다.",
                    icon: "error",
                    confirmButtonText: "확인",
                });
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.signUpBox}>
                <h3>회원가입</h3>
                <div className={styles.idBox}>
                    <span className={styles.title}>ID</span>
                    <span>
                        영어, 숫자로만 이루어진 4~12자의 ID를 입력해주세요.
                    </span>
                    <div className={styles.formGrop}>
                        <input
                            type="text"
                            placeholder="ID"
                            name="member_id"
                            onChange={handleChange}
                            className={styles.inputId}
                        ></input>
                        <button className={styles.chkBtn} onClick={handleCheckId}>중복확인</button>
                    </div>
                    {idErrorMessage && <p style={{ color: 'red' }} className={styles.error}>{idErrorMessage}</p>} {/* 정규표현식 오류 메시지 */}
                    {idAvailable === false && (
                        <p style={{ color: 'green' }} className={styles.valid}>사용 가능한 ID입니다.</p>
                    )}
                    {idAvailable === true && (
                        <p style={{ color: 'red' }} className={styles.valid}>이미 사용 중인 ID입니다.</p>
                    )}
                </div>
                <div className={styles.pwBox}>
                    <span className={styles.title}>비밀번호</span>
                    <span>
                        영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를
                        입력해주세요.
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
                    <span className={styles.title}>비밀번호 확인</span>
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        name="pw2"
                        onChange={handleChange}
                        className={styles.inputPw2}
                    ></input>
                </div>
                <div className={styles.nameBox}>
                    <span className={styles.title}>이름</span>
                    <input
                        type="text"
                        placeholder="이름"
                        name="name"
                        onChange={handleChange}
                        className={styles.inputName}
                    ></input>
                </div>
                <div className={styles.nicknameBox}>
                    <span className={styles.title}>닉네임</span>
                    <span>
                        한글, 영문자, 숫자로만 이루어진 2~10자의 닉네임을
                        입력해주세요.
                    </span>
                    <div className={styles.formGrop}>
                        <input
                            type="text"
                            placeholder="닉네임"
                            name="nickname"
                            onChange={handleChange}
                            className={styles.inputNickname}
                        ></input>
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
                <div className={styles.birthBox}>
                    <span className={styles.title}>생년월일</span>
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
                            checked={formData.gender === 'M'}
                            onChange={handleCheckboxChange}
                        />
                    </label>
                    <label>
                        여
                        <input
                            type="checkbox"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'F'}
                            onChange={handleCheckboxChange}
                        />
                    </label>
                </div>
                <div className={styles.emailBox}>
                    <span className={styles.title}>이메일</span>
                    <span>.com / .net / .org 형식의 이메일만 가능합니다.</span>
                    <div className={styles.formGrop}>
                        <input
                            type="text"
                            placeholder="이메일"
                            name="email"
                            onChange={handleChange}
                            className={styles.inputEmail}
                        ></input>
                        <button className={styles.chkBtn} onClick={handleCheckEmail}>중복확인</button>
                    </div>
                    {emailAvailable === false && (
                        <p style={{ color: 'green' }} className={styles.valid}>사용 가능한 이메일입니다.</p>
                    )}
                    {emailAvailable === true && (
                        <p style={{ color: 'red' }} className={styles.valid}>이미 사용 중인 이메일입니다.</p>
                    )}
                </div>
                <div className={styles.phoneBox}>
                    <span className={styles.title}>전화번호</span>
                    <input
                        type="text"
                        placeholder="( - ) 제외 ex) 01011112222"
                        name="phone"
                        onChange={handleChange}
                        className={styles.inputPhone}
                    ></input>
                </div>
                <div className={styles.addressBox}>
                    <span className={styles.title}>주소</span>
                    <input
                        type="text"
                        placeholder="우편번호"
                        name="zip_code"
                        value={formData.zip_code}
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
                        name="detail_address"
                        value={formData.detail_address}
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
                <div className={styles.btns}>
                    <button onClick={handleSubmit}>회원가입</button>
                    <button onClick={() => navi('/')}>홈으로</button>
                </div>
                <div className={styles.login}>
                    <span>이미 아이디가 있으신가요? </span>
                    <button
                        className={styles.linkBtn}
                        onClick={() => navi('/signIn')}
                    >
                        로그인
                    </button>
                </div>
            </div>
            {
                isModalOpen &&
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className={styles.modalBox}>
                        <DaumPostcode onComplete={completeHandler} style={{ height: '95%' }} />
                    </div>
                </Modal>
            }
        </div>
    )
}
