import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Content.module.css'
import img from '../../../../../../assets/images/cry.jpg'
import img1 from '../../../../../../assets/images/꼬래.png'
import img2 from '../../../../../../assets/images/마이페이지_프로필사진.jpg'
import img3 from '../../../../../../assets/images/kappa.png'
import { Button } from '../../../../../../components/Button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import InfiniteScroll from 'react-infinite-scroll-component'

export const Content = () => {
    const [contentList, setContentList] = useState([]) // 전체 콘텐츠 리스트
    const [hasMore, setHasMore] = useState(true) // 더 불러올 데이터가 있는지 여부
    const [page, setPage] = useState(1) // 현재 페이지
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수

    // 서버에서 받아온 데이터를 처리하는 함수
    const fetchData = async page => {
        if (page > 10) {
            return []
        }

        const data = [
            {
                board_seq: 1,
                nickname: 'Moontari_96',
                member_avatar: img,
                images: [img, img, img],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            {
                board_seq: 2,
                nickname: 'MoonStar⭐',
                member_avatar: img1,
                images: [img1, img1, img1],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            {
                board_seq: 3,
                nickname: 'Moon🌕',
                member_avatar: img2,
                images: [img2, img2, img1],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            {
                board_seq: 4,
                nickname: 'BaekMin🍺',
                member_avatar: img3,
                images: [img3, img2, img1],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
        ]

        return data
    }

    // 첫 번째 데이터 로드 (초기 페이지)
    useEffect(() => {
        const loadInitialData = async () => {
            const initialData = await fetchData(page)
            setContentList(initialData) // 초기 데이터 설정
        }
        loadInitialData()
    }, [])

    // 무한 스크롤로 데이터 추가 로드
    const loadMoreData = async () => {
        const nextPage = page + 1
        const newContent = await fetchData(nextPage)

        // 더 이상 데이터가 없으면 종료
        if (newContent.length === 0) {
            setHasMore(false)
        }

        setContentList(prevList => [...prevList, ...newContent])
        setPage(nextPage) // 페이지 증가
    }

    // 좋아요 및 북마크 상태 업데이트 함수
    const toggleLike = board_seq => {
        setContentList(prevList =>
            prevList.map(item =>
                item.board_seq === board_seq
                    ? {
                          ...item,
                          isLiked: !item.isLiked,
                          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
                      }
                    : item
            )
        )
    }

    const toggleBookmark = board_seq => {
        setContentList(prevList =>
            prevList.map(item =>
                item.board_seq === board_seq
                    ? { ...item, isBookmarked: !item.isBookmarked }
                    : item
            )
        )
    }

    // 상세 페이지로 이동
    const goToDetailPage = board_seq => {
        navigate(`/communities/${board_seq}`)
    }

    // 마이페이지로 이동
    const goToUserPage = nickname => {
        navigate(`/user/${nickname}`) // nickname을 기반으로 마이페이지로 이동
    }

    return (
        <div className={styles.contentWrap}>
            <InfiniteScroll
                dataLength={contentList.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                <div className={styles.contentCont}>
                    {contentList.map(content => (
                        <div
                            key={content.board_seq}
                            className={styles.contentCon}
                            onClick={() => goToDetailPage(content.board_seq)} // 클릭 시 상세 페이지로 이동
                        >
                            <div className={styles.contentTop}>
                                <div className={styles.profile}>
                                    <div className={styles.profileImg}>
                                        <img
                                            src={content.member_avatar}
                                            alt=""
                                        />
                                    </div>
                                    <div className={styles.profileNickname}>
                                        {content.nickname} {/* 닉네임 표시 */}
                                    </div>
                                </div>
                                <div className={styles.followBtn}>
                                    <Button
                                        title="팔로우"
                                        size="s"
                                        onClick={e => {
                                            e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                            goToUserPage(content.nickname) // 마이페이지로 이동
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.mainContent}>
                                <div className={styles.mainContentImg}>
                                    <Swiper
                                        pagination={(true, { clickable: true })}
                                        modules={[Pagination]}
                                        className={styles.swiperBox}
                                    >
                                        {content.images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={image} alt="" />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                <div className={styles.mainContentTxt}>
                                    <div className={styles.btnBox}>
                                        <div className={styles.btnLeft}>
                                            <div
                                                className={styles.likeBtn}
                                                onClick={e => {
                                                    e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                                    toggleLike(
                                                        content.board_seq
                                                    )
                                                }}
                                            >
                                                <i
                                                    className={
                                                        content.isLiked
                                                            ? 'bx bxs-heart'
                                                            : 'bx bx-heart'
                                                    }
                                                ></i>
                                                <span
                                                    className={styles.likeCount}
                                                >
                                                    {content.likes}
                                                </span>
                                            </div>
                                            <div className={styles.comment}>
                                                <i className="bx bx-comment"></i>
                                                <span
                                                    className={
                                                        styles.commentCount
                                                    }
                                                >
                                                    {content.comments}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.btnRight}>
                                            <a
                                                className={styles.bookMark}
                                                onClick={e => {
                                                    e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                                    toggleBookmark(
                                                        content.board_seq
                                                    )
                                                }}
                                            >
                                                <i
                                                    className={
                                                        content.isBookmarked
                                                            ? 'bx bxs-bookmark'
                                                            : 'bx bx-bookmark'
                                                    }
                                                ></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.contentBox}>
                                    {content.hashtags}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    )
}
