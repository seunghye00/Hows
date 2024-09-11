import React, { useState, useEffect } from 'react'
import styles from './Review.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import { reportedReviews, reviewReport } from '../../../api/product'
import { formatDate } from '../../../commons/commons'

export const Review = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState({})
    const [searchResults, setSearchResults] = useState([])
    const [reviews, setReviews] = useState([]) // 서버에서 불러온 신고 리뷰 목록
    const [reportData, setReportData] = useState([]) // 신고 내역 데이터

    // 신고당한 리뷰 목록을 서버에서 가져오는 함수
    useEffect(() => {
        loadReportedReviews()
    }, [])

    const loadReportedReviews = async () => {
        try {
            const resp = await reportedReviews()
            console.log(resp.data)
            setReviews(resp.data) // 서버에서 받은 리뷰 목록을 상태에 저장
        } catch (error) {
            console.error('리뷰 목록을 불러오는데 실패했습니다.', error)
        }
    }

    // 특정 리뷰에 대한 신고 내역을 서버에서 가져오는 함수
    const loadReviewReport = async review_seq => {
        try {
            const resp = await reviewReport(review_seq)
            console.log(resp.data)
            setReportData(resp.data) // 서버에서 받은 신고 내역을 상태에 저장
        } catch (error) {
            console.error('신고 내역을 불러오는데 실패했습니다.', error)
        }
    }

    // 리뷰 클릭 시 (상품 제목 클릭 시) 모달 열기
    const selectReview = review => {
        setSelectedReview(review) // 선택한 리뷰 데이터 설정
        setIsReviewModalOpen(true) // 리뷰 모달 열기
    }

    // 신고 내역 클릭 시 (누적 신고 횟수 클릭 시) 모달 열기
    const selectReport = review_seq => {
        loadReviewReport(review_seq) // 신고 내역 로드
        setIsReportModalOpen(true) // 신고 모달 열기
    }

    // 모달 닫기
    const closeReviewModal = () => setIsReviewModalOpen(false)
    const closeReportModal = () => setIsReportModalOpen(false)

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
                    <div className={styles.reviewRow} key={review.review_seq}>
                        <div className={styles.reviewItem}>{index + 1}</div>
                        <div
                            className={styles.reviewItem}
                            onClick={() => selectReview(review)}
                        >
                            <span className={styles.span}>
                                {review.PRODUCT_TITLE}
                            </span>
                        </div>
                        <div className={styles.reviewItem}>
                            {review.NICKNAME}
                        </div>
                        <div className={styles.reviewItem}>
                            {formatDate(review.REVIEW_DATE)}
                        </div>
                        <div
                            className={styles.reviewItem}
                            onClick={() => selectReport(review.review_seq)}
                        >
                            <span className={styles.reportcount}>
                                {review.REPORT_COUNT}
                            </span>
                        </div>
                        <div className={styles.reviewItem}>
                            <Button size="s" title="삭제" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 리뷰 모달창 */}
            {isReviewModalOpen && (
                <div className={styles.reviewModal}>
                    <div className={styles.modalContent}>
                        <h3>신고당한 리뷰</h3>
                        <div className={styles.reviewDetail}>
                            <img
                                src={selectedReview.imageUrl || test}
                                alt="리뷰 이미지"
                            />
                            <div>{selectedReview.text}</div>
                        </div>
                        <Button
                            size="s"
                            title="닫기"
                            onClick={closeReviewModal}
                        />
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
                            {reportData.map((report, index) => (
                                <div key={index} className={styles.tableRow}>
                                    <div>{report.member_id}</div>
                                    <div>{report.report_code}</div>
                                    <div>{report.review_report_date}</div>
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

export default Review
