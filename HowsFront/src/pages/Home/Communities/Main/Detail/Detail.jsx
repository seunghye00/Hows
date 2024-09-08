import React, { useState } from 'react'
import { ProfileSection } from './ProfileSection/ProfileSection'
import { ImageSwiper } from './ImageSwiper/ImageSwiper'
import { ProductTagSwiper } from './ProductTagSwiper/ProductTagSwiper'
import { Modal } from '../../../../../components/Modal/Modal'
import styles from './Detail.module.css'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'

export const Detail = () => {
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [viewCount, setViewCount] = useState(84543)
    const [bookmarkCount, setBookmarkCount] = useState(1400)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [comments, setComments] = useState([
        {
            id: 1,
            user: 'Moontari_96',
            text: '공무원인 근로자는 법률이 정하는 자에 한하여...',
            likes: 10,
            replies: [],
        },
    ])

    // 좋아요, 북마크 상태 변경
    const toggleLike = () => {
        setIsLiked(!isLiked)
    }

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked)
        setBookmarkCount(isBookmarked ? bookmarkCount - 1 : bookmarkCount + 1)
    }

    // 댓글 추가
    const handleAddComment = e => {
        e.preventDefault()
        const commentText = e.target.comment.value
        setComments([
            ...comments,
            {
                id: comments.length + 1,
                user: 'YourUsername', // 현재 유저 정보
                text: commentText,
                likes: 0,
                replies: [],
            },
        ])
        e.target.comment.value = ''
    }

    return (
        <div className={styles.container}>
            {/* 프로필 섹션 */}
            <ProfileSection />

            {/* 이미지 섹션 */}
            <div className={styles.imageSection}>
                <ImageSwiper />
            </div>

            {/* 상품 태그 섹션 */}
            <div className={styles.productTagSection}>
                <ProductTagSwiper />
            </div>

            {/* 게시글 상단 */}
            <div className={styles.postActions}>
                <div onClick={toggleLike}>
                    <i className={isLiked ? 'bx bxs-heart' : 'bx bx-heart'}></i>{' '}
                    {isLiked ? '좋아요' : '좋아요 취소'}
                </div>
                <div>
                    <i className="bx bx-show"></i> {viewCount}
                </div>
                <div onClick={toggleBookmark}>
                    <i
                        className={
                            isBookmarked ? 'bx bxs-bookmark' : 'bx bx-bookmark'
                        }
                    ></i>{' '}
                    {bookmarkCount}
                </div>
                <div onClick={() => setIsModalOpen(true)}>
                    <i className="bx bx-flag"></i> 신고
                </div>
            </div>

            {/* 게시글 콘텐츠 */}
            <div className={styles.postContent}>
                <p>로렘 입숨은 출판이나 그래픽 디자인 분야에서...</p>
            </div>

            {/* 댓글 작성 영역 */}
            <div className={styles.commentInput}>
                <form onSubmit={handleAddComment}>
                    <textarea
                        name="comment"
                        placeholder="댓글을 입력하세요"
                    ></textarea>
                    <button type="submit">댓글 남기기</button>
                </form>
            </div>

            {/* 댓글 리스트 */}
            <div className={styles.commentsSection}>
                {comments.map(comment => (
                    <div key={comment.id} className={styles.comment}>
                        <p>
                            <strong>{comment.user}</strong>
                        </p>
                        <p>{comment.text}</p>
                        <div className={styles.commentActions}>
                            <span>
                                <i className="bx bxs-like"></i> {comment.likes}
                            </span>
                            <span>
                                <i className="bx bx-message"></i> 답글달기
                            </span>
                            <span>
                                <i className="bx bx-flag"></i> 신고
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 신고 모달 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3>신고 사유를 선택해주세요</h3>
                <ul>
                    <li>
                        <input type="checkbox" /> 도배 및 중복 게시물
                    </li>
                    <li>
                        <input type="checkbox" /> 폭력적인 게시물
                    </li>
                    <li>
                        <input type="checkbox" /> 불쾌한 내용
                    </li>
                </ul>
                <button onClick={() => setIsModalOpen(false)}>신고하기</button>
            </Modal>

            <ScrollTop />
        </div>
    )
}
