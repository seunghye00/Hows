import React, { useState } from 'react'
import styles from './Comment.module.css'

export const Comment = () => {
    const [commentReportModalOpen, setCommentReportModalOpen] = useState(false)
    const [specificCommentModalOpen, setSpecificCommentModalOpen] =
        useState(false)
    const [selectedComment, setSelectedComment] = useState(null)

    // 신고당한 댓글 임시 데이터
    const reportedComments = [
        {
            id: 1,
            boardTitle: '이것은 게시판!',
            commenter: '민바오',
            date: '2024-08-31',
            reportCount: 1,
            content: '이것은 신고당한 댓글~ 이랍니다~~',
        },
        {
            id: 2,
            boardTitle: '이것은 게시판!',
            commenter: '홍길동',
            date: '2024-08-30',
            reportCount: 2,
            content: '또 다른 신고당한 댓글~',
        },
    ]

    // 첫 번째 모달: 특정 댓글 조회
    const openSpecificCommentModal = boardTitle => {
        const comment = reportedComments.find(
            cmt => cmt.boardTitle === boardTitle
        )
        setSelectedComment(comment)
        setSpecificCommentModalOpen(true)
    }

    // 두 번째 모달: 신고 내역 모달
    const openReportModal = () => {
        setCommentReportModalOpen(true)
    }

    // 모달 닫기
    const closeModals = () => {
        setCommentReportModalOpen(false)
        setSpecificCommentModalOpen(false)
    }

    return (
        <div className={styles.commentContainer}>
            <div className={styles.headerSection}>
                <h2>Comment</h2>
            </div>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <select>
                        <option>제목</option>
                        <option>작성자</option>
                    </select>
                    <input type="text" placeholder="검색" />
                    <button>검색</button>
                </div>
            </div>

            <div className={styles.commentlist}>
                <div className={styles.commentHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>댓글 작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                <div className={styles.commentRow}>
                    <div className={styles.commentItem}>1</div>
                    <div
                        className={styles.commentItem}
                        onClick={() =>
                            openSpecificCommentModal('이것은 게시판!')
                        }
                    >
                        <span className={styles.span}>이것은 게시판!</span>
                    </div>
                    <div className={styles.commentItem}>민바오</div>
                    <div className={styles.commentItem}>2024-08-31</div>

                    <div
                        className={styles.commentItem}
                        onClick={openReportModal}
                    >
                        <span className={styles.reportcount}>1</span>
                    </div>
                    <div className={styles.commentItem}>
                        <button className={styles.deletebtn}>삭제</button>
                    </div>
                </div>
            </div>

            {specificCommentModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>신고된 댓글 상세조회</h3>
                        {selectedComment ? (
                            <div className={styles.replortcmt}>
                                <textarea
                                    readOnly
                                    value={selectedComment.content}
                                    className={styles.textarea}
                                />
                            </div>
                        ) : (
                            <p>댓글이 없습니다.</p>
                        )}
                        <button className={styles.btn} onClick={closeModals}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {commentReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>댓글 신고내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 날짜</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div>서갈</div>
                                <div>과도한 욕설</div>
                                <div>2024-09-05</div>
                            </div>
                        </div>
                        <button className={styles.btn} onClick={closeModals}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.pagination}>
                <i className="bx bx-chevron-left"></i>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <i className="bx bx-chevron-right"></i>
            </div>
        </div>
    )
}
