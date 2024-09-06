import React, { useState } from 'react'
import styles from './Review.module.css'
import test from '../../../assets/images/푸바오.png'
import { Search } from '../../../components/Search/Search'

export const Review = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState({})
    const [searchResults, setSearchResults] = useState([])

    // 신고당한 리뷰 데이터 (임시)
    const reviews = [
        {
            id: 1,
            productTitle: '이것은 상품!',
            reviewer: '민바오',
            date: '2024-08-31',
            reportCount: 1,
            text: '이것은 신고당한 리뷰입니다. 매우 불쾌한 리뷰였어요.',
        },
        {
            id: 2,
            productTitle: '다른 상품!',
            reviewer: '홍길동',
            date: '2024-09-01',
            reportCount: 2,
            text: '이 리뷰도 신고당했습니다.',
        },
    ]

    // 신고 내역 임시 데이터
    const reportData = {
        reporter: '서갈',
        reason: '과도한 욕설',
        date: '2024-09-05',
    }

    // 리뷰 클릭 시 (상품 제목 클릭 시) 모달 열기
    const selectReview = review => {
        setSelectedReview(review) // 선택한 리뷰 데이터 설정
        setIsReviewModalOpen(true) // 리뷰 모달 열기
    }

    // 신고 내역 클릭 시 (누적 신고 횟수 클릭 시) 모달 열기
    const selectReport = () => {
        setIsReportModalOpen(true) // 신고 모달 열기
    }

    // 모달 닫기
    const closeReviewModal = () => {
        setIsReviewModalOpen(false) // 리뷰 모달 닫기
    }

    const closeReportModal = () => {
        setIsReportModalOpen(false) // 신고 모달 닫기
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = reviews.filter(
            review =>
                review.productTitle.includes(query) ||
                review.reviewer.includes(query)
        )
        setSearchResults(results)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayReviews = searchResults.length > 0 ? searchResults : reviews

    return (
        <div className={styles.reviewContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="상품 제목 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.reviewlist}>
                <div className={styles.reviewHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>상품 제목</div>
                    <div className={styles.headerItem}>리뷰 작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayReviews.map((review, index) => (
                    <div className={styles.reviewRow} key={review.id}>
                        <div className={styles.reviewItem}>{index + 1}</div>
                        {/* 상품 제목 클릭 시 리뷰 모달 열기 */}
                        <div
                            className={styles.reviewItem}
                            onClick={() => selectReview(review)}
                        >
                            <span className={styles.span}>
                                {review.productTitle}
                            </span>
                        </div>
                        <div className={styles.reviewItem}>
                            {review.reviewer}
                        </div>
                        <div className={styles.reviewItem}>{review.date}</div>

                        {/* 누적 신고 횟수 클릭 시 신고 내역 모달 열기 */}
                        <div
                            className={styles.reviewItem}
                            onClick={selectReport}
                        >
                            <span className={styles.reportcount}>
                                {review.reportCount}
                            </span>
                        </div>
                        <div className={styles.reviewItem}>
                            <button className={styles.deletebtn}>삭제</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <i className="bx bx-chevron-left"></i>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <i className="bx bx-chevron-right"></i>
            </div>

            {/* 리뷰 모달창 */}
            {isReviewModalOpen && (
                <div className={styles.reviewModal}>
                    <div className={styles.modalContent}>
                        <h3>신고당한 리뷰</h3>
                        <div className={styles.reviewDetail}>
                            <img src={test} alt="리뷰 이미지" />
                            <div>{selectedReview.text}</div>
                        </div>
                        <button
                            className={styles.btn}
                            onClick={closeReviewModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 신고 내역 모달창 */}
            {isReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>리뷰 신고내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 날짜</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div>{reportData.reporter}</div>
                                <div>{reportData.reason}</div>
                                <div>{reportData.date}</div>
                            </div>
                        </div>
                        <button
                            className={styles.btn}
                            onClick={closeReportModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Review
