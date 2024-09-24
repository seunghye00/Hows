import React, { useState, useEffect, useCallback } from 'react'
import styles from './Comment.module.css'
import { PiSiren } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../../../store/store'
import {
    toggleLikeAPI,
    sendReply,
    getReplies,
    updateReplyAPI, // Reply 업데이트 API 추가
    deleteReply,
} from '../../../../../../api/comment'
import { userInfo } from '../../../../../../api/member'
import { Reply } from './Reply/Reply'
import Swal from 'sweetalert2'

// 날짜 형식을 처리하는 유틸리티 함수
const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return '오늘' // 하루 이내인 경우
    if (diffDays === 1) return '어제' // 어제인 경우
    if (diffDays <= 7) return `${diffDays}일 전` // 7일 이내인 경우
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}` // 7일 이상인 경우 연-월-일 형식 반환
}

// Comment 컴포넌트는 각 댓글과 답글 기능을 관리합니다.
export const Comment = ({
    commentData, // 댓글 데이터
    handleOpenReportModalForComment, // 댓글 신고 모달을 여는 함수
    handleUpdateComment, // 댓글 수정 함수
    handleDeleteComment, // 댓글 삭제 함수
    setIsModalOpen, // 상위 컴포넌트에서 전달받음
    setSelectedReplySeq, // 상위 컴포넌트에서 전달받음
}) => {
    const navigate = useNavigate() // 프로필 페이지로 이동을 위한 네비게이션 훅
    const { isAuth } = useAuthStore() // 로그인 여부를 확인하는 전역 상태
    const member_id = sessionStorage.getItem('member_id') // 로그인된 유저의 ID를 가져옴
    const isOwner = isAuth && member_id === commentData?.MEMBER_ID // 댓글 작성자가 현재 로그인된 유저인지 확인
    const [isEditing, setIsEditing] = useState(false) // 댓글 수정 모드 여부
    const [isLiked, setIsLiked] = useState(commentData.isLiked || false) // 좋아요 여부
    const [likeCount, setLikeCount] = useState(commentData.LIKE_COUNT || 0) // 좋아요 개수
    const [replyContent, setReplyContent] = useState('') // 답글 입력 상태
    const [replies, setReplies] = useState([]) // 답글 목록을 상태로 관리
    const [activeReplySeq, setActiveReplySeq] = useState(null) // 활성화된 답글 입력창의 댓글 번호
    const [userProfile, setUserProfile] = useState('') // 유저 프로필 이미지
    const [showAllReplies, setShowAllReplies] = useState(false) // 모든 답글을 보여줄지 여부
    const [editingReplySeq, setEditingReplySeq] = useState(null)

    // 유저 프로필 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (member_id) {
                try {
                    const response = await userInfo(member_id) // 유저 정보 API 호출
                    setUserProfile(response.data.member_avatar) // 유저 프로필 이미지 설정
                } catch (error) {
                    console.error('유저 정보 불러오기 중 오류 발생:', error)
                }
            }
        }
        fetchUserInfo()
    }, [member_id]) // member_id가 변경될 때마다 실행

    // 댓글에 달린 답글 목록을 불러오기
    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await getReplies(
                    commentData.COMMENT_SEQ,
                    member_id
                )
                setReplies(response.replies) // 답글 목록 설정
            } catch (error) {
                console.error('답글 불러오기 중 오류 발생:', error)
            }
        }
        fetchReplies()
    }, [commentData.COMMENT_SEQ, member_id])

    // 답글 업데이트 함수 (Reply 컴포넌트에 전달)
    const handleUpdateReply = async (replySeq, updatedContent) => {
        try {
            await updateReplyAPI(replySeq, updatedContent) // 답글 수정 API 호출
            const updatedReplies = replies.map(reply =>
                reply.REPLY_SEQ === replySeq
                    ? { ...reply, REPLY_CONTENTS: updatedContent } // 해당 답글 업데이트
                    : reply
            )
            setReplies(updatedReplies) // 업데이트된 답글 목록 상태로 설정
        } catch (error) {
            console.error('답글 수정 중 오류 발생:', error)
        }
    }

    // 좋아요 처리 함수
    const handleLike = async () => {
        if (!isAuth || !member_id) {
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
            const response = await toggleLikeAPI(
                commentData.COMMENT_SEQ,
                member_id
            )
            const { isLiked: updatedIsLiked, like_count: updatedLikeCount } =
                response.data
            setIsLiked(updatedIsLiked) // 좋아요 상태 업데이트
            setLikeCount(updatedLikeCount) // 좋아요 개수 업데이트
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    // 답글 입력창을 열거나 닫는 함수
    const toggleReply = () => {
        if (!isAuth || !member_id) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/signIn') // 로그인 페이지로 이동
            })
            return
        }
        setActiveReplySeq(prevSeq =>
            prevSeq === commentData.COMMENT_SEQ ? null : commentData.COMMENT_SEQ
        )
    }

    // 답글 작성 함수
    const handleReplySubmit = async replySeq => {
        const content = replyContent.trim() // 입력된 답글 내용 가져오기

        if (!content) return // 내용이 없으면 처리하지 않음
        if (content.length > 300) {
            Swal.fire({
                icon: 'error',
                title: '답글은 300글자를 넘을 수 없습니다.',
                showConfirmButton: true,
            })
            return
        }

        try {
            // 서버로 전송
            await sendReply(replySeq, content, member_id)

            // 답글 입력창 초기화
            setReplyContent('')

            // 답글 입력창 닫기
            setActiveReplySeq(null)

            // 답글 목록 다시 불러오기
            const response = await getReplies(
                commentData.COMMENT_SEQ,
                member_id
            )
            setReplies(response.replies) // 답글 목록 업데이트
        } catch (error) {
            console.error('답글 작성 중 오류 발생:', error)
        }
    }

    // 댓글 수정 모드 토글
    const toggleEditMode = () => {
        setIsEditing(!isEditing)
        if (!isEditing) {
            // 수정 모드로 진입할 때 기존 댓글 내용을 replyContent로 설정
            setReplyContent(commentData.COMMENT_CONTENTS)
        } else {
            // 수정 모드에서 나갈 때 replyContent를 초기화
            setReplyContent('')
        }
    }

    // 댓글 수정 후 저장 처리
    const handleSaveEdit = () => {
        handleUpdateComment(commentData.COMMENT_SEQ, replyContent) // 수정된 댓글 저장
        setIsEditing(false) // 수정 모드 종료
    }

    // 댓글 삭제 처리
    const handleDelete = () => {
        handleDeleteComment(commentData.COMMENT_SEQ) // 댓글 삭제
    }

    // 답글 삭제 처리 함수
    const handleDeleteReply = async replySeq => {
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
                await deleteReply(replySeq) // 삭제 API 호출

                // 삭제 후 상태 업데이트
                setReplies(
                    replies.filter(reply => reply.REPLY_SEQ !== replySeq)
                )

                // 삭제 완료 메시지 표시
                Swal.fire({
                    title: '삭제 완료',
                    text: '답글이 삭제되었습니다.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                })
            }
        } catch (error) {
            console.error('답글 삭제 중 오류 발생:', error)
            Swal.fire({
                title: '오류 발생',
                text: '답글 삭제 중 문제가 발생했습니다. 다시 시도해주세요.',
                icon: 'error',
            })
        }
    }

    // 답글 신고 모달 열기
    const handleOpenReportModalForReply = replySeq => {
        if (!isAuth || !member_id) {
            Swal.fire({
                icon: 'warning',
                title: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/signIn') // 로그인 페이지로 이동
            })
            return
        }
        setIsModalOpen(true) // 신고 모달을 열기 위한 상태 업데이트
        setSelectedReplySeq(replySeq) // 선택된 답글의 seq 저장
    }

    return (
        <div className={styles.commentCont}>
            <div className={styles.commentInfo}>
                <div className={styles.imgBox}>
                    <img src={commentData.MEMBER_AVATAR} alt="profile" />
                </div>
                <div className={styles.commentName}>
                    <a
                        onClick={() =>
                            navigate(
                                `/mypage/main/${commentData.MEMBER_ID}/post`
                            )
                        }
                    >
                        {commentData.NICKNAME} {/* 댓글 작성자의 닉네임 */}
                    </a>
                </div>
            </div>

            {/* 댓글 본문 */}
            <div className={styles.commentBox}>
                <div className={styles.commentTxt}>
                    {isEditing ? (
                        <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)} // 수정 중일 때 댓글 내용을 textarea로 표시
                            maxLength={300} // 300글자 제한
                            rows={3}
                        />
                    ) : (
                        commentData.COMMENT_CONTENTS // 수정 중이 아닐 때 댓글 내용 표시
                    )}
                </div>

                {/* 댓글 하단 버튼: 좋아요, 답글 달기, 수정/삭제 */}
                <div className={styles.btnBox}>
                    <div className={styles.replyBtnBox}>
                        <div className={styles.replyLeft}>
                            <div className={styles.commentDate}>
                                {formatDate(commentData.COMMENT_WRITE_DATE)}
                            </div>
                            <div
                                className={styles.btnLike}
                                onClick={handleLike} // 좋아요 클릭 처리
                            >
                                <i
                                    className={
                                        isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                    }
                                ></i>
                                <span className={styles.likeCount}>
                                    {likeCount} {/* 좋아요 개수 */}
                                </span>
                            </div>
                            <div
                                className={styles.replyLeave}
                                onClick={toggleReply} // 답글 입력창 열기
                            >
                                답글 달기
                            </div>
                        </div>

                        {/* 댓글 작성자만 수정/삭제 가능 */}
                        <div className={styles.replyRight}>
                            {isOwner && (
                                <>
                                    {isEditing ? (
                                        <>
                                            <div
                                                className={styles.btnSave}
                                                onClick={handleSaveEdit} // 댓글 수정 저장
                                            >
                                                저장
                                            </div>
                                            <div
                                                className={styles.btnCancel}
                                                onClick={toggleEditMode} // 수정 모드 취소
                                            >
                                                취소
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={styles.btnEdit}
                                                onClick={toggleEditMode} // 댓글 수정 모드 진입
                                            >
                                                수정
                                            </div>
                                            <div
                                                className={styles.btnDelete}
                                                onClick={handleDelete} // 댓글 삭제 처리
                                            >
                                                삭제
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                            {!isOwner ? (
                                <div
                                    className={styles.reportComment}
                                    onClick={() =>
                                        handleOpenReportModalForComment(
                                            commentData.COMMENT_SEQ
                                        )
                                    } // 댓글 신고 처리
                                >
                                    <PiSiren />
                                    신고하기
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>

                {/* 답글 목록 토글 버튼 (1개 이상의 답글이 있을 때만 표시) */}
                {replies.length > 1 && (
                    <a
                        className={styles.toggleReplyBtn}
                        onClick={() => setShowAllReplies(!showAllReplies)}
                    >
                        {showAllReplies
                            ? '접기'
                            : `${replies.length}개 댓글 보기`}{' '}
                        {/* 답글 보기/접기 */}
                    </a>
                )}

                {/* 답글 목록 */}
                <div className={styles.replyList}>
                    {showAllReplies
                        ? replies.map(reply => (
                              <Reply
                                  key={reply.REPLY_SEQ}
                                  replyData={reply}
                                  handleReplyToggle={setActiveReplySeq}
                                  activeReplySeq={activeReplySeq}
                                  handleReplySubmit={handleReplySubmit}
                                  replyContent={replyContent}
                                  editingReplySeq={editingReplySeq}
                                  setEditingReplySeq={setEditingReplySeq} // 답글 수정 전달
                                  setReplyContent={setReplyContent}
                                  member_id={member_id}
                                  handleUpdateReply={handleUpdateReply} // 답글 수정 처리
                                  handleDeleteReply={handleDeleteReply} // 답글 삭제 처리
                                  handleOpenReportModalForReply={
                                      handleOpenReportModalForReply
                                  } // 답글 신고 처리
                                  toggleReply={toggleReply} // toggleReply 함수 전달
                              />
                          ))
                        : replies.slice(-1).map(reply => (
                              <Reply
                                  key={reply.REPLY_SEQ}
                                  replyData={reply}
                                  handleReplyToggle={setActiveReplySeq}
                                  activeReplySeq={activeReplySeq}
                                  handleReplySubmit={handleReplySubmit}
                                  replyContent={replyContent}
                                  editingReplySeq={editingReplySeq}
                                  setEditingReplySeq={setEditingReplySeq} // 답글 수정 전달
                                  setReplyContent={setReplyContent}
                                  isOwner={isOwner}
                                  member_id={member_id}
                                  handleUpdateReply={handleUpdateReply} // 답글 수정 처리
                                  handleDeleteReply={handleDeleteReply} // 답글 삭제 처리
                                  handleOpenReportModalForReply={
                                      handleOpenReportModalForReply
                                  } // 답글 신고 처리
                                  toggleReply={toggleReply} // toggleReply 함수 전달
                              />
                          ))}
                </div>

                {/* 답글 입력창 (답글 달기 버튼을 클릭한 경우에만 표시) */}
                {activeReplySeq === commentData.COMMENT_SEQ && (
                    <div className={styles.replyInputContainer}>
                        <div className={styles.imgBox}>
                            <img src={userProfile} alt="profile" />
                        </div>
                        <textarea
                            className={styles.replyTextarea}
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)} // 텍스트 입력 시 상태 업데이트
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault() // 기본 Enter 동작 막음
                                    handleReplySubmit(commentData.COMMENT_SEQ) // 엔터 누르면 답글 전송
                                }
                            }}
                            onInput={e => {
                                e.target.style.height = 'auto'
                                e.target.style.height = `${Math.min(
                                    e.target.scrollHeight,
                                    60
                                )}px`
                            }}
                            placeholder="답글을 입력하세요."
                            rows={2}
                            maxLength={300} // 300글자 제한
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
