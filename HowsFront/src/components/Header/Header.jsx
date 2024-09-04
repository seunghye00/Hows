import React, { useState, useEffect } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo_how.png'
import { useNavigate } from 'react-router-dom'

export const Header = () => {
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState('Main')
    const [activeSubMenu, setActiveSubMenu] = useState('홈')
    const [isFixed, setIsFixed] = useState(false)
    const [session, setSession] = useState(false)

    const handleMenuClick = menuName => {
        setActiveMenu(menuName)
        if (menuName === 'HowStory') {
            navigate('/Community')
        } else if (menuName === 'HowShop') {
            navigate('/products')
        } else if (menuName === 'Main') {
            navigate('/')
        }
    }

    const handleSubMenuClick = subMenu => {
        setActiveSubMenu(subMenu)
    }

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsFixed(true)
        } else {
            setIsFixed(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="header">
            <div className={styles.headerWrap}>
                <div
                    className={`${styles.headerCont} ${
                        isFixed ? styles.fixed : ''
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
                                    className={`${styles.naviMenu} ${
                                        activeMenu === 'Main'
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() => handleMenuClick('Main')}
                                >
                                    <a>Main</a>
                                </div>
                                <div
                                    className={`${styles.naviMenu} ${
                                        activeMenu === 'HowStory'
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() => handleMenuClick('HowStory')}
                                >
                                    <a>HowStory</a>
                                </div>
                                <div
                                    className={`${styles.naviMenu} ${
                                        activeMenu === 'HowShop'
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() => handleMenuClick('HowShop')}
                                >
                                    <a>HowShop</a>
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
                                    session
                                        ? `${styles.infoUser}`
                                        : `${styles.infoIcon}`
                                }
                            >
                                {session ? (
                                    <a>
                                        <img src="" alt="User" />
                                    </a>
                                ) : (
                                    <a>
                                        <i class="bx bxs-user-circle"></i>
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
