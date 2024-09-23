import styles from './Detail.module.css'
import React, { useState, useEffect } from 'react'
import { ProfileSection } from './ProfileSection/ProfileSection'
import { ImageSwiper } from './ImageSwiper/ImageSwiper'
import { ReportModal } from './ReportModal/ReportModal'
import { PostActions } from './PostActions/PostActions'
import { Comment } from './Comment/Comment'
import Swal from 'sweetalert2'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { Paging } from '../../../../../components/Pagination/Paging'
import { useNavigate, useParams } from 'react-router-dom'
import {
    getPostData,
    getImageData,
    getTagData,
    toggleLike,
    toggleBookmark,
    viewCounting,
    getReport,
    sendReport,
    deleteCommunity,
} from '../../../../../api/community' // API 함수 불러오기
import {
    sendComments,
    getComments,
    updateComment,
    deleteComment,
    sendCommentReport,
    sendReplyReport,
} from '../../../../../api/comment' // API 함수 불러오기
import { userInfo } from '../../../../../api/member' // API 함수 불러오기
import { useAuthStore } from '../../../../../store/store'
import { BiMessageRounded } from 'react-icons/bi'
import defaultProfile from '../../../../../assets/images/defaultProfile.png'

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
    const [selectedCommentSeq, setSelectedCommentSeq] = useState(null) // 선택된 댓글 시퀀스 추가
    const [selectedReplySeq, setSelectedReplySeq] = useState(null) // 선택된 답글 시퀀스 추가
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [itemsPerPage] = useState(5) // 페이지당 항목 수 (5개)
    const [totalCommentsCount, setTotalCommentsCount] = useState(0) // 전체 댓글 수
    const [userProfile, setUserProfile] = useState('') // 유저 프로필 정보 상태
    const isOwner = isAuth && member_id === postData?.MEMBER_ID // 댓글 작성자가 현재 로그인된 유저인지 확인

    // 게시글 정보 및 이미지, 태그 정보 받아오기
    useEffect(() => {
        const fetchData = async () => {
            try {
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
                const commentsData = await getComments(
                    board_seq,
                    member_id,
                    page,
                    itemsPerPage
                )
                setComments(commentsData.comments) // 댓글 목록 상태 업데이트
                setTotalCommentsCount(commentsData.totalCount) // 전체 댓글 수 업데이트

                // member_id가 있는 경우에만 유저 정보를 가져옴
                if (member_id) {
                    try {
                        // 유저 정보 불러오기 (세션에서 가져온 member_id로)
                        const response = await userInfo(member_id)
                        setUserProfile(response.data.member_avatar) // 유저 아바타 정보 가져오기
                    } catch (error) {
                        console.error(
                            '멤버 정보를 가져오는 중 오류 발생:',
                            error
                        )
                    }
                } else {
                    console.log(
                        '로그인하지 않은 사용자입니다. 유저 정보를 가져오지 않습니다.'
                    )
                }
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error)
            }
        }

        fetchData() // 함수 실행
    }, [board_seq, page]) // 페이지 또는 게시글 번호가 변경될 때마다 호출

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

    // 게시글 삭제
    const handleDeletePost = async () => {
        try {
            const result = await Swal.fire({
                title: '게시글을 삭제하시겠습니까?',
                text: '삭제 후에는 복구할 수 없습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
            })

            if (result.isConfirmed) {
                await deleteCommunity(board_seq) // 게시글 삭제 API 호출

                Swal.fire({
                    icon: 'success',
                    title: '게시글이 삭제되었습니다.',
                    showConfirmButton: false,
                    timer: 1500,
                })

                navigate('/communities') // 삭제 후 커뮤니티 목록 페이지로 이동
            }
        } catch (error) {
            console.error('게시글 삭제 중 오류 발생:', error)
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '게시글 삭제 중 문제가 발생했습니다.',
                showConfirmButton: true,
            })
        }
    }

    // 게시글 수정
    const handleModify = () => {
        navigate(`/communities/modify/${board_seq}`) // board_seq를 path에 포함하여 Modify로 이동
    }

    // 북마크 기능
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

    // 게시글 신고
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
            setSelectedCommentSeq(null)
            setSelectedReplySeq(null)
            setIsModalOpen(true)
        }
    }

    // 댓글 신고하기 버튼 클릭 시 호출되는 함수
    const handleOpenReportModalForComment = commentSeq => {
        if (!member_id || !isAuth) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/signIn')
            })
        } else {
            setSelectedCommentSeq(commentSeq) // 댓글 신고 시 해당 댓글 시퀀스 설정
            setIsModalOpen(true) // 모달 열기
        }
    }

    // 신고 제출 처리
    const handleReportSubmit = async () => {
        if (!selectedReports) {
            Swal.fire({
                icon: 'warning',
                title: '신고 사유를 선택해주세요.',
                showConfirmButton: true,
            })
            return
        }

        try {
            setIsModalOpen(false)
            if (selectedCommentSeq) {
                await sendCommentReport(
                    selectedCommentSeq,
                    selectedReports,
                    member_id
                ) // 댓글 신고
            } else if (selectedReplySeq) {
                await sendReplyReport(
                    selectedReplySeq,
                    selectedReports,
                    member_id
                ) // 답글 신고
            } else {
                await sendReport(board_seq, selectedReports, member_id) // 게시글 신고
            }
            // 신고 후 상태 초기화
            setSelectedCommentSeq(null)
            setSelectedReplySeq(null)
            setSelectedReports(null)

            Swal.fire({
                icon: 'success',
                title: '신고가 접수되었습니다.',
                showConfirmButton: false,
                timer: 1500,
            })
        } catch (error) {
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
        // 로그인 여부 확인
        if (!member_id) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            })
            return
        }

        // 댓글 입력 여부 확인
        if (!comment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: '댓글 내용을 입력해주세요.',
                showConfirmButton: true,
            })
            return
        }

        try {
            // 댓글 전송
            await sendComments(board_seq, member_id, comment.trim())

            // 댓글 제출 후 목록 새로고침 함수 호출
            onCommentSubmit()

            // 댓글 입력 필드 초기화
            setComment('')

            Swal.fire({
                icon: 'success',
                title: '댓글이 성공적으로 작성되었습니다.',
                showConfirmButton: false,
                timer: 1500,
            })
        } catch (error) {
            console.error('댓글 작성 중 오류 발생:', error)

            Swal.fire({
                icon: 'error',
                title: '댓글 작성 중 오류가 발생했습니다.',
                text: '다시 시도해주세요.',
                showConfirmButton: true,
            })
        }
    }

    // 댓글 제출 후 목록 새로고침
    const onCommentSubmit = async () => {
        try {
            const response = await getComments(
                board_seq,
                member_id,
                page,
                itemsPerPage
            )

            // 댓글 목록을 불러온 후 상태 업데이트
            setComments(response.comments)
            setTotalCommentsCount(response.totalCount)
        } catch (error) {
            console.error('댓글 목록 갱신 실패:', error)
        }
    }

    // 댓글 삭제
    const handleDeleteComment = async comment_seq => {
        try {
            const result = await Swal.fire({
                title: '정말로 삭제하시겠습니까?',
                text: '삭제 후에는 되돌릴 수 없습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '네, 삭제할래요!',
                cancelButtonText: '아니요, 취소할래요',
            })

            if (result.isConfirmed) {
                await deleteComment(comment_seq) // 댓글 삭제 API 호출

                // 삭제 후 댓글 목록 다시 불러오기
                await onCommentSubmit()

                Swal.fire({
                    icon: 'success',
                    title: '댓글이 삭제되었습니다.',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error)
            Swal.fire({
                icon: 'error',
                title: '댓글 삭제 실패',
                text: '오류가 발생했습니다.',
                showConfirmButton: true,
            })
        }
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

    // 페이지네이션
    const handlePageChange = newPage => {
        setPage(newPage)
    }

    return (
        <div className={styles.container}>
            {postData && (
                <>
                    <ProfileSection
                        profileData={postData}
                        handleDeletePost={handleDeletePost} // 삭제 함수 전달
                        handleModify={handleModify} // 수정 함수 전달
                    />
                    <div className={styles.imageSection}>
                        <ImageSwiper images={imagesData} tags={tagsData} />
                    </div>
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
                        isOwner={isOwner}
                    />
                    <div className={styles.mainContent}>
                        {postData.BOARD_CONTENTS}
                    </div>
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
            <div className={styles.commentInput}>
                <div className={styles.writerProfile}>
                    <img src={userProfile || defaultProfile} alt="profile" />
                </div>
                <textarea
                    placeholder="댓글을 입력하세요 (최대 300자)"
                    value={comment}
                    onChange={e => {
                        if (e.target.value.length <= 300)
                            setComment(e.target.value)
                    }}
                    onInput={e => {
                        e.target.style.height = 'auto'
                        e.target.style.height = `${Math.min(
                            e.target.scrollHeight,
                            72
                        )}px`
                    }}
                    onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleCommentSubmit()
                        }
                    }}
                    name="comment_contents"
                    className={styles.replyArea}
                />
            </div>

            <div className={styles.commentCont}>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <Comment
                            key={comment.COMMENT_SEQ}
                            commentData={comment}
                            onDelete={handleDeleteComment}
                            handleOpenReportModalForComment={
                                handleOpenReportModalForComment
                            }
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            setIsModalOpen={setIsModalOpen} // 모달 상태 전달
                            setSelectedReplySeq={setSelectedReplySeq} // 답글 신고 처리 전달
                        />
                    ))
                ) : (
                    <p className={styles.emptyComment}>댓글이 없습니다.</p>
                )}
            </div>

            {/*  댓글 없으면 페이지네이션 출력 X */}
            {comments.length > 0 ? (
                <Paging
                    page={page}
                    count={totalCommentsCount}
                    setPage={handlePageChange}
                    perpage={itemsPerPage}
                />
            ) : (
                <></>
            )}

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
