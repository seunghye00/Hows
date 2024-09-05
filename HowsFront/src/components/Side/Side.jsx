import React, { useState } from 'react'
import styles from './Side.module.css'
import logo from '../../assets/images/logo_how.png'
import { useNavigate } from 'react-router-dom' // useNavigate 임포트

export const Side = () => {
    const navigate = useNavigate() // useNavigate 사용

    // 각 3뎁스 메뉴의 열림/닫힘 상태를 관리
    const [openMenus, setOpenMenus] = useState({})

    // 토글 버튼을 클릭하면 해당 메뉴의 열림/닫힘 상태를 변경
    const handleToggle = index => {
        setOpenMenus(prevState => ({
            ...prevState,
            [index]: !prevState[index], // 클릭된 메뉴만 토글
        }))
    }

    // 메뉴 데이터 배열로 정의 (메뉴 이름, 아이콘과 서브 메뉴)
    const menuData = [
        {
            title: '메인 페이지',
            subMenu: [
                { title: '배너 관리', path: '/' }, // path 추가
            ],
        },
        {
            title: '회원 관리',
            subMenu: [
                {
                    title: '등급 관리',
                    icon: 'bx bx-group', // 아이콘 추가
                    subMenu: [
                        { title: '등급 목록', path: '/' },
                        { title: '등급 추가', path: '/' },
                    ],
                },
                {
                    title: '블랙리스트 관리',
                    icon: 'bx bx-block', // 아이콘 추가
                    subMenu: [{ title: '블랙리스트 조회', path: '/' }],
                },
            ],
        },
        {
            title: '게시판 관리',
            subMenu: [
                {
                    title: '게시글 관리',
                    icon: 'bx bx-file', // 아이콘 추가
                    subMenu: [
                        { title: '게시글 목록', path: '/' },
                        { title: '게시글 작성', path: '/' },
                    ],
                },
                {
                    title: '댓글 관리',
                    icon: 'bx bx-message-rounded-dots', // 아이콘 추가
                    subMenu: [
                        { title: '댓글 목록', path: '/' },
                        { title: '댓글 작성', path: '/' },
                    ],
                },
                {
                    title: '공지사항 관리',
                    icon: 'bx bx-error-circle', // 아이콘 추가
                    subMenu: [
                        { title: '공지사항 목록', path: '/' },
                        { title: '공지사항 작성', path: '/' },
                    ],
                },
                {
                    title: 'FAQ 관리',
                    icon: 'bx bx-help-circle', // 아이콘 추가
                    subMenu: [
                        { title: 'FAQ 목록', path: '/' },
                        { title: 'FAQ 작성', path: '/' },
                    ],
                },
            ],
        },
        {
            title: '상품 관리',
            subMenu: [
                {
                    title: '목록 관리',
                    icon: 'bx bx-list-ul', // 아이콘 추가
                    path: '/', // 경로 추가
                },
                {
                    title: '주문 관리',
                    icon: 'bx bx-cart', // 아이콘 추가
                    path: '/', // 경로 추가
                },
                {
                    title: '배송 관리',
                    icon: 'bx bxs-truck', // 아이콘 추가
                    path: '/', // 경로 추가
                },
                {
                    title: '반품 관리',
                    icon: 'bx bx-undo', // 아이콘 추가
                    subMenu: [
                        { title: '반품 목록 조회', path: '/' },
                        { title: '반품 처리', path: '/' },
                    ],
                },
            ],
        },
    ]

    return (
        <div className="side">
            <div className={styles.sideWrap}>
                {/* 로고 부분 */}
                <div className={styles.logoBox}>
                    <img src={logo} alt="Logo" />
                    <p className={styles.logotit}>How's</p>
                </div>

                {/* 관리 리스트 */}
                <div className={styles.adminListCont}>
                    {menuData.map((menu, menuIndex) => (
                        <div key={menuIndex} className={styles.adminList}>
                            <ul>
                                <li className={styles.listTit}>
                                    {/* 메인 메뉴 타이틀 */}
                                    {menu.title}

                                    {/* 2뎁스 메뉴 */}
                                    <ul className={styles.listFlDept}>
                                        {menu.subMenu.map(
                                            (subMenu, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className={styles.listFl}
                                                    onClick={() =>
                                                        // 3뎁스 메뉴가 없을 때 경로로 바로 이동
                                                        typeof subMenu ===
                                                        'string'
                                                            ? null
                                                            : subMenu.subMenu
                                                            ? handleToggle(
                                                                  `${menuIndex}-${subIndex}`
                                                              )
                                                            : navigate(
                                                                  subMenu.path
                                                              )
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.listFlBox
                                                        }
                                                    >
                                                        {/* 아이콘이 있을 때만 아이콘을 렌더링 */}
                                                        {typeof subMenu !==
                                                            'string' &&
                                                            subMenu.icon && (
                                                                <span
                                                                    className={
                                                                        subMenu.icon
                                                                    }
                                                                ></span>
                                                            )}{' '}
                                                        {/* 아이콘 공간 */}
                                                        {typeof subMenu ===
                                                        'string'
                                                            ? subMenu
                                                            : subMenu.title}
                                                        {/* 3뎁스가 있을 때만 토글 버튼 추가 */}
                                                        {typeof subMenu !==
                                                            'string' &&
                                                            subMenu.subMenu && (
                                                                <span
                                                                    className={
                                                                        styles.toggleBtn
                                                                    }
                                                                >
                                                                    {openMenus[
                                                                        `${menuIndex}-${subIndex}`
                                                                    ] ? (
                                                                        <i className="bx bxs-chevron-up"></i>
                                                                    ) : (
                                                                        <i className="bx bxs-chevron-down"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                    </div>

                                                    {/* 3뎁스 메뉴가 있을 경우에만 표시 */}
                                                    {typeof subMenu !==
                                                        'string' &&
                                                        subMenu.subMenu &&
                                                        openMenus[
                                                            `${menuIndex}-${subIndex}`
                                                        ] && (
                                                            <ul
                                                                className={
                                                                    styles.listSecDept
                                                                }
                                                            >
                                                                {subMenu.subMenu.map(
                                                                    (
                                                                        thirdMenu,
                                                                        thirdIndex
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                thirdIndex
                                                                            }
                                                                            className={
                                                                                styles.listSec
                                                                            }
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    thirdMenu.path
                                                                                )
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.iconPlaceholder
                                                                                }
                                                                            ></span>
                                                                            {/* 아이콘 공간 */}
                                                                            {
                                                                                thirdMenu.title
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
