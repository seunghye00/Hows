import styles from "./Qna.module.css"
import { Search } from './../../../../../components/Search/Search';
import React, { useState } from 'react'
import { Button } from './../../../../../components/Button/Button';

export const Qna = () => {

    const [searchResults, setSearchResults] = useState([]) // 검색 결과 상태

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
        <div className={styles.container}>
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
                        // onClick={selectreport}
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
        </div>
    )
}