import React, { useState, useEffect } from 'react'
import styles from './Review.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import Swal from 'sweetalert2'
import {
    reportedReviews,
    reviewReport,
    deleteReview,
} from '../../../api/product'
import { formatDate } from '../../../commons/commons'
import test from '../../../assets/images/푸바오.png'

export const Review = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState({})
    const [searchResults, setSearchResults] = useState([])
    const [reviews, setReviews] = useState([]) // 서버에서 불러온 신고 리뷰 목록
    const [reportData, setReportData] = useState([]) // 신고 내역 데이터
    const [totalReviews, setTotalReviews] = useState(0) // 전체 신고 리뷰 수
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [itemsPerPage] = useState(10) // 페이지당 항목 수

    // 페이징에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    // 신고당한 리뷰 목록을 서버에서 가져오는 함수
    useEffect(() => {
        loadReportedReviews()
    }, [page])

    const loadReportedReviews = async () => {
        try {
            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}, 페이지당 항목 수: ${itemsPerPage}`
            )

            // 페이징된 리뷰 목록을 가져옴
            const resp = await reportedReviews(startRow, endRow)

            // 콘솔에 서버에서 받은 데이터 출력
            console.log('서버에서 받은 데이터:', resp.data)

            setReviews(resp.data.reviews) // 서버에서 받은 리뷰 목록을 상태에 저장
            setTotalReviews(resp.data.totalCount) // 전체 리뷰 수 저장
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

    // 리뷰 삭제 핸들러 함수
    const handleDeleteReview = async review_seq => {
        Swal.fire({
            title: '리뷰 삭제',
            text: '정말로 이 리뷰를 삭제 하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    const resp = await deleteReview(review_seq)
                    if (resp.status === 200) {
                        Swal.fire({
                            title: '삭제 완료',
                            text: '리뷰가 성공적으로 삭제되었습니다.',
                            icon: 'success',
                        })
                        // 성공적으로 삭제된 경우 목록을 업데이트
                        setReviews(prevReviews =>
                            prevReviews.filter(
                                review => review.REVIEW_SEQ !== review_seq
                            )
                        )
                    } else {
                        Swal.fire({
                            title: '삭제 실패',
                            text: '리뷰 삭제에 실패했습니다.',
                            icon: 'error',
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: '오류 발생',
                        text: '리뷰 삭제 중 오류가 발생했습니다.',
                        icon: 'error',
                    })
                }
            }
        })
    }

    // 리뷰 클릭 시 (상품 제목 클릭 시) 모달 열기
    const selectReview = review => {
        console.log(review)
        setSelectedReview(review) // 선택한 리뷰 데이터 설정
        setIsReviewModalOpen(true) // 리뷰 모달 열기
    }

    // 신고 내역 클릭 시 (누적 신고 횟수 클릭 시) 모달 열기
    const selectReport = review_seq => {
        if (review_seq !== undefined && review_seq !== null) {
            loadReviewReport(review_seq) // 신고 내역 로드
            setIsReportModalOpen(true)
        } else {
            console.error('Invalid review_seq:', review_seq)
        }
    }

    // 모달 닫기
    const closeReviewModal = () => setIsReviewModalOpen(false)
    const closeReportModal = () => setIsReportModalOpen(false)

    // 검색 기능 구현
    const handleSearch = query => {
        const results = reviews.filter(
            review =>
                review.PRODUCT_TITLE.includes(query) ||
                review.NICKNAME.includes(query)
        )
        setSearchResults(results)
    }

    // 페이지 변경 처리
    const handlePageChange = pageNumber => {
        setPage(pageNumber) // 페이지 상태 업데이트
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
                    <div className={styles.headerItem}>작성일시</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayReviews.length > 0 ? (
                    displayReviews.map((review, index) => (
                        <div
                            className={styles.reviewRow}
                            key={review.review_seq || index}
                        >
                            <div className={styles.reviewItem}>
                                {startRow + index}
                            </div>
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
                                onClick={() => selectReport(review.REVIEW_SEQ)}
                            >
                                <span className={styles.reportcount}>
                                    {review.REPORT_COUNT}
                                </span>
                            </div>
                            <div className={styles.reviewItem}>
                                <Button
                                    size="s"
                                    title="삭제"
                                    onClick={() =>
                                        handleDeleteReview(review.REVIEW_SEQ)
                                    }
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        신고 리뷰 목록이 없습니다
                    </div>
                )}
            </div>

            {/* 페이징 컴포넌트 */}
            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalReviews} // 전체 리뷰 수
                    perpage={itemsPerPage} // 페이지당 항목 수
                    setPage={handlePageChange} // 페이지 변경 함수
                />
            </div>

            {/* 리뷰 모달창 */}
            {isReviewModalOpen && (
                <div className={styles.reviewModal}>
                    <div className={styles.reviewmodalContent}>
                        <h3>신고당한 리뷰</h3>
                        <div className={styles.reviewDetail}>
                            {selectedReview.IMAGE_URLS ? (
                                selectedReview.IMAGE_URLS.split(',').map(
                                    (url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`리뷰 이미지 ${index + 1}`}
                                        />
                                    )
                                )
                            ) : (
                                <img src={test} alt="기본 이미지" />
                            )}
                        </div>
                        <div className={styles.reviewCtn}>
                            {selectedReview.REVIEW_CONTENTS}
                        </div>
                        <div className={styles.closebtn}>
                            <Button
                                size="s"
                                title="닫기"
                                onClick={closeReviewModal}
                            />
                        </div>
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
                                <div>신고 일시</div>
                            </div>
                            {reportData.map(report => (
                                <div
                                    key={report.review_report_seq}
                                    className={styles.tableRow}
                                >
                                    <div>{report.member_id}</div>
                                    <div>{report.report_code}</div>
                                    <div>
                                        {formatDate(report.review_report_date)}
                                    </div>
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
        </div>
    )
}

export default Review
