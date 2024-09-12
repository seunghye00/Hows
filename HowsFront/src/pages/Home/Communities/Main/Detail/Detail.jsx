import styles from './Detail.module.css'
import React, { useState, useEffect } from 'react'
import { ProfileSection } from './ProfileSection/ProfileSection'
import { ImageSwiper } from './ImageSwiper/ImageSwiper'
import { ReportModal } from './ReportModal/ReportModal'
import { PostActions } from './PostActions/PostActions'
import { Comment } from './Comment/Comment'
import Swal from 'sweetalert2'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { PiSiren } from 'react-icons/pi'
import { useNavigate, useParams } from 'react-router-dom'
import img from './../../../../../assets/images/cry.jpg'
import {
    getPostData,
    getImageData,
    getTagData,
    toggleLike,
    toggleBookmark,
    viewCounting,
    getReport,
    sendReport,
} from '../../../../../api/community' // API 함수 불러오기
import {
    sendComments,
    getComments,
    updateComment,
} from '../../../../../api/comment' // API 함수 불러오기
import { useAuthStore } from '../../../../../store/store'
import { BiMessageRounded } from 'react-icons/bi'

export const Detail = () => {
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const { board_seq } = useParams() // 경로 매개변수에서 board_seq 가져오기
    const [postData, setPostData] = useState(null) // 게시글 데이터를 저장할 상태
    const [imagesData, setImagesData] = useState(null) // 이미지 데이터를 저장할 상태
    const [tagsData, setTagsData] = useState(null) // 태그 데이터를 저장할 상태
    const [reportsData, setReportsData] = useState(null) // 신고 데이터를 저장할 상태
    const [isLiked, setIsLiked] = useState(false) // 좋아요 상태를 확인하는 상태
    const [likeCount, setLikeCount] = useState(0) // 좋아요 수를 저장할 상태
    const [isBookmarked, setIsBookmarked] = useState(false) // 북마크 상태를 확인하는 상태
    const [viewCount, setViewCount] = useState(0) // 조회수를 저장할 상태
    const [bookmarkCount, setBookmarkCount] = useState(0) // 북마크 수를 저장할 상태
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달이 열려있는지 여부를 저장할 상태
    const [selectedReports, setSelectedReports] = useState(null) // 선택된 신고 항목을 저장할 상태
    const [comments, setComments] = useState([]) // 댓글 목록
    const [comment, setComment] = useState('') // 새로운 댓글 내용
    const member_id = sessionStorage.getItem('member_id') || null // 세션에서 member_id 가져오기

    // 게시글 정보 및 이미지, 태그 정보 받아오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 세션에서 member_id 가져오기 (비회원일 경우 null로 처리)

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

                // 신고 데이터 가져오기
                const reports = await getReport()
                setReportsData(reports)

                // 좋아요, 북마크 상태 업데이트 (서버에서 받아온 데이터 사용)
                setIsLiked(postData.data.isLiked) // 서버에서 받아온 좋아요 상태
                setIsBookmarked(postData.data.isBookmarked) // 서버에서 받아온 북마크 상태
                setLikeCount(postData.data.LIKE_COUNT)
                setBookmarkCount(postData.data.BOOKMARK_COUNT)

                // 댓글 데이터 가져오기
                const commentsData = await getComments(board_seq)
                setComments(commentsData) // 댓글 목록 상태 업데이트
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error)
            }
        }

        fetchData() // 함수 실행
    }, [board_seq])

    // 좋아요, 북마크 상태 변경
    const toggleLikeHandler = async () => {
        if (!member_id || !isAuth) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/signIn') // 로그인 페이지로 이동
            })
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
        if (!member_id || !isAuth) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/signIn') // 로그인 페이지로 이동
            })
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
    const handleOpenReportModal = () => {
        if (!member_id || !isAuth) {
            // 로그인되지 않은 경우 SweetAlert 경고 후 로그인 페이지로 이동
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/signIn') // 로그인 페이지로 이동
            })
        } else {
            // 로그인된 경우에만 모달 열기
            setIsModalOpen(true)
        }
    }

    // 신고하기 버튼 클릭 시 호출되는 전송 함수
    const handleReportSubmit = async () => {
        if (!selectedReports) {
            setIsModalOpen(false) // 모달 닫기
            Swal.fire({
                icon: 'warning',
                title: '신고 사유를 선택해주세요.',
                showConfirmButton: true,
            })
            return
        }

        try {
            setIsModalOpen(false) // 모달 닫기
            await sendReport(board_seq, selectedReports, member_id) // 신고 API 호출
            Swal.fire({
                icon: 'success',
                title: '신고가 접수되었습니다.',
                text: '신고가 성공적으로 접수되었습니다.',
                showConfirmButton: false,
                timer: 1500,
            })
        } catch (error) {
            setIsModalOpen(false) // 모달 닫기
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '신고 처리 중 오류가 발생했습니다.',
                showConfirmButton: true,
            })
        }
    }

    // 댓글 작성 처리 함수
    const handleCommentSubmit = async () => {
        if (!member_id) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            })
            return
        }

        if (!comment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: '댓글 내용을 입력해주세요.',
                showConfirmButton: true,
            })
            return
        }
        // 콘솔로 값 출력해서 확인
        console.log('board_seq:', board_seq)
        console.log('member_id:', member_id)
        console.log('comment:', comment)
        try {
            await sendComments(board_seq, member_id, comment.trim())
            onCommentSubmit() // 댓글 제출 후 목록 새로고침
            setComment('') // 댓글 필드 초기화
        } catch (error) {
            console.error('댓글 작성 중 오류 발생:', error)
            Swal.fire({
                icon: 'error',
                title: '댓글 작성 중 오류가 발생했습니다.',
                showConfirmButton: true,
            })
        }
    }

    // 댓글 제출 후 목록 새로고침
    const onCommentSubmit = async () => {
        try {
            const response = await getComments(board_seq)
            setComments(response.data.comments)
        } catch (error) {
            console.error('댓글 목록 갱신 실패:', error)
        }
    }

    const handleDeleteComment = async comment_seq => {
        // 댓글 삭제 처리 로직
        // await deleteComment(comment_seq)
        // onCommentSubmit() // 삭제 후 목록 새로고침
    }

    // 댓글 수정 처리 함수
    const handleUpdateComment = async (comment_seq, updatedContent) => {
        if (!updatedContent.trim()) {
            Swal.fire({
                icon: 'warning',
                title: '수정할 내용을 입력해주세요.',
                showConfirmButton: true,
            })
            return
        }

        try {
            await updateComment(comment_seq, updatedContent) // 댓글 수정 API 호출
            onCommentSubmit() // 댓글 목록 새로고침
            Swal.fire({
                icon: 'success',
                title: '댓글이 성공적으로 수정되었습니다.',
                showConfirmButton: true,
            })
        } catch (error) {
            console.error('댓글 수정 중 오류 발생:', error)
            Swal.fire({
                icon: 'error',
                title: '댓글 수정 중 오류가 발생했습니다.',
                showConfirmButton: true,
            })
        }
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
                    <PostActions
                        isLiked={isLiked}
                        likeCount={likeCount}
                        toggleLikeHandler={toggleLikeHandler}
                        isBookmarked={isBookmarked}
                        bookmarkCount={bookmarkCount}
                        toggleBookmarkHandler={toggleBookmarkHandler}
                        viewCount={viewCount}
                        copyLinkToClipboard={copyLinkToClipboard}
                        handleOpenReportModal={handleOpenReportModal}
                    />
                    <div className={styles.commentInfo}>
                        <div className={styles.commetIcon}>
                            <BiMessageRounded />
                        </div>
                        <div className={styles.commentCount}>
                            {postData.COMMENTS_COUNT}
                        </div>
                    </div>
                </>
            )}
            {/* 댓글 작성 영역 */}
            <div className={styles.commentInput}>
                <div className={styles.writerProfile}>
                    <img src={postData?.MEMBER_AVATAR} alt="profile" />
                </div>
                <textarea
                    placeholder="댓글을 입력하세요 (최대 300자)"
                    value={comment}
                    onChange={e => {
                        if (e.target.value.length <= 300)
                            setComment(e.target.value)
                    }}
                    onInput={e => {
                        e.target.style.height = 'auto' // 높이를 자동으로 설정하여 이전 설정을 초기화
                        e.target.style.height = `${Math.min(
                            e.target.scrollHeight,
                            72
                        )}px` // 내용에 따라 높이를 조정, 최대 72px로 제한
                    }}
                    onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault() // 줄바꿈 방지
                            handleCommentSubmit() // 댓글 전송 함수 호출
                        }
                    }}
                    name="comment_contents"
                    className={styles.replyArea}
                />
            </div>

            <div className={styles.commentCont}>
                {comments && comments.length > 0 ? (
                    comments.map(comment => (
                        <Comment
                            key={comment.comment_seq}
                            commentData={comment}
                            onLike={id =>
                                console.log(`${id}번 댓글 좋아요 클릭`)
                            }
                            onEdit={id => console.log(`${id}번 댓글 수정 클릭`)}
                            onDelete={handleDeleteComment}
                            onReport={id =>
                                console.log(`${id}번 댓글 신고 클릭`)
                            }
                            handleUpdateComment={handleUpdateComment} // 수정 함수 전달
                        />
                    ))
                ) : (
                    <p className={styles.emptyComment}>댓글이 없습니다.</p>
                )}
            </div>

            {/* 신고 영역 */}
            <ReportModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                reportsData={reportsData}
                selectedReports={selectedReports}
                setSelectedReports={setSelectedReports}
                handleReportSubmit={handleReportSubmit}
            />
            <ScrollTop />
        </div>
    )
}
