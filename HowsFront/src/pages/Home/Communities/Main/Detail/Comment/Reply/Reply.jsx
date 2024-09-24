import React, { useState, useEffect } from 'react'
import styles from './Reply.module.css'
import { toggleLikeReply } from '../../../../../../../api/comment' // 좋아요 API 가져오기
import { PiSiren } from 'react-icons/pi'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../../../../store/store'

// 날짜 포맷팅 함수
const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays <= 7) return `${diffDays}일 전`
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const Reply = ({
    replyData, // 답글 데이터
    handleUpdateReply, // 수정된 답글을 서버로 전송하는 함수 (Comment에서 전달)
    handleDeleteReply, // 삭제 함수도 props로 전달
    handleReplyToggle, // 답글 달기 토글
    activeReplySeq, // 활성화된 답글 seq
    editingReplySeq, // 현재 수정 중인 답글 seq
    setEditingReplySeq, // 수정 모드 설정 함수
    member_id, // 사용자 ID
    handleOpenReportModalForReply, // 신고 모달 열기 함수 (부모로부터 전달)
    toggleReply,
}) => {
    const { isAuth } = useAuthStore() // 로그인 여부를 확인하는 전역 상태
    const navigate = useNavigate() // 페이지 이동을 위한 네비게이션 훅
    const [replyContent, setReplyContent] = useState(replyData.REPLY_CONTENTS) // 답글 내용 상태
    const [isLiked, setIsLiked] = useState(replyData.isLiked) // 좋아요 상태 초기화
    const [likeCount, setLikeCount] = useState(replyData.LIKE_COUNT) // 좋아요 수 초기화
    const [charCount, setCharCount] = useState(replyData.REPLY_CONTENTS.length) // 글자수 상태
    const isReplyOwner = isAuth && member_id === replyData?.MEMBER_ID

    // 수정 모드 토글 (내용 그대로 유지)
    const toggleEditMode = () => {
        if (editingReplySeq !== replyData.REPLY_SEQ) {
            setEditingReplySeq(replyData.REPLY_SEQ)
        } else {
            setEditingReplySeq(null)
        }
    }

    // 수정된 내용을 서버로 제출하는 함수
    const handleSaveEdit = async () => {
        const content = replyContent.trim()

        if (content.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '내용을 입력해주세요.',
                showConfirmButton: true,
            })
            return
        }

        try {
            await handleUpdateReply(replyData.REPLY_SEQ, content)
            setEditingReplySeq(null) // 수정 모드 종료
        } catch (error) {
            console.error('답글 수정 중 오류 발생:', error)
        }
    }

    const handleDelete = () => {
        // 상위 컴포넌트에 삭제 요청 전달
        handleDeleteReply(replyData.REPLY_SEQ)
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
            const response = await toggleLikeReply(
                replyData.REPLY_SEQ,
                member_id
            )
            const { isLiked: updatedIsLiked, like_count: updatedLikeCount } =
                response.data

            // UI 업데이트
            setIsLiked(updatedIsLiked)
            setLikeCount(updatedLikeCount)
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    // 답글 달기 버튼 클릭 처리
    const handleReplyClick = () => {
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
        toggleReply(replyData.REPLY_SEQ)
    }

    // 글자수 제한 함수
    const handleInputChange = e => {
        const input = e.target.value
        if (input.length <= 300) {
            setReplyContent(input)
            setCharCount(input.length)
        }
    }

    return (
        <div className={styles.replyItem}>
            <div
                className={styles.replyHeader}
                onClick={() =>
                    navigate(`/mypage/main/${replyData.MEMBER_ID}/post`)
                }
            >
                <div className={styles.imgBox}>
                    <img src={replyData.MEMBER_AVATAR} alt="profile" />
                </div>
                <div className={styles.replyNickname}>{replyData.NICKNAME}</div>
            </div>
            <div
                className={`${styles.replyTextarea} ${
                    editingReplySeq === replyData.REPLY_SEQ
                        ? styles.editing
                        : ''
                }`}
            >
                {editingReplySeq === replyData.REPLY_SEQ ? (
                    <textarea
                        className={styles.replyTxt}
                        value={replyContent}
                        onChange={handleInputChange}
                        placeholder="수정할 내용을 입력하세요."
                        rows={3}
                        maxLength={300} // 300글자 제한
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                // Enter로 줄바꿈 허용
                                return
                            }
                        }}
                    />
                ) : (
                    replyData.REPLY_CONTENTS
                )}
            </div>
            <div className={styles.replyBtnBox}>
                <div className={styles.replyLeft}>
                    <div className={styles.replyDate}>
                        {formatDate(replyData.REPLY_DATE)}
                    </div>
                    <div className={styles.replyLike} onClick={handleLike}>
                        <i
                            className={isLiked ? 'bx bxs-heart' : 'bx bx-heart'}
                        ></i>
                        <span className={styles.likeCount}>{likeCount}</span>
                    </div>
                    <div className={styles.replyBtnBox}>
                        <div
                            className={styles.replyLeave}
                            onClick={handleReplyClick}
                        >
                            답글 달기
                        </div>
                    </div>
                </div>
                <div className={styles.replyRight}>
                    {isReplyOwner ? (
                        <>
                            {editingReplySeq === replyData.REPLY_SEQ ? (
                                <>
                                    <div
                                        className={styles.btnSave}
                                        onClick={handleSaveEdit}
                                    >
                                        저장
                                    </div>
                                    <div
                                        className={styles.btnCancel}
                                        onClick={toggleEditMode}
                                    >
                                        취소
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className={styles.btnEdit}
                                        onClick={toggleEditMode}
                                    >
                                        수정
                                    </div>
                                    <div
                                        className={styles.btnDelete}
                                        onClick={handleDelete}
                                    >
                                        삭제
                                    </div>
                                </>
                            )}
                        </>
                    ) : null}
                    {/* 신고하기 버튼 */}
                    {!isReplyOwner ? (
                        <div
                            className={styles.reportComment}
                            onClick={() =>
                                handleOpenReportModalForReply(
                                    replyData.REPLY_SEQ
                                )
                            }
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
    )
}
