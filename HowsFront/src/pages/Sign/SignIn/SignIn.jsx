import styles from './SignIn.module.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../../../assets/images/로그인_로고.png'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore, useMemberStore } from './../../../store/store'
import { FindId } from './FindId/FindId'
import { loginUser } from '../../../api/member'
import Swal from 'sweetalert2'

export const SignIn = () => {
    const navi = useNavigate()
    const [user, setUser] = useState({ member_id: '', pw: '' })
    const { login } = useAuthStore()
    const { setCurrentUser } = useMemberStore()
    const [page, setPage] = useState('login')
    const [rememberId, setRememberId] = useState(false) // 아이디 기억하기 상태
    const [showPassword, setShowPassword] = useState(false) // 비밀번호 표시 상태

    // 페이지 로드 시 localStorage에서 member_id 가져오기
    useEffect(() => {
        const savedMemberId = localStorage.getItem('member_id')
        if (savedMemberId) {
            setUser(prev => ({ ...prev, member_id: savedMemberId }))
            setRememberId(true) // 아이디 저장 체크
        }
    }, [])

    const handleInputLogin = e => {
        const { name, value } = e.target
        setUser(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLoginBtn = () => {
        loginUser(user)
            .then(resp => {
                const data = resp.data

                // 로그인 성공 처리
                const token = data.token // 서버 응답에서 token 분해 할당
                const decoded = jwtDecode(token)

                sessionStorage.setItem('token', token)
                sessionStorage.setItem('member_id', decoded.sub) // 사용자 ID 저장
                sessionStorage.setItem('nickname', decoded.nickname) // 사용자 닉네임 저장
                sessionStorage.setItem('member_avatar', decoded.member_avatar) // 사용자 프로필사진 저장

                // 체크박스 상태에 따라 localStorage에 member_id 저장
                if (rememberId) {
                    localStorage.setItem('member_id', decoded.sub)
                } else {
                    localStorage.removeItem('member_id') // 체크박스가 해제된 경우 삭제
                }

                setCurrentUser({
                    nickname: decoded.nickname,
                    member_avatar: decoded.member_avatar,
                })

                login(token)

                Swal.fire({
                    title: '로그인',
                    text: `${decoded.nickname} 님 환영합니다.`,
                    icon: 'success',
                    confirmButtonText: '확인',
                })
                if (resp.data.member_roleCode === 'R1') {
                    navi('/admin/home')
                } else {
                    navi('/') // 메인 페이지로 이동
                }
            })
            .catch(error => {
                console.error(error)
                // 에러 응답에 따른 처리

                if (error.response && error.response.status === 423) {
                    Swal.fire({
                        title: "경고!",
                        text: "계정이 블랙리스트로 처리되어 로그인이 불가능합니다.",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                } else {
                    Swal.fire({
                        title: "경고!",
                        text: "로그인에 실패하였습니다.",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                }
            })
    }

    const handlePageChange = newPage => {
        setPage(newPage)
    }

    if (page === 'findId') {
        return <FindId onBack={() => handlePageChange('login')} />
    }
    if (page === 'findPw') {
        navi('/signIn/findPw')
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.logo} onClick={() => navi('/')}>
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
                    value={user.member_id}
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="pw"
                    onChange={handleInputLogin}
                    onKeyDown={e => e.key === 'Enter' && handleLoginBtn()}
                    placeholder="비밀번호"
                    className={styles.input}
                    value={user.pw}
                />
                <div className={styles.loginTool}>
                    <div className={styles.tool}>
                        <input
                            type="checkbox"
                            checked={rememberId}
                            onChange={() => setRememberId(prev => !prev)}
                        />
                        <span>아이디 저장</span>
                    </div>
                    <div className={styles.tool}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(prev => !prev)}
                        />
                        <span>비밀번호 표시</span>
                    </div>
                </div>
                <button className={styles.loginBtn} onClick={handleLoginBtn}>
                    로그인
                </button>
                <div className={styles.links}>
                    <button
                        onClick={() => handlePageChange('findId')}
                        className={styles.linkBtn}
                    >
                        아이디 찾기
                    </button>
                    <button
                        onClick={() => handlePageChange('findPw')}
                        className={styles.linkBtn}
                    >
                        비밀번호 찾기
                    </button>
                </div>
                <button
                    className={styles.signUpBtn}
                    onClick={() => navi('/signUp')}
                >
                    회원가입
                </button>
            </div>
        </div>
    )
}
