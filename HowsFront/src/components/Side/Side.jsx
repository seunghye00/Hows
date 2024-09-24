import React, { useState, useEffect } from 'react'
import styles from './Side.module.css'
import logo from '../../assets/images/logo_how.png'
import { useNavigate, Link } from 'react-router-dom' // useNavigate 임포트
import { Button } from '../Button/Button'
import { SwalComp } from '../../commons/commons'
import { useAuthStore } from '../../store/store'

export const Side = () => {
    const navigate = useNavigate() // useNavigate 사용

    // 각 3뎁스 메뉴의 열림/닫힘 상태를 관리
    const [openMenus, setOpenMenus] = useState({})
    const { logout, setIsAuth, isAuth } = useAuthStore()

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
                {
                    title: '배너 관리',
                    icon: 'bx bx-image',
                    path: '/admin/banner',
                }, // path 추가
            ],
        },
        {
            title: '회원 관리',
            subMenu: [
                {
                    title: '회원 관리',
                    icon: 'bx bx-group', // 아이콘 추가
                    subMenu: [
                        { title: '회원 목록', path: '/admin/member' },
                        { title: '블랙리스트 목록', path: '/admin/blacklist' },
                    ],
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
                        { title: '신고 게시물 목록', path: '/admin/community' },
                    ],
                },
                {
                    title: '댓글 관리',
                    icon: 'bx bx-message-rounded-dots', // 아이콘 추가
                    subMenu: [
                        { title: '신고 댓글 목록', path: '/admin/comment' },
                        { title: '신고 대댓글 목록', path: '/admin/reply' },
                    ],
                },
                {
                    title: '리뷰 관리',
                    icon: 'bx bx-comment-edit', // 아이콘 추가
                    subMenu: [
                        { title: '신고 리뷰 목록', path: '/admin/review' },
                    ],
                },
                {
                    title: '공지사항 관리',
                    icon: 'bx bx-error-circle', // 아이콘 추가
                    subMenu: [
                        { title: '공지사항 목록', path: 'notice' },
                        { title: '이벤트 목록', path: '/admin/notice/event' },
                        { title: 'FAQ 목록', path: '/admin/notice/faq' },
                    ],
                },
            ],
        },
        {
            title: '상품 관리',
            subMenu: [
                {
                    title: '상품 목록',
                    icon: 'bx bx-list-ul', // 아이콘 추가
                    path: '/admin/product/list',
                },
                {
                    title: '주문 관리',
                    icon: 'bx bx-cart', // 아이콘 추가
                    path: '/admin/product/order', // 경로 추가
                },
                {
                    title: '배송 관리',
                    icon: 'bx bxs-truck', // 아이콘 추가
                    path: '/admin/product/delivery', // 경로 추가
                },
                {
                    title: '반품 관리',
                    icon: 'bx bx-undo', // 아이콘 추가
                    path: '/admin/product/return', // 경로 추가
                },
            ],
        },
    ]

    const handleLogout = () => {
        SwalComp({
            type: 'question',
            text: '정말 로그아웃을 하시겠습니까?',
        }).then(result => {
            if (result.isConfirmed) {
                // 로그아웃 처리
                logout()
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('member_id')
                sessionStorage.removeItem('member_avatar')
                sessionStorage.removeItem('nickname')
                // 인증 상태를 false로 설정
                setIsAuth(false)
            }
        })
    }

    // 로그아웃 후 인증 상태가 변경되면 사용자 페이지로 리다이렉트
    useEffect(() => {
        if (!isAuth) {
            navigate('/signIn')
        }
    }, [isAuth, navigate])

    return (
        <div className="side">
            <div className={styles.sideWrap}>
                {/* 로고 부분 */}
                <Link to="/admin/home">
                    <div className={styles.logoBox}>
                        <img src={logo} alt="Logo" />
                        <p className={styles.logotit}>How's</p>
                    </div>
                </Link>

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
                                                        subMenu.subMenu ? (
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
                                                        ) : (
                                                            <span
                                                                className={
                                                                    styles.noToggle
                                                                }
                                                            />
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
                    <div className={styles.btn}>
                        <Button
                            title="로그아웃"
                            size={'s'}
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
