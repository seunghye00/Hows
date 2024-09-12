import React, { useState } from 'react'
import styles from './Comment.module.css'
import { PiSiren } from 'react-icons/pi'
import { useAuthStore } from '../../../../../../store/store'
import { toggleLikeAPI } from '../../../../../../api/comment' // 좋아요 처리 API 함수
import { useNavigate } from 'react-router-dom'

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

export const Comment = ({
    commentData,
    isReply = false, // 답글 여부
    handleOpenReportModalForComment,
    handleUpdateComment,
    handleDeleteComment,
}) => {
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    const { isAuth } = useAuthStore() // 로그인 여부
    const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
    const isOwner = isAuth && member_id === commentData?.MEMBER_ID
    const [isEditing, setIsEditing] = useState(false) // 수정 상태 관리
    const [isLiked, setIsLiked] = useState(commentData.isLiked || false) // 서버에서 받은 좋아요 여부 상태
    const [likeCount, setLikeCount] = useState(commentData.LIKE_COUNT || 0) // 서버에서 받은 좋아요 수 상태
    const [editedComment, setEditedComment] = useState(
        commentData.COMMENT_CONTENTS
    ) // 수정된 댓글 내용

    // 수정 모드를 토글하는 함수
    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    // 댓글 삭제 함수
    const handleSaveEdit = () => {
        handleUpdateComment(commentData.COMMENT_SEQ, editedComment) // 수정된 댓글 서버에 업데이트
        setIsEditing(false) // 수정 모드 종료
    }

    // 좋아요 처리 함수
    const handleLike = async () => {
        if (!isAuth) navigate('/signIn')
        try {
            const response = await toggleLikeAPI(
                commentData.COMMENT_SEQ,
                member_id
            )
            const { isLiked: updatedIsLiked, like_count: updatedLikeCount } =
                response.data

            setIsLiked(updatedIsLiked) // 서버에서 받은 좋아요 상태로 업데이트
            setLikeCount(updatedLikeCount) // 서버에서 받은 좋아요 수로 업데이트
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    // 댓글 삭제 완료 함수
    const handleDelete = () => {
        handleDeleteComment(commentData.COMMENT_SEQ) // 서버에서 댓글 삭제
    }

    return (
        <div className={styles.commentCont}>
            {/* 댓글 또는 답글의 프로필 이미지와 내용 */}
            <div className={styles.imgBox}>
                <img src={commentData.MEMBER_AVATAR} alt="profile" />
            </div>
            <div className={styles.commentBox}>
                <div className={styles.commentName}>{commentData.NICKNAME}</div>
                <div className={styles.commentTxt}>
                    {isEditing ? (
                        <textarea
                            value={editedComment}
                            className={styles.editInput}
                            onChange={e => {
                                if (e.target.value.length <= 300)
                                    setEditedComment(e.target.value)
                            }}
                            onInput={e => {
                                e.target.style.height = 'auto' // 높이를 자동으로 설정하여 이전 설정을 초기화
                                e.target.style.height = `${Math.min(
                                    e.target.scrollHeight,
                                    72
                                )}px` // 내용에 따라 높이를 조정, 최대 72px로 제한
                            }}
                        />
                    ) : (
                        commentData.COMMENT_CONTENTS
                    )}
                </div>
                <div className={styles.btnBox}>
                    <div className={styles.btnLeft}>
                        <div className={styles.commentDate}>
                            {commentData?.COMMENT_WRITE_DATE
                                ? formatDate(commentData.COMMENT_WRITE_DATE)
                                : '알 수 없음'}
                        </div>
                        {/* 좋아요, 신고, 수정, 삭제 등 공통 액션 */}
                        <div className={styles.btnLike} onClick={handleLike}>
                            <i
                                className={
                                    isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                }
                            ></i>
                            <span className={styles.likeCount}>
                                {likeCount}
                            </span>
                        </div>
                        <div className={styles.btnReply}>답글 달기</div>
                        {isOwner ? (
                            <>
                                {isEditing ? (
                                    <>
                                        <div
                                            className={styles.btnSave}
                                            onClick={handleSaveEdit}
                                        >
                                            <i className="bx bx-save"></i>
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
                                            <i className="bx bx-edit"></i>
                                        </div>
                                        <div
                                            className={styles.btnDelete}
                                            onClick={handleDelete}
                                        >
                                            <i className="bx bx-trash"></i>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className={styles.reportComment}
                        onClick={() =>
                            handleOpenReportModalForComment(
                                commentData.COMMENT_SEQ
                            )
                        }
                    >
                        <PiSiren />
                        신고하기
                    </div>
                </div>
            </div>

            {/* 답글일 경우에는 약간의 스타일 변화 */}
            {isReply && <div style={{ paddingLeft: '20px' }}>답글입니다.</div>}
        </div>
    )
}
