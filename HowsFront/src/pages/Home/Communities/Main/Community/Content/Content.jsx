import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Content.module.css'
import axios from 'axios'
import {
    getCommunityPosts,
    toggleLike,
    toggleBookmark,
} from '../../../../../../api/community' // API 호출 함수 불러오기
import { host } from '../../../../../../config/config'
import { Button } from '../../../../../../components/Button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { useAuthStore } from '../../../../../../store/store'
import 'swiper/css'
import 'swiper/css/pagination'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toggleFollow, userInfo } from '../../../../../../api/member'

export const Content = () => {
    const [contentList, setContentList] = useState([]) // 전체 콘텐츠 리스트
    const [hasMore, setHasMore] = useState(true) // 더 불러올 데이터가 있는지 여부
    const [page, setPage] = useState(1) // 현재 페이지
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const [loaderVisible, setLoaderVisible] = useState(true) // 로딩 상태
    const [endMessageVisible, setEndMessageVisible] = useState(true) // 종료 메시지 상태
    const [memberSeq, setMemberSeq] = useState(null) // 로그인한 사용자의 member_seq 저장
    const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기

    // 로그인한 사용자의 member_seq 가져오기
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await userInfo(member_id) // API 호출
                setMemberSeq(response.data.member_seq) // 멤버 데이터 상태에 저장
            } catch (error) {
                console.error('멤버 정보를 가져오는 중 오류 발생:', error)
            }
        }
        fetchMemberInfo()
    }, [member_id])

    const fetchData = async (page, limit = 20) => {
        try {
            const data = await getCommunityPosts(page, limit)

            // 데이터가 undefined인 경우 빈 배열로 처리
            if (!data || data.length === 0) {
                console.log('데이터가 없습니다.')
                setHasMore(false)
                return []
            }

            if (data.length < limit) {
                setHasMore(false)
            }
            return data
        } catch (error) {
            console.error('데이터 가져오는 중 오류 발생:', error)
            return []
        }
    }

    // 첫 번째 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            const initialData = await fetchData(page)
            setContentList(
                initialData.map(content => ({
                    ...content,
                    isLiked: content.isLiked, // 서버에서 받은 값으로 초기화
                    isBookmarked: content.isBookmarked, // 서버에서 받은 값으로 초기화
                    isFollowing: content.isFollowing, // 서버에서 받은 팔로우 상태
                }))
            ) // 초기 데이터 설정

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
    const toggleLikeHandler = async board_seq => {
        const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
        if (!member_id || !isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            const response = await toggleLike(board_seq, member_id)
            const { isLiked, like_count } = response.data

            setContentList(prevList =>
                prevList.map(item =>
                    item.BOARD_SEQ === board_seq
                        ? { ...item, isLiked, LIKE_COUNT: like_count }
                        : item
                )
            )
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    // 북마크 상태 업데이트 함수
    const toggleBookmarkHandler = async board_seq => {
        const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
        if (!member_id || !isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            const response = await toggleBookmark(board_seq, member_id)
            const { isBookmarked, bookmark_count } = response.data

            setContentList(prevList =>
                prevList.map(item =>
                    item.BOARD_SEQ === board_seq
                        ? {
                              ...item,
                              isBookmarked,
                              BOOKMARK_COUNT: bookmark_count,
                          }
                        : item
                )
            )
        } catch (error) {
            console.error('북마크 처리 중 오류 발생:', error)
        }
    }

    // 팔로우 상태 업데이트 함수
    const handleFollow = async targetMemberSeq => {
        if (!isAuth || !memberSeq) {
            navigate('/signIn')
            return
        }
        try {
            const response = await toggleFollow({
                from_member_seq: memberSeq, // 로그인한 사용자의 member_seq
                to_member_seq: targetMemberSeq, // 팔로우할 대상의 member_seq
                checkStatus: false, // 팔로우 상태 변경
            })

            // 팔로우 상태 업데이트
            setContentList(prevList =>
                prevList.map(item =>
                    item.MEMBER_SEQ === targetMemberSeq
                        ? { ...item, isFollowing: response.data.isFollowing }
                        : item
                )
            )
        } catch (error) {
            console.error('팔로우 처리 중 오류 발생:', error)
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
                                        isChecked={
                                            content.isFollowing ? 'Y' : 'N'
                                        }
                                        onClick={e => {
                                            e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                            handleFollow(content.MEMBER_SEQ) // 팔로우할 대상의 MEMBER_SEQ를 전달
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
                                        <div
                                            className={styles.btnLeft}
                                            onClick={e => {
                                                e.stopPropagation() // 클릭 시 상세 페이지로 가지 않도록 중단
                                                toggleLike(content.BOARD_SEQ) // BOARD_SEQ를 전달
                                            }}
                                        >
                                            <div
                                                className={styles.likeBtn}
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    toggleLikeHandler(
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
                                                    {content.LIKE_COUNT}
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
                                                    e.stopPropagation()
                                                    toggleBookmarkHandler(
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
