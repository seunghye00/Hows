import React, { useState, useEffect } from 'react'
import styles from './Content.module.css'
import img from '../../../../../assets/images/cry.jpg'
import img1 from '../../../../../assets/images/꼬래.png'
import img2 from '../../../../../assets/images/마이페이지_프로필사진.jpg'
import img3 from '../../../../../assets/images/kappa.png'
import { Button } from '../../../../../components/Button/Button'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import InfiniteScroll from 'react-infinite-scroll-component'

// 데이터를 4개씩 묶는 함수
const chunkArray = (array, size) => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

export const Content = () => {
    const [contentList, setContentList] = useState([]) // 전체 콘텐츠 리스트
    const [hasMore, setHasMore] = useState(true) // 더 불러올 데이터가 있는지 여부
    const [page, setPage] = useState(1) // 현재 페이지

    // 서버에서 받아온 데이터를 4개씩 묶어서 처리하는 함수
    const fetchData = async page => {
        if (page > 10) {
            // 페이지가 5 이상일 경우 더 이상 데이터를 불러오지 않음
            return []
        }

        const data = [
            {
                id: page * 1,
                user: 'Moontari_96',
                profileImg: img,
                images: [img, img, img],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            {
                id: page * 1,
                user: 'MoonStar⭐',
                profileImg: img1,
                images: [img1, img1, img1],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            {
                id: page * 1,
                user: 'Moon🌕',
                profileImg: img2,
                images: [img2, img2, img1],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            {
                id: page * 1,
                user: 'BaekMin🍺',
                profileImg: img3,
                images: [img3, img2, img1],
                likes: 185 + page,
                comments: 12 + page,
                hashtags: "#가구는역시 #How's #내돈내산 #셀프인테리어 #1인가구",
                isLiked: false,
                isBookmarked: false,
            },
            // 더 많은 데이터 추가 가능
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

        // 4개씩 나누어서 렌더링할 데이터 설정
        setContentList(prevList => [...prevList, ...newContent])
        setPage(nextPage) // 페이지 증가
    }

    // 좋아요 및 북마크 상태 업데이트 함수
    const toggleLike = id => {
        setContentList(prevList =>
            prevList.map(item =>
                item.id === id
                    ? {
                          ...item,
                          isLiked: !item.isLiked,
                          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
                      }
                    : item
            )
        )
    }

    const toggleBookmark = id => {
        setContentList(prevList =>
            prevList.map(item =>
                item.id === id
                    ? { ...item, isBookmarked: !item.isBookmarked }
                    : item
            )
        )
    }

    // 데이터를 4개씩 묶음
    const chunkedContentList = chunkArray(contentList, 4)

    return (
        <div className={styles.contentWrap}>
            <InfiniteScroll
                dataLength={contentList.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                {chunkedContentList.map((chunk, chunkIndex) => (
                    <div key={chunkIndex} className={styles.contentCont}>
                        {chunk.map(content => (
                            <div key={content.id} className={styles.contentCon}>
                                <div className={styles.contentTop}>
                                    <div className={styles.profile}>
                                        <div className={styles.profileImg}>
                                            <img
                                                src={content.profileImg}
                                                alt=""
                                            />
                                        </div>
                                        <div className={styles.profileNickname}>
                                            {content.user}
                                        </div>
                                    </div>
                                    <div className={styles.followBtn}>
                                        <Button title="팔로우" size="s" />
                                    </div>
                                </div>

                                <div className={styles.mainContent}>
                                    <div className={styles.mainContentImg}>
                                        <Swiper
                                            pagination={
                                                (true, { clickable: true })
                                            }
                                            modules={[Pagination]}
                                            className={styles.swiperBox}
                                        >
                                            {content.images.map(
                                                (image, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img
                                                            src={image}
                                                            alt=""
                                                        />
                                                    </SwiperSlide>
                                                )
                                            )}
                                        </Swiper>
                                    </div>

                                    <div className={styles.mainContentTxt}>
                                        <div className={styles.btnBox}>
                                            <div className={styles.btnLeft}>
                                                <div
                                                    className={styles.likeBtn}
                                                    onClick={() =>
                                                        toggleLike(content.id)
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            content.isLiked
                                                                ? 'bx bxs-heart'
                                                                : 'bx bx-heart'
                                                        }
                                                    ></i>
                                                    <span
                                                        className={
                                                            styles.likeCount
                                                        }
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
                                                    onClick={() =>
                                                        toggleBookmark(
                                                            content.id
                                                        )
                                                    }
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
                ))}
            </InfiniteScroll>
            <ScrollTop />
        </div>
    )
}
