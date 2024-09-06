import React, { useState } from 'react'
import styles from './Board.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'

export const Board = () => {
    const [boardReportModalOpen, setBoardReportModalOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 상태

    // 신고 내역 임시 데이터 (배열로 변환하여 확장 가능)
    const reportData = [
        {
            reporter: '서갈',
            reason: '과도한 욕설',
            date: '2024-09-05',
        },
        {
            reporter: '홍길동',
            reason: '스팸 및 광고',
            date: '2024-09-01',
        },
    ]

    // 게시글 목록 임시 데이터
    const boardData = [
        {
            no: 1,
            title: '이것은 게시판!',
            writer: '민바오',
            date: '2024-08-31',
            reportCount: 1,
        },
        {
            no: 2,
            title: '두 번째 게시글',
            writer: '홍길동',
            date: '2024-09-01',
            reportCount: 2,
        },
    ]

    // 신고 모달 열기
    const selectreport = () => {
        setBoardReportModalOpen(true)
    }

    // 신고 모달 닫기
    const closeReportModal = () => {
        setBoardReportModalOpen(false)
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = boardData.filter(
            post => post.title.includes(query) || post.writer.includes(query)
        )
        setSearchResults(results) // 검색 결과 업데이트
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayBoard = searchResults.length > 0 ? searchResults : boardData

    return (
        <div className={styles.boardContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="제목 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.boardlist}>
                <div className={styles.boardHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayBoard.map((post, index) => (
                    <div className={styles.boardRow} key={index}>
                        <div className={styles.boardItem}>{post.no}</div>
                        <div className={styles.boardItem}>
                            <span className={styles.span}>{post.title}</span>
                        </div>
                        <div className={styles.boardItem}>{post.writer}</div>
                        <div className={styles.boardItem}>{post.date}</div>

                        <div
                            className={styles.boardItem}
                            onClick={selectreport}
                        >
                            <span className={styles.reportcount}>
                                {post.reportCount}
                            </span>
                        </div>
                        <div className={styles.boardItem}>
                            <Button size="s" title="삭제" />
                        </div>
                    </div>
                ))}
            </div>
            {/* 신고 모달창 */}
            {boardReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>게시판 신고내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 날짜</div>
                            </div>
                            {reportData.map((report, index) => (
                                <div className={styles.tableRow} key={index}>
                                    <div>{report.reporter}</div>
                                    <div>{report.reason}</div>
                                    <div>{report.date}</div>
                                </div>
                            ))}
                        </div>
                        <Button
                            size="s"
                            title="닫기"
                            onClick={closeReportModal}
                        />
                    </div>
                </div>
            )}
            <div className={styles.pagination}>
                <Paging />
            </div>
        </div>
    )
}

export default Board
