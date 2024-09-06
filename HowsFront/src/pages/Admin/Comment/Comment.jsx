import React, { useState } from 'react'
import styles from './Comment.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'

export const Comment = () => {
    const [commentReportModalOpen, setCommentReportModalOpen] = useState(false)
    const [specificCommentModalOpen, setSpecificCommentModalOpen] =
        useState(false)
    const [selectedComment, setSelectedComment] = useState(null)
    const [searchResults, setSearchResults] = useState([])

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

    // 검색 기능 구현
    const handleSearch = query => {
        const results = reportedComments.filter(
            comment =>
                comment.boardTitle.includes(query) ||
                comment.commenter.includes(query)
        )
        setSearchResults(results)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayComments =
        searchResults.length > 0 ? searchResults : reportedComments

    return (
        <div className={styles.commentContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    {/* 기존 검색 UI를 Search 컴포넌트로 대체 */}
                    <Search
                        placeholder="제목 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.commentlist}>
                <div className={styles.commentHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayComments.map((comment, index) => (
                    <div className={styles.commentRow} key={index}>
                        <div className={styles.commentItem}>{comment.id}</div>
                        <div
                            className={styles.commentItem}
                            onClick={() =>
                                openSpecificCommentModal(comment.boardTitle)
                            }
                        >
                            <span className={styles.span}>
                                {comment.boardTitle}
                            </span>
                        </div>
                        <div className={styles.commentItem}>
                            {comment.commenter}
                        </div>
                        <div className={styles.commentItem}>{comment.date}</div>

                        <div
                            className={styles.commentItem}
                            onClick={openReportModal}
                        >
                            <span className={styles.reportcount}>
                                {comment.reportCount}
                            </span>
                        </div>
                        <div className={styles.commentItem}>
                            <Button size="s" title="삭제" />
                        </div>
                    </div>
                ))}
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
                        <Button size="s" title="닫기" onClick={closeModals} />
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
                        <Button size="s" title="닫기" onClick={closeModals} />
                    </div>
                </div>
            )}

            <div className={styles.pagination}>
                <Paging />
            </div>
        </div>
    )
}

export default Comment
