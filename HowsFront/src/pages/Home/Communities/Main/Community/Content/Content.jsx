import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Content.module.css'
import axios from 'axios'
import { host } from '../../../../../../config/config'
import { Button } from '../../../../../../components/Button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { useAuthStore } from '../../../../../../store/store'
import 'swiper/css'
import 'swiper/css/pagination'
import InfiniteScroll from 'react-infinite-scroll-component'

export const Content = () => {
    const [contentList, setContentList] = useState([]) // 전체 콘텐츠 리스트
    const [hasMore, setHasMore] = useState(true) // 더 불러올 데이터가 있는지 여부
    const [page, setPage] = useState(1) // 현재 페이지
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const [loaderVisible, setLoaderVisible] = useState(true) // 로딩 상태
    const [endMessageVisible, setEndMessageVisible] = useState(true) // 종료 메시지 상태

    const fetchData = async (page, limit = 20) => {
        console.log(`Fetching data for page: ${page} with limit: ${limit}`)
        try {
            const resp = await axios.get(`${host}/community`, {
                params: { page, limit }, // 페이지와 limit를 서버로 전달
            })
            console.log(resp.data)
            // 페이지에 받아온 데이터의 길이가 limit보다 작다면 더 이상 불러올 데이터가 없음
            if (resp.data.length < limit || resp.data.length === 0) {
                setHasMore(false) // 데이터가 없으면 스크롤 멈춤
                console.log('No more data available, stopping scroll')
            }

            return resp.data
        } catch (error) {
            console.error('Error fetching data:', error)
            return []
        }
    }

    // 첫 번째 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            const initialData = await fetchData(page)
            setContentList(initialData) // 초기 데이터 설정

            if (initialData.length < 20) {
                setHasMore(false) // 처음부터 데이터가 limit보다 적다면 바로 스크롤 중지
                console.log('Initial data less than 20, stopping scroll')
            }
            console.log('Initial load complete, hasMore:', hasMore)
        }
        loadInitialData()
    }, [])

    // 데이터 추가 로드
    const loadMoreData = async () => {
        const nextPage = page + 1
        console.log(
            `Loading more data for page: ${nextPage}, hasMore: ${hasMore}`
        )

        const newContent = await fetchData(nextPage)

        console.log(`Fetched newContent length: ${newContent.length}`)

        // 받아온 데이터가 이미 기존 데이터에 있는지 확인
        const isDuplicate = newContent.every(newItem =>
            contentList.some(
                existingItem => existingItem.BOARD_SEQ === newItem.BOARD_SEQ
            )
        )

        if (isDuplicate || newContent.length === 0) {
            setHasMore(false) // 중복 데이터가 있거나 새로운 데이터가 없으면 스크롤 중지
            console.log(
                'No new unique data or no more data to load, stopping scroll'
            )
            return
        }

        if (newContent.length > 0) {
            console.log(`Adding ${newContent.length} new items`)
            setContentList(prevList => [...prevList, ...newContent])
            setPage(nextPage) // 페이지 증가
        }

        if (newContent.length < 20) {
            setHasMore(false) // 추가로 받아온 데이터가 limit보다 적으면 스크롤 중지
            console.log('Loaded all data, stopping scroll')
        }
        console.log(
            `After loading more, page: ${nextPage}, hasMore: ${hasMore}`
        )
    }
    // 좋아요 상태 업데이트 함수
    const toggleLike = async board_seq => {
        if (!isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            await axios.post(`${host}/community/${board_seq}/like`)
            setContentList(prevList =>
                prevList.map(item =>
                    item.BOARD_SEQ === board_seq
                        ? {
                              ...item,
                              isLiked: !item.isLiked,
                              likes: item.isLiked
                                  ? item.likes - 1
                                  : item.likes + 1,
                          }
                        : item
                )
            )
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    // 북마크 상태 업데이트 함수
    const toggleBookmark = async board_seq => {
        if (!isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            await axios.post(`${host}/community/${board_seq}/bookmark`)
            setContentList(prevList =>
                prevList.map(item =>
                    item.BOARD_SEQ === board_seq
                        ? { ...item, isBookmarked: !item.isBookmarked }
                        : item
                )
            )
        } catch (error) {
            console.error('Error toggling bookmark:', error)
        }
    }

    // 팔로우 상태 업데이트 함수
    const handleFollow = async nickname => {
        if (!isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            await axios.post(`${host}/user/${nickname}/follow`)
            setContentList(prevList =>
                prevList.map(item =>
                    item.NICKNAME === nickname
                        ? { ...item, isFollowing: !item.isFollowing }
                        : item
                )
            )
        } catch (error) {
            console.error('Error following user:', error)
        }
    }

    // 상세 페이지로 이동
    const goToDetailPage = board_seq => {
        navigate(`/communities/${board_seq}`)
    }

    // 마이페이지로 이동
    const goToUserPage = nickname => {
        navigate(`/user/${nickname}`) // nickname을 기반으로 마이페이지로 이동
    }
    // 1초 후 loader 숨기기
    useEffect(() => {
        if (hasMore) {
            setLoaderVisible(true)
            const timer = setTimeout(() => {
                setLoaderVisible(false) // 1초 후 loader 사라짐
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [hasMore])

    // 1초 후 endMessage 숨기기
    useEffect(() => {
        if (!hasMore) {
            setEndMessageVisible(true)
            const timer = setTimeout(() => {
                setEndMessageVisible(false) // 1초 후 endMessage 사라짐
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [hasMore])
    return (
        <div className={styles.contentWrap}>
            <InfiniteScroll
                dataLength={contentList.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={loaderVisible ? <h4>로딩 중입니다.</h4> : null} // 로딩 메시지 1초 후 사라짐
                endMessage={
                    endMessageVisible ? (
                        <h4>더 이상 불러올 데이터가 없습니다.</h4>
                    ) : null
                } // 더 이상 데이터가 없을 때 1초만 표시
            >
                <div className={styles.contentCont}>
                    {contentList.map(content => (
                        <div
                            key={content.BOARD_SEQ}
                            className={styles.contentCon}
                            onClick={() => goToDetailPage(content.BOARD_SEQ)} // 클릭 시 상세 페이지로 이동
                        >
                            <div className={styles.contentTop}>
                                <div
                                    className={styles.profile}
                                    onClick={e => {
                                        e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                        goToUserPage(content.NICKNAME) // 마이페이지로 이동
                                    }}
                                >
                                    <div className={styles.profileImg}>
                                        <img
                                            src={content.MEMBER_AVATAR}
                                            alt=""
                                        />
                                    </div>
                                    <div className={styles.profileNickname}>
                                        {content.NICKNAME} {/* 닉네임 표시 */}
                                    </div>
                                </div>
                                <div className={styles.followBtn}>
                                    <Button
                                        title={
                                            content.isFollowing
                                                ? '팔로잉'
                                                : '팔로우'
                                        }
                                        size="s"
                                        onClick={e => {
                                            e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                            handleFollow(content.NICKNAME) // 팔로우
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
                                                        content.BOARD_SEQ
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
                                                    {content.COMMENTS}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.btnRight}>
                                            <a
                                                className={styles.bookMark}
                                                onClick={e => {
                                                    e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                                    toggleBookmark(
                                                        content.BOARD_SEQ
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
                                    {content.BOARD_CONTENTS}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    )
}
