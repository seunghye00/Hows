import React, { useState } from 'react'
import styles from './Notice.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import test from '../../../assets/images/푸바오.png'

export const Notice = () => {
    const [searchResults, setSearchResults] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedNotice, setSelectedNotice] = useState(null)

    // 공지사항 데이터 (임시 데이터)
    const notices = [
        {
            id: 1,
            title: '공지사항 입니다~',
            writer: '관리자',
            date: '2024-08-31',
            viewCount: 5,
            content:
                '이게 공지사항 이라고?\n이게....공지사항 인가?\n아니 이게 공지사항 일수가 있어?\n이거 공지사항이 맞지?\n이딴게 공지사항?\n이건 공지사항이 아닌거 같은데?',
        },
        {
            id: 2,
            title: '다른 공지사항',
            writer: '홍길동',
            date: '2024-09-01',
            viewCount: 5,
            content: '이것은 다른 공지사항의 내용입니다.',
        },
        // 더 많은 공지사항 데이터 추가
    ]

    // 공지사항 제목 클릭 시 모달 열기
    const openModal = notice => {
        setSelectedNotice(notice)
        setIsModalOpen(true)
    }

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedNotice(null)
    }

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
                    <Button size="s" title="등록하기" />
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
                            <span
                                className={styles.span}
                                onClick={() => openModal(notice)}
                            >
                                {notice.title}
                            </span>
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
            </div>

            {isModalOpen && selectedNotice && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.headerSection}>
                            <div className={styles.titleView}>
                                <h3>{selectedNotice.title}</h3>
                                <span>조회수 : {selectedNotice.viewCount}</span>
                            </div>
                            <div className={styles.writerDate}>
                                <span>작성자 : {selectedNotice.writer}</span>
                                <span>작성날짜 : {selectedNotice.date}</span>
                            </div>
                        </div>
                        <hr />
                        <div className={styles.modalBody}>
                            <div className={styles.contentContainer}>
                                <img
                                    src={test}
                                    alt="첨부된 이미지"
                                    className={styles.image}
                                />
                                <div>{selectedNotice.content}</div>
                            </div>
                        </div>
                        <div className={styles.btn}>
                            <Button
                                size="s"
                                title="닫기"
                                onClick={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.pagination}>
                <Paging />
            </div>
        </div>
    )
}

export default Notice
