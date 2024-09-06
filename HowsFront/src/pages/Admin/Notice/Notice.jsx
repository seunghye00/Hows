import React, { useState } from 'react'
import styles from './Notice.module.css'
import { Search } from '../../../components/Search/Search'

export const Notice = () => {
    const [searchResults, setSearchResults] = useState([])

    // 공지사항 데이터 (임시 데이터)
    const notices = [
        {
            id: 1,
            title: '이것은 공지사항!',
            writer: '민바오',
            date: '2024-08-31',
            viewCount: 1,
        },
        {
            id: 2,
            title: '다른 공지사항',
            writer: '홍길동',
            date: '2024-09-01',
            viewCount: 5,
        },
    ]

    // 검색 기능 구현
    const handleSearch = query => {
        const results = notices.filter(
            notice =>
                notice.title.includes(query) || notice.writer.includes(query)
        )
        setSearchResults(results)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayNotices = searchResults.length > 0 ? searchResults : notices

    return (
        <div className={styles.noticeContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="제목 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.noticelist}>
                <div className={styles.noticeHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>조회수</div>
                </div>

                {displayNotices.map((notice, index) => (
                    <div className={styles.noticeRow} key={notice.id}>
                        <div className={styles.noticeItem}>{index + 1}</div>
                        <div className={styles.noticeItem}>
                            <span className={styles.span}>{notice.title}</span>
                        </div>
                        <div className={styles.noticeItem}>{notice.writer}</div>
                        <div className={styles.noticeItem}>{notice.date}</div>

                        <div className={styles.noticeItem}>
                            <span className={styles.viewcount}>
                                {notice.viewCount}
                            </span>
                        </div>
                    </div>
                ))}

                <div className={styles.addNtcSection}>
                    <button className={styles.addNtc}>등록</button>
                </div>
            </div>

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

export default Notice
