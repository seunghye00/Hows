import React, { useState, useEffect } from 'react'
import styles from './Reply.module.css'
import { GoTriangleDown } from 'react-icons/go'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import Swal from 'sweetalert2'
import {
    getReportedReplys,
    getReplyReport,
    deleteReply,
} from '../../../api/comment'
import { formatDate } from '../../../commons/commons'

export const Reply = () => {
    const [replys, setReplys] = useState([]) // 서버에서 가져올 대댓글 목록
    const [totalReplys, setTotalReplys] = useState(0) // 전체 대댓글 수
    const [page, setPage] = useState(1) // 페이지 정보
    const [itemsPerPage] = useState(10) // 한 페이지 당 항목 수
    const [selectedReply, setSelectedReply] = useState(null) // 선택한 대댓글
    const [replyReports, setReplyReports] = useState([]) // 대댓글 신고 내역
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false) // 대댓글 모달
    const [isReportModalOpen, setIsReportModalOpen] = useState(false) // 신고 내역 모달
    const [searchResults, setSearchResults] = useState([]) // 검색 결과

    // startRow, endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    useEffect(() => {
        fetchReportedReplys() // 페이지 변경될 때마다 대댓글 목록 가져오기
    }, [page])

    // 서버에서 대댓글 목록 가져오기
    const fetchReportedReplys = async () => {
        try {
            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}`
            )
            const { replys, totalCount } = await getReportedReplys(
                startRow,
                endRow
            ) // 서버 API 호출
            console.log('신고된 대댓글 목록:', replys)
            setReplys(replys)
            setTotalReplys(totalCount)
        } catch (error) {
            console.error('신고 대댓글 목록 불러오기 중 오류 발생:', error)
        }
    }

    // 특정 대댓글 내용 모달 열기
    const handleOpenReplyModal = reply => {
        console.log('선택된 대댓글:', reply)
        setSelectedReply(reply)
        setIsReplyModalOpen(true)
    }

    // 대댓글 신고 내역 모달 열기
    const handleOpenReportModal = async reply_seq => {
        try {
            const reports = await getReplyReport(reply_seq) // 서버 API 호출
            console.log('대댓글 신고 내역:', reports)
            setReplyReports(reports)
            setIsReportModalOpen(true)
        } catch (error) {
            console.error('신고 내역 불러오기 중 오류 발생:', error)
        }
    }

    // 대댓글 삭제
    const handleDeleteReply = async reply_seq => {
        Swal.fire({
            title: '대댓글 삭제',
            text: '정말로 이 대댓글을 삭제 하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteReply(reply_seq) // 서버 API 호출
                    console.log('대댓글 삭제 완료:', reply_seq)
                    fetchReportedReplys() // 삭제 후 목록 갱신

                    Swal.fire(
                        '삭제 완료!',
                        '대댓글이 성공적으로 삭제되었습니다.',
                        'success'
                    )
                } catch (error) {
                    console.error('대댓글 삭제 중 오류 발생:', error)
                    Swal.fire(
                        '삭제 실패!',
                        '대댓글 삭제 중 문제가 발생했습니다.',
                        'error'
                    )
                }
            }
        })
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = replys.filter(
            reply =>
                reply.BOARD_CONTENTS.includes(query) ||
                reply.NICKNAME.includes(query)
        )
        setSearchResults(results)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayReplys = searchResults.length > 0 ? searchResults : replys

    return (
        <div className={styles.replyContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="게시글 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.replylist}>
                <div className={styles.replyHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>게시글</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성일시</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayReplys.length > 0 ? (
                    displayReplys.map((reply, index) => (
                        <div
                            className={styles.replyRow}
                            key={reply.reply_seq || index}
                        >
                            <div className={styles.replyItem}>
                                {startRow + index}
                            </div>
                            <div
                                className={styles.replyItem}
                                onClick={() => handleOpenReplyModal(reply)}
                            >
                                <span className={styles.span}>
                                    {reply.BOARD_CONTENTS}
                                </span>
                            </div>
                            <div className={styles.replyItem}>
                                {reply.NICKNAME}
                            </div>
                            <div className={styles.replyItem}>
                                {formatDate(reply.WRITE_DATE)}
                            </div>

                            <div
                                className={styles.replyItem}
                                onClick={() =>
                                    handleOpenReportModal(reply.REPLY_SEQ)
                                }
                            >
                                <span className={styles.reportcount}>
                                    {reply.REPORT_COUNT}
                                </span>
                            </div>
                            <div className={styles.replyItem}>
                                <Button
                                    size="s"
                                    title="삭제"
                                    onClick={() =>
                                        handleDeleteReply(reply.REPLY_SEQ)
                                    }
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        신고 대댓글 목록이 없습니다
                    </div>
                )}
            </div>

            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalReplys}
                    perpage={itemsPerPage}
                    setPage={setPage}
                />
            </div>

            {isReplyModalOpen && selectedReply && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>신고된 대댓글 상세 조회</h3>
                        <div className={styles.replortcmt}>
                            <textarea
                                readOnly
                                value={selectedReply.PARENT_COMMENT_CONTENTS}
                                className={styles.textarea}
                            />
                        </div>
                        <GoTriangleDown className={styles.chevronIcon} />
                        <div className={styles.replortcmt}>
                            <textarea
                                readOnly
                                value={selectedReply.REPORTED_REPLY_CONTENTS}
                                className={styles.textarea}
                            />
                        </div>
                        <Button
                            size="s"
                            title="닫기"
                            onClick={() => setIsReplyModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {isReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>대댓글 신고내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 일시</div>
                            </div>
                            {replyReports.map(report => (
                                <div
                                    className={styles.tableRow}
                                    key={report.reply_report_seq}
                                >
                                    <div>{report.member_id}</div>
                                    <div>{report.report_code}</div>
                                    <div>
                                        {formatDate(report.reply_report_date)}
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

export default Reply
