import styles from './Detail.module.css'
import React, { useState, useEffect } from 'react'
import { ProfileSection } from './ProfileSection/ProfileSection'
import { ImageSwiper } from './ImageSwiper/ImageSwiper'
import { Button } from '../../../../../components/Button/Button'
import { Modal } from '../../../../../components/Modal/Modal'
import Swal from 'sweetalert2'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { PiSiren } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom' // for accessing the board_seq from URL
import img from './../../../../../assets/images/cry.jpg'
import {
    getPostData,
    getImageData,
    getTagData,
    toggleLike,
    toggleBookmark,
    viewCounting,
} from '../../../../../api/community' // API 함수 불러오기
import { useAuthStore } from '../../../../../store/store'

export const Detail = () => {
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const { board_seq } = useParams() // get board_seq from the route params
    const [postData, setPostData] = useState(null) // State to store post data
    const [imagesData, setImagesData] = useState(null) // State to store images
    const [tagsData, setTagsData] = useState(null) // State to store tags
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [viewCount, setViewCount] = useState(0)
    const [bookmarkCount, setBookmarkCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 게시글 정보 및 이미지, 태그 정보 받아오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 세션에서 member_id 가져오기 (비회원일 경우 null로 처리)
                const member_id = sessionStorage.getItem('member_id') || null

                // 조회수 증가 후 최신 조회수 반영
                const updatedViewCount = await viewCounting(board_seq)
                setViewCount(updatedViewCount) // 최신 조회수를 상태로 업데이트

                // 게시글 데이터 가져오기
                const postData = await getPostData(board_seq, member_id)
                setPostData(postData.data)

                // 이미지 데이터 가져오기
                const images = await getImageData(board_seq)
                setImagesData(images.data.images)

                // 태그 데이터 가져오기
                const tags = await getTagData(board_seq)
                setTagsData(tags.data.tags)

                // 좋아요, 북마크 상태 업데이트 (서버에서 받아온 데이터 사용)
                setIsLiked(postData.data.isLiked) // 서버에서 받아온 좋아요 상태
                setIsBookmarked(postData.data.isBookmarked) // 서버에서 받아온 북마크 상태
                setLikeCount(postData.data.LIKE_COUNT)
                setBookmarkCount(postData.data.BOOKMARK_COUNT)
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error)
            }
        }

        fetchData() // 함수 실행
    }, [board_seq])

    // 좋아요, 북마크 상태 변경
    const toggleLikeHandler = async () => {
        const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
        if (!member_id || !isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            const response = await toggleLike(board_seq, member_id)

            // 서버에서 반환된 최신 좋아요 상태를 반영
            const { isLiked, like_count } = response.data
            setIsLiked(isLiked) // 서버가 반환한 좋아요 상태로 설정 (추가되면 true, 취소되면 false)
            setLikeCount(like_count) // 서버에서 최신 like_count 반환
            console.log(isLiked + ' 좋아요 현재 값 확인') // 확인용 로그
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    const toggleBookmarkHandler = async () => {
        const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
        if (!member_id || !isAuth) {
            navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
            return
        }
        try {
            const response = await toggleBookmark(board_seq, member_id)

            // 서버에서 반환된 최신 북마크 상태를 반영
            const { isBookmarked, bookmark_count } = response.data
            setIsBookmarked(isBookmarked) // 서버가 반환한 북마크 상태로 설정
            setBookmarkCount(bookmark_count) // 서버에서 최신 bookmark_count 반환
        } catch (error) {
            console.error('북마크 처리 중 오류 발생:', error)
        }
    }

    // 링크 복사 기능
    const copyLinkToClipboard = () => {
        const dummyLink = window.location.href // 현재 URL
        navigator.clipboard.writeText(dummyLink).then(() => {
            Swal.fire({
                icon: 'success',
                title: '링크가 복사되었습니다!',
                text: '원하는 곳에 붙여넣기하세요.',
                showConfirmButton: false,
                timer: 1500,
            })
        })
    }

    return (
        <div className={styles.container}>
            {/* postData가 null이 아닐 때만 렌더링 */}
            {postData && (
                <>
                    {/* 프로필 섹션 */}
                    <ProfileSection profileData={postData} />
                    {/* 이미지 섹션 */}
                    <div className={styles.imageSection}>
                        <ImageSwiper images={imagesData} tags={tagsData} />
                    </div>

                    {/* 게시글 상단 */}
                    <div className={styles.postActions}>
                        <div className={styles.likesViewBook}>
                            <div onClick={toggleLikeHandler}>
                                <i
                                    className={
                                        isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                    }
                                ></i>
                                {likeCount} {/* 상태로 관리되는 likeCount */}
                            </div>
                            <div onClick={toggleBookmarkHandler}>
                                <i
                                    className={
                                        isBookmarked
                                            ? 'bx bxs-bookmark'
                                            : 'bx bx-bookmark'
                                    }
                                ></i>
                                {bookmarkCount}
                                {/* 상태로 관리되는 bookmarkCount */}
                            </div>
                            <div>
                                <i className="bx bx-show"></i>
                                {viewCount}
                                {/* 상태로 관리되는 viewCount */}
                            </div>
                        </div>
                        <div className={styles.subMitLink}>
                            <div
                                className={styles.Link}
                                onClick={copyLinkToClipboard}
                            >
                                <i className="bx bx-link"></i>
                            </div>
                            <div onClick={() => setIsModalOpen(true)}>
                                <PiSiren />
                                신고하기
                            </div>
                        </div>
                    </div>

                    {/* 게시글 콘텐츠 */}
                    <div className={styles.mainContent}>
                        <p>{postData.BOARD_CONTENTS}</p>
                    </div>
                </>
            )}

            {/* 댓글 작성 영역 */}
            <div className={styles.commentInput}>
                <div className={styles.writerProfile}>
                    <img src={img} alt="" />
                </div>
                <input
                    placeholder="댓글을 입력하세요"
                    type="text"
                    name="comment_contents"
                    className={styles.replyArea}
                ></input>
            </div>

            {/* 신고 모달 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.reportModal}>
                    <h3>신고 사유를 선택해주세요</h3>
                    <ul className={styles.reportlist}>
                        <li>
                            <label>
                                <input type="checkbox" /> 도배 및 중복 게시물
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" /> 폭력적인 게시물
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" /> 불쾌한 내용
                            </label>
                        </li>
                    </ul>
                    <Button
                        size="w"
                        title="신고하기"
                        onClick={() => setIsModalOpen(false)}
                    />
                </div>
            </Modal>
            <ScrollTop />
        </div>
    )
}
