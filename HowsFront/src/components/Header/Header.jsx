import React, { useState, useEffect } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo_how.png'
import { useNavigate } from 'react-router-dom'

export const Header = () => {
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState('Main')
    const [activeSubMenu, setActiveSubMenu] = useState('홈')
    const [isFixed, setIsFixed] = useState(false)
    const [showSubMenu, setShowSubMenu] = useState(true)

    const handleMenuClick = menuName => {
        setActiveMenu(menuName)
        if (menuName === 'HowStory') {
            setActiveSubMenu('홈')
            navigate('/Community')
        } else if (menuName === 'HowShop') {
            setActiveSubMenu('홈')
            navigate('/products')
        } else if (menuName === 'Main') {
            setActiveSubMenu('홈')
            navigate('/')
        }
        setShowSubMenu(true) // 서브메뉴 보이도록 설정
    }

    const handleMenuHover = () => {
        setShowSubMenu(true)
    }

    const handleMenuLeave = () => {
        setShowSubMenu(false)
    }

    const handleSubMenuClick = subMenu => {
        setActiveSubMenu(subMenu)
    }

    const menuData = {
        Main: ['홈', '오늘의 스토리', '추천 게시물'],
        HowStory: ['홈', '오늘의 스토리', '추천 게시물'],
        HowShop: ['홈', '특가 상품', '인기 상품'],
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
                    onMouseLeave={handleMenuLeave}
                >
                    <div className={styles.mainNavi}>
                        <div className={styles.menuBox}>
                            <div className={styles.mainLogo}>
                                <a>
                                    <img src={logo} alt="Logo" />
                                </a>
                            </div>
                            <div
                                className={styles.naviMenuList}
                                onMouseEnter={handleMenuHover}
                            >
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
                                <a>
                                    <i className="bx bx-cart"></i>
                                </a>
                            </div>
                            <div className={styles.infoIcon}>
                                <a>
                                    <i className="bx bx-bell"></i>
                                </a>
                            </div>
                            <div className={styles.infoUser}>
                                <a>
                                    <img src="" alt="User" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하위 메뉴 */}
            {showSubMenu && (
                <div className={styles.subMenuWrap}>
                    <div
                        className={`${styles.subMenuCont}  ${
                            isFixed ? styles.fixed : ''
                        }`}
                    >
                        <div className={styles.subMenuBar}>
                            {menuData[activeMenu].map((subMenu, index) => (
                                <div
                                    key={index}
                                    className={`${styles.subMenu} ${
                                        activeSubMenu === subMenu
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() => handleSubMenuClick(subMenu)}
                                >
                                    <a>{subMenu}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
