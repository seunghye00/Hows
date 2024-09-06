import React, { useState } from 'react'
import styles from './Reply.module.css'
import { GoTriangleDown } from 'react-icons/go'

export const Reply = () => {
    const [commentReportModalOpen, setCommentReportModalOpen] = useState(false)
    const [specificCommentModalOpen, setSpecificCommentModalOpen] =
        useState(false)
    const [selectedReply, setSelectedReply] = useState(null)

    // 신고당한 댓글 임시 데이터
    const reportedComments = [
        {
            id: 1,
            parentComment: {
                commenter: '김철수',
                content: '이것은 부모 댓글입니다.',
                date: '2024-08-25',
            },
            replyCommenter: '민바오',
            date: '2024-08-31',
            reportCount: 1,
            content: '이것은 신고당한 대댓글~ 이랍니다~~',
        },
        {
            id: 2,
            parentComment: {
                commenter: '이영희',
                content: '다른 부모 댓글입니다.',
                date: '2024-08-26',
            },
            replyCommenter: '홍길동',
            date: '2024-08-30',
            reportCount: 2,
            content: '또 다른 신고당한 대댓글~',
        },
    ]

    // 첫 번째 모달: 특정 대댓글 조회
    const openSpecificReplyModal = id => {
        const reply = reportedComments.find(rpl => rpl.id === id)
        setSelectedReply(reply)
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
        <div className={styles.replyContainer}>
            <div className={styles.headerSection}>
                <h2>Reply</h2>
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

            <div className={styles.replylist}>
                <div className={styles.replyHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {reportedComments.map((reply, index) => (
                    <div className={styles.replyRow} key={reply.id}>
                        <div className={styles.replyItem}>{index + 1}</div>
                        <div
                            className={styles.replyItem}
                            onClick={() => openSpecificReplyModal(reply.id)}
                        >
                            <span className={styles.span}>{reply.content}</span>
                        </div>
                        <div className={styles.replyItem}>
                            {reply.replyCommenter}
                        </div>
                        <div className={styles.replyItem}>{reply.date}</div>

                        <div
                            className={styles.replyItem}
                            onClick={openReportModal}
                        >
                            <span className={styles.reportcount}>
                                {reply.reportCount}
                            </span>
                        </div>
                        <div className={styles.replyItem}>
                            <button className={styles.deletebtn}>삭제</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 특정 대댓글 및 부모 댓글 조회 모달 */}
            {specificCommentModalOpen && selectedReply && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>신고된 댓글 상세조회</h3>
                        <div className={styles.replortcmt}>
                            {/* 부모 댓글 표시 */}
                            <textarea
                                readOnly
                                value={selectedReply.parentComment.content}
                                className={styles.textarea}
                                placeholder="부모 댓글"
                            />
                        </div>
                        {/* 화살표 아이콘 */}
                        <GoTriangleDown className={styles.chevronIcon} />
                        <div className={styles.replortcmt}>
                            {/* 대댓글 표시 */}
                            <textarea
                                readOnly
                                value={selectedReply.content}
                                className={styles.textarea}
                                placeholder="대댓글"
                            />
                        </div>
                        <button className={styles.btn} onClick={closeModals}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 신고 내역 모달 */}
            {commentReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>대댓글 신고내역</h3>
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
