import React from 'react'
import Swal from 'sweetalert2'
import { PiSiren } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import styles from './PostActions.module.css'

export const PostActions = ({
    isLiked,
    likeCount,
    toggleLikeHandler,
    isBookmarked,
    bookmarkCount,
    toggleBookmarkHandler,
    viewCount,
    copyLinkToClipboard,
    handleOpenReportModal,
    isOwner,
}) => {
    return (
        <div className={styles.postActions}>
            <div className={styles.likesViewBook}>
                <div onClick={toggleLikeHandler}>
                    <i className={isLiked ? 'bx bxs-heart' : 'bx bx-heart'}></i>
                    {likeCount}
                </div>
                <div onClick={toggleBookmarkHandler}>
                    <i
                        className={
                            isBookmarked ? 'bx bxs-bookmark' : 'bx bx-bookmark'
                        }
                    ></i>
                    {bookmarkCount}
                </div>
                <div>
                    <i className="bx bx-show"></i>
                    {viewCount}
                </div>
            </div>
            <div className={styles.subMitLink}>
                <div className={styles.Link} onClick={copyLinkToClipboard}>
                    <i className="bx bx-link"></i>
                </div>
                {!isOwner ? (
                    <div onClick={handleOpenReportModal}>
                        <PiSiren />
                        신고하기
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}
