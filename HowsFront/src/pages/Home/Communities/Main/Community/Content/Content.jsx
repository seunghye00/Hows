import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Content.module.css'
import {
    getCommunityPosts, // 커뮤니티 게시글 목록을 가져오는 함수
    toggleLike, // 좋아요 상태를 변경하는 함수
    toggleBookmark, // 북마크 상태를 변경하는 함수
    toggleFollow, // 팔로우 상태를 변경하는 함수
} from '../../../../../../api/community' // API 호출 함수 불러오기
import { Button } from '../../../../../../components/Button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { useAuthStore } from '../../../../../../store/store' // 인증 상태를 확인하기 위한 store
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

    // 데이터를 가져오는 함수 (페이지네이션 처리)
    const fetchData = async (page, limit = 20) => {
        try {
            const resp = await getCommunityPosts(page, limit) // API 호출 함수 사용
            if (resp.data.length < limit) {
                setHasMore(false) // 받아온 데이터가 limit보다 적으면 스크롤 중지
            }
            return resp.data // 받아온 데이터 반환
        } catch (error) {
            console.error('Error fetching data:', error)
            return [] // 오류 발생 시 빈 배열 반환
        }
    }

    // 첫 번째 데이터 로드 (초기 로드)
    useEffect(() => {
        const loadInitialData = async () => {
            const initialData = await fetchData(page) // 첫 번째 페이지의 데이터를 가져옴
            setContentList(initialData) // 가져온 데이터를 state에 저장

            if (initialData.length < 20) {
                setHasMore(false) // 처음부터 데이터가 limit보다 적으면 스크롤 중지
                console.log('Initial data less than 20, stopping scroll')
            }
            console.log('Initial load complete, hasMore:', hasMore)
        }
        loadInitialData() // 데이터 로딩 실행
    }, [])

    // InfiniteScroll을 통한 추가 데이터 로드
    const loadMoreData = async () => {
        const nextPage = page + 1 // 다음 페이지
        console.log(
            `Loading more data for page: ${nextPage}, hasMore: ${hasMore}`
        )

        const newContent = await fetchData(nextPage) // 새로운 데이터 가져오기
        console.log(`Fetched newContent length: ${newContent.length}`)

        // 받아온 데이터가 기존 데이터에 있는지 확인 (중복 방지)
        const isDuplicate = newContent.every(newItem =>
            contentList.some(
                existingItem => existingItem.BOARD_SEQ === newItem.BOARD_SEQ
            )
        )

        // 중복 데이터가 있거나 새로운 데이터가 없으면 스크롤 중지
        if (isDuplicate || newContent.length === 0) {
            setHasMore(false)
            console.log(
                'No new unique data or no more data to load, stopping scroll'
            )
            return
        }

        // 새로운 데이터를 기존 데이터와 합침
        if (newContent.length > 0) {
            console.log(`Adding ${newContent.length} new items`)
            setContentList(prevList => [...prevList, ...newContent])
            setPage(nextPage) // 페이지 증가
        }

        // 추가로 받아온 데이터가 limit보다 적으면 스크롤 중지
        if (newContent.length < 20) {
            setHasMore(false)
            console.log('Loaded all data, stopping scroll')
        }
        console.log(
            `After loading more, page: ${nextPage}, hasMore: ${hasMore}`
        )
    }

    // 좋아요 상태 업데이트 함수
    const handleToggleLike = async board_seq => {
        if (!isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            await toggleLike(board_seq) // 좋아요 상태 변경 API 호출
            // 좋아요 상태를 업데이트 (토글 방식)
            setContentList(prevList =>
                prevList.map(item =>
                    item.BOARD_SEQ === board_seq
                        ? {
                              ...item,
                              isLiked: !item.isLiked, // 토글
                              likes: item.isLiked
                                  ? item.likes - 1
                                  : item.likes + 1, // 좋아요 수 갱신
                          }
                        : item
                )
            )
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    // 북마크 상태 업데이트 함수
    const handleToggleBookmark = async board_seq => {
        if (!isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            await toggleBookmark(board_seq) // 북마크 상태 변경 API 호출
            // 북마크 상태를 업데이트 (토글 방식)
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
            await toggleFollow(nickname) // 팔로우 상태 변경 API 호출
            // 팔로우 상태를 업데이트 (토글 방식)
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

    // 상세 페이지로 이동 함수
    const goToDetailPage = board_seq => {
        navigate(`/communities/${board_seq}`) // 게시글의 상세 페이지로 이동
    }

    // 마이페이지로 이동 함수
    const goToUserPage = nickname => {
        navigate(`/user/${nickname}`) // 사용자의 마이페이지로 이동
    }

    // 로딩 메시지 숨기기 (1초 후)
    useEffect(() => {
        if (hasMore) {
            setLoaderVisible(true)
            const timer = setTimeout(() => {
                setLoaderVisible(false)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [hasMore])

    // 종료 메시지 숨기기 (1초 후)
    useEffect(() => {
        if (!hasMore) {
            setEndMessageVisible(true)
            const timer = setTimeout(() => {
                setEndMessageVisible(false)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [hasMore])

    return (
        <div className={styles.contentWrap}>
            <InfiniteScroll
                dataLength={contentList.length} // 현재까지 불러온 데이터 수
                next={loadMoreData} // 더 많은 데이터를 불러오는 함수
                hasMore={hasMore} // 더 불러올 데이터가 있는지 여부
                loader={loaderVisible ? <h4>로딩 중입니다.</h4> : null} // 로딩 메시지 1초 후 사라짐
                endMessage={
                    endMessageVisible ? (
                        <h4>더 이상 불러올 데이터가 없습니다.</h4>
                    ) : null
                } // 데이터가 없을 때 표시할 메시지
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
                                        e.stopPropagation() // 클릭 시 상세 페이지로 이동하지 않도록 중단
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
                                            e.stopPropagation() // 클릭 시 상세 페이지로 이동하지 않도록 중단
                                            handleFollow(content.NICKNAME) // 팔로우/언팔로우 처리
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.mainContent}>
                                <div className={styles.mainContentImg}>
                                    <Swiper
                                        pagination={{ clickable: true }}
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
                                                    e.stopPropagation() // 클릭 시 상세 페이지로 이동하지 않도록 중단
                                                    handleToggleLike(
                                                        content.BOARD_SEQ
                                                    ) // 좋아요 토글 처리
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
                                                    e.stopPropagation() // 클릭 시 상세 페이지로 이동하지 않도록 중단
                                                    handleToggleBookmark(
                                                        content.BOARD_SEQ
                                                    ) // 북마크 토글 처리
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
