import React, { useState } from 'react'
import styles from './Comment.module.css'
import { PiSiren } from 'react-icons/pi'
import { useAuthStore } from '../../../../../../store/store'
export const Comment = ({
    commentData,
    onLike,
    onEdit,
    onDelete,
    onReport,
    isReply = false, // 답글 여부
    handleOpenReportModal,
    handleUpdateComment,
}) => {
    const { isAuth } = useAuthStore() // 로그인 여부
    const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
    const isOwner = isAuth && member_id === commentData?.MEMBER_ID
    const [isEditing, setIsEditing] = useState(false) // 수정 상태 관리
    const [editedComment, setEditedComment] = useState(
        commentData.COMMENT_CONTENTS
    ) // 수정된 댓글 내용

    // 수정 모드를 토글하는 함수
    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    // 댓글 수정 완료 함수
    const handleSaveEdit = () => {
        handleUpdateComment(commentData.COMMENT_SEQ, editedComment) // 수정된 댓글 서버에 업데이트
        setIsEditing(false) // 수정 모드 종료
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
                    <div className={styles.btnRight}>
                        {/* 좋아요, 신고, 수정, 삭제 등 공통 액션 */}
                        <div className={styles.btnLike} onClick={onLike}>
                            <i className="bx bx-heart"></i>
                            {commentData.LIKE_COUNT}
                        </div>
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
                                            onClick={onDelete}
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
                        onClick={handleOpenReportModal}
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
