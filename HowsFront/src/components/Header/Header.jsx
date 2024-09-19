import React, { useState, useEffect } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo_how.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useMemberStore } from './../../store/store'
import profile from '../../assets/images/기본사진.jpg'
import { throttle } from 'lodash'
import { api } from './../../config/config' // API 요청을 위한 경로
import Swal from 'sweetalert2'

export const Header = () => {
    const navigate = useNavigate()
    const location = useLocation() // 현재 경로 확인
    const [activeMenu, setActiveMenu] = useState('HowShop')
    const [isFixed, setIsFixed] = useState(false)
    const { isAuth, login, logout, setIsAuth } = useAuthStore()
    const [profileMenu, setProfileMenu] = useState(false)
    const [setProfileImage] = useState('') // 프로필 사진 상태
    const { currentUser } = useMemberStore()

    const handleMenuClick = menuName => {
        setActiveMenu(menuName)
        if (menuName === 'HowShop') {
            navigate('/')
        } else if (menuName === 'HowStory') {
            navigate('/communities')
        } else if (menuName === 'HowShare') {
            navigate('/csservice')
        }
    }

    const handleScroll = throttle(() => {
        if (window.scrollY) {
            setIsFixed(true)
        } else {
            setIsFixed(false)
        }
    }) // 100ms마다 스크롤 이벤트 실행

    const handleProfileClick = () => {
        setProfileMenu(prev => !prev)
    }

    const handleItemClick = () => {
        setProfileMenu(false)
    }

    const handleMyPageClick = () => {
        const memberId = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
        if (memberId) {
            navigate(`/mypage/main/${memberId}`) // member_id를 포함한 경로로 이동
        } else {
            console.error('member_id가 없습니다.')
        }
    }

    const handleLogout = () => {
        Swal.fire({
            title: '로그아웃',
            text: '정말 로그아웃을 하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                logout()
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('member_id')
                sessionStorage.removeItem('member_avatar')
                sessionStorage.removeItem('nickname')
                setIsAuth(false)
                navigate('/')
            }
        })
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token) {
            login(token)

            // 사용자 정보 가져오기
            api.get('/member/selectInfo', {
                params: { member_id: sessionStorage.getItem('member_id') },
            })
                .then(resp => {
                    if (resp.data && resp.data.member_avatar) {
                        setProfileImage(resp.data.member_avatar) // 프로필 사진 URL 설정
                    }
                })
                .catch(error => {
                    console.error('사용자 정보 가져오기 오류:', error)
                })
        } else {
            logout()
            setIsAuth(false)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [login, logout, setIsAuth])

    // 현재 URL에 맞춰서 활성화된 메뉴 설정
    useEffect(() => {
        if (location.pathname === '/') {
            setActiveMenu('HowShop')
        } else if (location.pathname.includes('/communities')) {
            setActiveMenu('HowStory')
        } else if (location.pathname.includes('/howshare')) {
            setActiveMenu('HowShare')
        }
    }, [location.pathname])

    return (
        <div className="header">
            <div className={styles.headerWrap}>
                {isFixed && <div className={styles.headerSpacer}></div>}
                <div
                    className={`${styles.headerCont} ${isFixed ? styles.fixed : ''
                        }`}
                >
                    <div className={styles.mainNavi}>
                        <div className={styles.menuBox}>
                            <div className={styles.mainLogo}>
                                <a>
                                    <img src={logo} alt="Logo" />
                                </a>
                            </div>
                            <div className={styles.naviMenuList}>
                                <div
                                    className={`${styles.naviMenu} ${activeMenu === 'HowShop'
                                        ? styles.active
                                        : ''
                                        }`}
                                    onClick={() => handleMenuClick('HowShop')}
                                >
                                    <a>HowShop</a>
                                </div>
                                <div
                                    className={`${styles.naviMenu} ${activeMenu === 'HowStory'
                                        ? styles.active
                                        : ''
                                        }`}
                                    onClick={() => handleMenuClick('HowStory')}
                                >
                                    <a>HowStory</a>
                                </div>
                                <div
                                    className={`${styles.naviMenu} ${activeMenu === 'HowShare'
                                        ? styles.active
                                        : ''
                                        }`}
                                    onClick={() => handleMenuClick('HowShare')}
                                >
                                    <a>HowShare</a>
                                </div>
                            </div>
                        </div>
                        <div className={styles.naviInfo}>
                            <div className={styles.infoIcon}>
                                <a>
                                    <i className="bx bx-bookmark"></i>
                                </a>
                            </div>
                            <div className={styles.infoIcon}>
                                <a
                                    onClick={() => {
                                        navigate('/cart')
                                    }}
                                >
                                    <i className="bx bx-cart"></i>
                                </a>
                            </div>
                            <div className={styles.infoIcon}>
                                <a>
                                    <i className="bx bx-bell"></i>
                                </a>
                            </div>
                            <div
                                className={
                                    isAuth
                                        ? `${styles.infoUser}`
                                        : `${styles.infoIcon}`
                                }
                            >
                                {isAuth ? (
                                    <div>
                                        <div className={styles.profileImg}>
                                            <img
                                                src={
                                                    currentUser.member_avatar ||
                                                    profile
                                                } // 프로필 사진이 없으면 기본 이미지 사용
                                                alt="User"
                                                onClick={handleProfileClick}
                                                onError={e => {
                                                    // 이미지 로드 실패 시 기본 이미지로 대체
                                                    e.target.src = profile // 기본 이미지 경로로 변경
                                                }}
                                            />
                                        </div>
                                        {profileMenu && (
                                            <div className={styles.profileMenu}>
                                                <div
                                                    className={
                                                        styles.profileMenuItem
                                                    }
                                                    onClick={() => {
                                                        handleMyPageClick()
                                                        handleItemClick()
                                                    }}
                                                >
                                                    마이페이지
                                                </div>
                                                <div
                                                    className={
                                                        styles.profileMenuItem
                                                    }
                                                    onClick={() => {
                                                        navigate('/history')
                                                    }}
                                                >
                                                    My History
                                                </div>
                                                <div
                                                    className={
                                                        styles.profileMenuItem
                                                    }
                                                    onClick={() => {
                                                        handleLogout()
                                                        handleItemClick()
                                                    }}
                                                >
                                                    로그아웃
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <a onClick={() => navigate('/signIn')}>
                                        <i className="bx bxs-user-circle"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
