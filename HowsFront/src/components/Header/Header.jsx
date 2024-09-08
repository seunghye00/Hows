import React, { useState, useEffect } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo_how.png'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './../../store/store';
import profile from "../../assets/images/마이페이지_프로필사진.jpg"

export const Header = () => {
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState('HowShop')
    const [activeSubMenu, setActiveSubMenu] = useState('홈')
    const [isFixed, setIsFixed] = useState(false)
    // const [session, setSession] = useState(false)
    const { isAuth, login, logout, setIsAuth } = useAuthStore()
    const [profileMenu, setProfileMenu] = useState(false);  // 상태 변수명 변경

    const handleMenuClick = menuName => {
        setActiveMenu(menuName)
        if (menuName === 'HowShop') {
            navigate('/products')
        } else if (menuName === 'HowStory') {
            navigate('/community')
        } else if (menuName === 'HowShare') {
            navigate('/')
        }
    }

    // const handleSubMenuClick = subMenu => {
    //     setActiveSubMenu(subMenu)
    // }

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsFixed(true)
        } else {
            setIsFixed(false)
        }
    }

    const handleProfileClick = () => {
        setProfileMenu((prev) => !prev);
    };
    const handleItemClick = () => {
        setProfileMenu(false);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("정말 로그아웃을 하시겠습니까?");
        if (confirmLogout) {
            logout();
            sessionStorage.removeItem("token");
            setIsAuth(false);
            navigate('/');
        }
    };

    useEffect(() => {
        // 세션스토리지에서 토큰 확인
        const token = sessionStorage.getItem("token");
        if (token) {
            login(token);  // 토큰이 있으면 로그인
        } else {
            logout(); // 토큰이 없으면 로그아웃
            setIsAuth(false);
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [login, logout, setIsAuth])

    return (
        <div className="header">
            <div className={styles.headerWrap}>
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
                                    // session
                                    isAuth
                                        ? `${styles.infoUser}`
                                        : `${styles.infoIcon}`
                                }
                            >
                                {
                                    // session
                                    isAuth
                                        ? (
                                            <div className={styles.infoUser}>
                                                <img
                                                    src={profile}
                                                    alt="User"
                                                    onClick={handleProfileClick}
                                                />
                                                {profileMenu && (
                                                    <div className={styles.profileMenu}>
                                                        <div
                                                            className={styles.profileMenuItem}
                                                            onClick={() => {
                                                                navigate('/mypage');
                                                                handleItemClick();
                                                            }}
                                                        >
                                                            마이페이지
                                                        </div>
                                                        <div
                                                            className={styles.profileMenuItem}
                                                            onClick={() => {
                                                                handleLogout();
                                                                handleItemClick();
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
