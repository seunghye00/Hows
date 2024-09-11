import styles from './Detail.module.css'
import React, { useState, useEffect } from 'react'
import { ProfileSection } from './ProfileSection/ProfileSection'
import { ImageSwiper } from './ImageSwiper/ImageSwiper'
import { ProductTagSwiper } from './ProductTagSwiper/ProductTagSwiper'
import { Button } from '../../../../../components/Button/Button'
import { Modal } from '../../../../../components/Modal/Modal'
import Swal from 'sweetalert2'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { PiSiren } from 'react-icons/pi'
import axios from 'axios'
import { useParams } from 'react-router-dom' // for accessing the board_seq from URL
import img from './../../../../../assets/images/cry.jpg'
import img1 from './../../../../../assets/images/마이페이지_프로필사진.jpg'
import { host } from '../../../../../config/config'
import {
    getPostData,
    getImageData,
    getTagData,
} from '../../../../../api/community' // API 함수 불러오기

export const Detail = () => {
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
                // API 요청 함수 호출
                const postData = await getPostData(board_seq)
                setPostData(postData.data)

                const images = await getImageData(board_seq)
                setImagesData(images.data.images)

                const tags = await getTagData(board_seq)
                setTagsData(tags.data.tags)

                console.log('게시글 데이터:', postData.data)
                console.log('이미지 데이터:', images.data.images)
                console.log('태그 데이터:', tags.data.tags)
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error)
            }
        }

        fetchData() // 함수 실행
    }, [board_seq])

    // 좋아요, 북마크 상태 변경
    const toggleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    }

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked)
        setBookmarkCount(isBookmarked ? bookmarkCount - 1 : bookmarkCount + 1)
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
                    {/* 상품 태그 섹션 */}
                    <div className={styles.productTagSection}>
                        <ProductTagSwiper tags={postData} />
                    </div>
                    {/* 게시글 상단 */}
                    <div className={styles.postActions}>
                        <div className={styles.likesViewBook}>
                            <div onClick={toggleLike}>
                                <i
                                    className={
                                        isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                    }
                                ></i>
                                {postData.LIKE_COUNT}
                            </div>
                            <div onClick={toggleBookmark}>
                                <i
                                    className={
                                        isBookmarked
                                            ? 'bx bxs-bookmark'
                                            : 'bx bx-bookmark'
                                    }
                                ></i>
                                {postData.BOOKMARK_COUNT}
                            </div>
                            <div>
                                <i className="bx bx-show"></i>{' '}
                                {postData.VIEW_COUNT}
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
