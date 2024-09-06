import React, { useState } from 'react'
import styles from './Review.module.css'
import test from '../../../assets/images/푸바오.png'

export const Review = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState({})

    // 신고당한 리뷰 데이터 (임시)
    const reviewData = {
        image: 'https://via.placeholder.com/150', // 임시 이미지 URL
        text: '이것은 신고당한 리뷰입니다. 매우 불쾌한 리뷰였어요.',
    }

    // 신고 내역 임시 데이터
    const reportData = {
        reporter: '서갈',
        reason: '과도한 욕설',
        date: '2024-09-05',
    }

    // 리뷰 클릭 시 (상품 제목 클릭 시) 모달 열기
    const selectReview = () => {
        setSelectedReview(reviewData) // 선택한 리뷰 데이터 설정
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

    return (
        <div className={styles.reviewContainer}>
            <div className={styles.headerSection}>
                <h2>Review</h2>
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

            <div className={styles.reviewlist}>
                <div className={styles.reviewHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>상품 제목</div>
                    <div className={styles.headerItem}>리뷰 작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                <div className={styles.reviewRow}>
                    <div className={styles.reviewItem}>1</div>
                    {/* 상품 제목 클릭 시 리뷰 모달 열기 */}
                    <div className={styles.reviewItem} onClick={selectReview}>
                        <span className={styles.span}>이것은 게시판!</span>
                    </div>
                    <div className={styles.reviewItem}>민바오</div>
                    <div className={styles.reviewItem}>2024-08-31</div>

                    {/* 누적 신고 횟수 클릭 시 신고 내역 모달 열기 */}
                    <div className={styles.reviewItem} onClick={selectReport}>
                        <span className={styles.reportcount}>1</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <button className={styles.deletebtn}>삭제</button>
                    </div>
                </div>
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
                            <img src={test} alt="프로필 이미지" />
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
