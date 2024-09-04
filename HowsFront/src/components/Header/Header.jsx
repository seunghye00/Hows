import React, { useState } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo_how.png'

export const Header = () => {
    // 메인 네비게이션과 서브메뉴의 활성화 상태를 관리
    const [activeMenu, setActiveMenu] = useState('Main') // 메인 네비게이션
    const [activeSubMenu, setActiveSubMenu] = useState('홈') // 서브메뉴

    // 메뉴 클릭 시 활성화된 메뉴와 페이지 유형을 변경
    const handleMenuClick = menuName => {
        setActiveMenu(menuName)
        // 'HowStory'와 'HowShop'을 클릭하면 서브메뉴를 해당 페이지 첫 번째 메뉴로 초기화
        if (menuName === 'HowStory') {
            setActiveSubMenu('홈')
        } else if (menuName === 'HowShop') {
            setActiveSubMenu('홈')
        } else if (menuName === 'Main') {
            setActiveSubMenu('홈')
        }
    }

    // 서브메뉴 클릭 시 활성화된 서브메뉴만 변경
    const handleSubMenuClick = subMenu => {
        setActiveSubMenu(subMenu)
    }

    // 하위 메뉴 데이터 정의
    const menuData = {
        Main: ['홈', '오늘의 스토리', '추천 게시물'],
        HowStory: ['홈', '오늘의 스토리', '추천 게시물'],
        HowShop: ['홈', '특가 상품', '인기 상품'],
    }

    return (
        <div className="header">
            {/* 상단 네비게이션 */}
            <div className={styles.headerWrap}>
                <div className={styles.headerCont}>
                    <div className={styles.mainNavi}>
                        <div className={styles.menuBox}>
                            <div className={styles.mainLogo}>
                                <a>
                                    <img src={logo} alt="Logo" />
                                </a>
                            </div>
                            <div className={styles.naviMenuList}>
                                {/* 메인 메뉴 */}
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
                            {/* 네비게이션 아이콘 */}
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
            <div className={styles.subMenuWrap}>
                <div className={styles.subMenuCont}>
                    <div className={`${styles.subMenuBar}`}>
                        {/* 현재 활성화된 메뉴에 따른 하위 메뉴 렌더링 */}
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
        </div>
    )
}
