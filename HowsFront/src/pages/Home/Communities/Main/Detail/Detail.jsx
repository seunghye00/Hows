import styles from './Detail.module.css'
import React, { useState } from 'react'
import { ProfileSection } from './ProfileSection/ProfileSection'
import { ImageSwiper } from './ImageSwiper/ImageSwiper'
import { ProductTagSwiper } from './ProductTagSwiper/ProductTagSwiper'
import { Button } from '../../../../../components/Button/Button'
import { Modal } from '../../../../../components/Modal/Modal'
import Swal from 'sweetalert2'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { PiSiren } from 'react-icons/pi'
import img from './../../../../../assets/images/cry.jpg'
import img1 from './../../../../../assets/images/마이페이지_프로필사진.jpg'

export const Detail = () => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(1)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [viewCount, setViewCount] = useState(84543)
    const [bookmarkCount, setBookmarkCount] = useState(1400)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [comments, setComments] = useState([
        {
            comment_seq: 1,
            member_avatar: img1,
            nickname: 'Moontari_96',
            text: '공무원인 근로자는 법률이 정하는 자에 한하여...',
            likes: 10,
            replies: [],
        },
    ])

    // 좋아요, 북마크 상태 변경
    const toggleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
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

    // 링크 복사 기능 구현
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
                <div className={styles.likesViewBook}>
                    <div onClick={toggleLike}>
                        <i
                            className={isLiked ? 'bx bxs-heart' : 'bx bx-heart'}
                        ></i>
                        {likeCount}
                    </div>
                    <div onClick={toggleBookmark}>
                        <i
                            className={
                                isBookmarked
                                    ? 'bx bxs-bookmark'
                                    : 'bx bx-bookmark'
                            }
                        ></i>
                        {bookmarkCount}
                    </div>
                    <div>
                        <i className="bx bx-show"></i> {viewCount}
                    </div>
                </div>
                <div className={styles.subMitLink}>
                    <div className={styles.Link} onClick={copyLinkToClipboard}>
                        <i class="bx bx-link"></i>
                    </div>
                    <div onClick={() => setIsModalOpen(true)}>
                        <PiSiren />
                        신고하기
                    </div>
                </div>
            </div>

            {/* 게시글 콘텐츠 */}
            <div className={styles.mainContent}>
                <p>
                    로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나
                    그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은
                    그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기
                    텍스트로, 최종 결과물에 들어가는 실제적인 문장 내용이
                    채워지기 전에 시각 디자인 프로젝트 모형의 채움 글로도
                    이용된다. 이런 용도로 사용할 때 로렘 입숨을
                    그리킹(greeking)이라고도 부르며, 때로 로렘 입숨은 공간만
                    차지하는 무언가를 지칭하는 용어로도 사용된다.
                </p>
            </div>

            {/* 댓글 작성 영역 */}
            <div className={styles.commentInput} onSubmit={handleAddComment}>
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

            {/* 댓글 리스트 */}
            <div className={styles.commentsSection}>
                {comments.map(comment => (
                    <div key={comment.id} className={styles.comment}>
                        <div className={styles.replyImg}>
                            <img src={comment.member_avatar} alt="" />
                        </div>
                        <div className={styles.replyInfo}>
                            <div className={styles.userName}>
                                {comment.nickname}
                            </div>
                            <p>{comment.text}</p>
                            <div className={styles.commentActions}>
                                <span>
                                    <i className="bx bxs-like"></i>{' '}
                                    {comment.likes}
                                </span>
                                <span>
                                    <i className="bx bx-message"></i> 답글달기
                                </span>
                                <span>
                                    <PiSiren />
                                    신고하기
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 신고 모달 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.reportModal}>
                    <h3>신고 사유를 선택해주세요</h3>
                    <ul className={styles.reportlist}>
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
