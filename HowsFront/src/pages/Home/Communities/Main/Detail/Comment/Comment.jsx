import React from 'react'
import styles from './Comment.module.css'
import { PiSiren } from 'react-icons/pi'
export const Comment = ({
    commentData,
    onLike,
    onEdit,
    onDelete,
    onReport,
    isReply = false, // 답글 여부
    handleOpenReportModal,
}) => {
    return (
        <div className={styles.commentCont}>
            {/* 댓글 또는 답글의 프로필 이미지와 내용 */}
            <div className={styles.imgBox}>
                <img src={commentData.MEMBER_AVATAR} alt="profile" />
            </div>
            <div className={styles.commentBox}>
                <div className={styles.commentName}>{commentData.NICKNAME}</div>
                <div className={styles.commentTxt}>
                    {commentData.COMMENT_CONTENTS}
                </div>
                <div className={styles.btnBox}>
                    <div className={styles.btnRight}>
                        {/* 좋아요, 신고, 수정, 삭제 등 공통 액션 */}
                        <div className={styles.btnLike}>
                            <i className="bx bx-heart"></i>
                            {commentData.LIKE_COUNT}
                        </div>
                        <div className={styles.btnEdit}>
                            <i className="bx bx-edit"></i>
                        </div>
                        <div className={styles.btnDelete}>
                            <i class="bx bx-trash"></i>
                        </div>
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
