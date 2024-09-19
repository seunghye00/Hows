import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import {
    getReportedComments,
    getCommentReport,
    deleteCmt,
} from '../../../api/comment'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import styles from './Comment.module.css'
import { formatDate } from '../../../commons/commons'

export const Comment = () => {
    const [comments, setComments] = useState([])
    const [totalComments, setTotalComments] = useState(0)
    const [page, setPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedComment, setSelectedComment] = useState(null)
    const [commentReports, setCommentReports] = useState([])
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([])

    // startRow, endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    useEffect(() => {
        fetchReportedComments()
    }, [page])

    const fetchReportedComments = async () => {
        try {
            const { comments, totalCount } = await getReportedComments(
                startRow,
                endRow
            )

            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}`
            )
            console.log('신고된 댓글 목록:', comments)
            setComments(comments)
            setTotalComments(totalCount)
        } catch (error) {
            console.error('신고 댓글 목록 불러오기 중 오류 발생:', error)
        }
    }

    // 신고된 댓글 내용 모달 열기
    const handleOpenCommentModal = comment => {
        console.log('선택된 댓글:', comment)
        setSelectedComment(comment)
        setIsCommentModalOpen(true)
    }

    // 신고된 댓글 신고내역 모달 열기
    const handleOpenReportModal = async comment_seq => {
        try {
            const reports = await getCommentReport(comment_seq)
            console.log('신고 내역:', reports)
            setCommentReports(reports)
            setIsReportModalOpen(true)
        } catch (error) {
            console.error('신고 내역 불러오기 중 오류 발생:', error)
        }
    }

    // 댓글 삭제 (SweetAlert 적용)
    const handleDeleteComment = async comment_seq => {
        const result = await Swal.fire({
            title: '댓글을 삭제하시겠습니까?',
            text: '삭제 후 복구할 수 없습니다!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        })

        if (result.isConfirmed) {
            try {
                await deleteCmt(comment_seq)
                Swal.fire(
                    '삭제 완료',
                    '댓글이 성공적으로 삭제되었습니다.',
                    'success'
                )
                fetchReportedComments() // 댓글 삭제 후 목록 갱신
            } catch (error) {
                Swal.fire(
                    '삭제 실패',
                    '댓글 삭제 중 오류가 발생했습니다.',
                    'error'
                )
                console.error('댓글 삭제 중 오류 발생:', error)
            }
        }
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = comments.filter(
            comment =>
                comment.BOARD_CONTENTS.includes(query) ||
                comment.NICKNAME.includes(query)
        )
        setSearchResults(results)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayComments = searchResults.length > 0 ? searchResults : comments

    return (
        <div className={styles.commentContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="게시글 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.commentlist}>
                <div className={styles.commentHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>게시글</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성일시</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayComments.length > 0 ? (
                    displayComments.map((comment, index) => (
                        <div className={styles.commentRow} key={index}>
                            <div className={styles.commentItem}>
                                {startRow + index}
                            </div>
                            <div
                                className={styles.commentItem}
                                onClick={() => handleOpenCommentModal(comment)}
                            >
                                <span className={styles.span}>
                                    {comment.BOARD_CONTENTS}
                                </span>
                            </div>
                            <div className={styles.commentItem}>
                                {comment.NICKNAME}
                            </div>
                            <div className={styles.commentItem}>
                                {formatDate(comment.WRITE_DATE)}
                            </div>

                            <div
                                className={styles.commentItem}
                                onClick={() =>
                                    handleOpenReportModal(comment.COMMENT_SEQ)
                                }
                            >
                                <span className={styles.reportcount}>
                                    {comment.REPORT_COUNT}
                                </span>
                            </div>
                            <div className={styles.commentItem}>
                                <Button
                                    size="s"
                                    title="삭제"
                                    onClick={() =>
                                        handleDeleteComment(comment.COMMENT_SEQ)
                                    }
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        신고 댓글 목록이 없습니다
                    </div>
                )}
            </div>

            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalComments}
                    perpage={itemsPerPage}
                    setPage={setPage}
                />
            </div>

            {isCommentModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>신고된 댓글 상세 조회</h3>
                        {selectedComment ? (
                            <div className={styles.replortcmt}>
                                <textarea
                                    readOnly
                                    value={selectedComment.COMMENT_CONTENTS}
                                    className={styles.textarea}
                                />
                            </div>
                        ) : (
                            <p>댓글이 없습니다.</p>
                        )}
                        <Button
                            size="s"
                            title="닫기"
                            onClick={() => setIsCommentModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {isReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>댓글 신고 내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 일시</div>
                            </div>
                            {commentReports.map(report => (
                                <div
                                    className={styles.tableRow}
                                    key={report.comment_report_seq}
                                >
                                    <div>{report.member_id}</div>
                                    <div>{report.report_code}</div>
                                    <div>
                                        {formatDate(report.comment_report_date)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            size="s"
                            title="닫기"
                            onClick={() => setIsReportModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Comment
