import React, { useState, useEffect } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo_how.png'
import logo1 from '../../assets/images/로그인_로고.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useMemberStore } from './../../store/store'
import profile from '../../assets/images/기본사진.jpg'
import { throttle } from 'lodash'
import { api } from './../../config/config' // API 요청을 위한 경로
import Swal from 'sweetalert2'
import {useProductStore} from "../../store/productStore";
import {SubHeader} from "../../pages/Home/Products/SubHeader/SubHeader";

export const Header = () => {
    const navigate = useNavigate()
    const location = useLocation() // 현재 경로 확인
    const [activeMenu, setActiveMenu] = useState('Shop')
    const [isFixed, setIsFixed] = useState(false)
    const { isAuth, login, logout, setIsAuth } = useAuthStore()
    const [profileMenu, setProfileMenu] = useState(false)
    const [setProfileImage] = useState('') // 프로필 사진 상태
    const { currentUser } = useMemberStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false) // 메뉴 열림/닫힘 상태

    const [subHeader, setSubHeader] = useState(false); //서브헤더 관리 상태 
    let hideTimeout;

    const handleMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout); // 지연 시간을 초기화하여 서브헤더가 사라지지 않도록
        }
        setSubHeader(true); // 서브헤더 표시
    };

    const handleMouseLeave = () => {
        hideTimeout = setTimeout(() => {
            setSubHeader(false); // 서브헤더 숨김
        }, 100); // 200ms의 지연 시간
    };

    useEffect(() => {
        return () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        };
    }, []);

    const handleMenuClick = menuName => {
        setActiveMenu(menuName)

        if (window.innerWidth <= 768) {
            // 모바일 환경일 때만 메뉴 닫기
            setIsMenuOpen(false)
        }

        if (menuName === 'Shop') {
            navigate('/')
        } else if (menuName === 'Story') {
            navigate('/communities')
        } else if (menuName === 'Service') {
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
            setActiveMenu('Shop')
        } else if (location.pathname.includes('/communities')) {
            setActiveMenu('Story')
        } else if (location.pathname.includes('/csservice')) {
            setActiveMenu('Service')
        }
    }, [location.pathname])

    const toggleHamburgerMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div 
            className="header"         
            onMouseEnter={handleMouseEnter} // 마우스가 들어오면 서브헤더 표시
            onMouseLeave={handleMouseLeave} // 마우스가 나가면 서브헤더 숨김
        >
            <div className={styles.headerWrap}>
                {isFixed && <div className={styles.headerSpacer}></div>}
                <div
                    className={`${styles.headerCont} ${
                        isFixed ? styles.fixed : ''
                    }`}
                >
                    <div className={styles.mainNavi}>
                        <div className={styles.menuBox}>
                            <div
                                className={styles.hamburgerMenu}
                                onClick={toggleHamburgerMenu}
                            >
                                <i className="bx bx-menu"></i>
                            </div>
                            <div className={styles.mainLogo}>
                                <a
                                    onClick={() => {
                                        navigate('/')
                                    }}
                                >
                                    <img src={logo1} alt="Logo" />
                                </a>
                            </div>
                            <div className={styles.naviMenuList}>
                                <>
                                    <div
                                      className={`${styles.naviMenu} ${
                                        activeMenu === 'Shop'
                                          ? styles.active
                                          : ''
                                      }`}
                                      onClick={() => handleMenuClick('Shop')}
                                    >
                                        <a>Shop</a>
                                    </div>
                                </>


                                <div
                                  className={`${styles.naviMenu} ${
                                    activeMenu === 'Story'
                                      ? styles.active
                                      : ''
                                  }`}
                                  onClick={() => handleMenuClick('Story')}
                                >
                                    <a>Story</a>
                                </div>
                                <div
                                  className={`${styles.naviMenu} ${
                                    activeMenu === 'Service'
                                      ? styles.active
                                      : ''
                                    }`}
                                    onClick={() => handleMenuClick('Service')}
                                >
                                    <a>Service</a>
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
                            {/* <div className={styles.infoIcon}>
                                <a>
                                    <i className="bx bx-bell"></i>
                                </a>
                            </div> */}
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
            {isMenuOpen && (
                <div className={styles.overlay}>
                    <div className={styles.menuContent}>
                        <span
                            className={styles.closeButton}
                            onClick={toggleHamburgerMenu}
                        >
                            &times;
                        </span>
                        <div className={styles.hamburgerLogo}>
                            <a
                                onClick={() => {
                                    navigate('/')
                                }}
                            >
                                <img src={logo} alt="Logo" />
                            </a>
                        </div>
                        <ul className={styles.menuList}>
                            <li onClick={() => handleMenuClick('Shop')}>
                                Shop
                            </li>
                            <li onClick={() => handleMenuClick('Story')}>
                                Story
                            </li>
                            <li onClick={() => handleMenuClick('Service')}>
                                Service
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            {subHeader && <SubHeader />}
        </div>
    )
}
