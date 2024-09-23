import React, { useState, useEffect } from 'react'
import styles from './Community.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import {
    reportedCommunity,
    CommunityReport,
    deleteCommunity,
} from '../../../api/community'
import Swal from 'sweetalert2'
import { formatDate } from '../../../commons/commons'
import test from '../../../assets/images/푸바오.png'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export const Community = () => {
    const [boardReportModalOpen, setBoardReportModalOpen] = useState(false)
    const [selectedBoard, setSelectedBoard] = useState({}) // 선택된 게시물 상태
    const [reportData, setReportData] = useState([]) // 신고 내역 상태
    const [boards, setBoards] = useState([]) // 서버에서 불러온 게시물 목록
    const [totalBoards, setTotalBoards] = useState(0) // 전체 게시물 수
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [itemsPerPage] = useState(10) // 페이지당 항목 수
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 상태
    const [boardDetailModalOpen, setBoardDetailModalOpen] = useState(false) // 게시물 상세 모달 상태

    // 페이징에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    // 서버에서 게시물 목록을 가져오는 함수
    useEffect(() => {
        loadReportedCommunity()
    }, [page]) // 페이지 변경 시마다 호출

    const loadReportedCommunity = async () => {
        try {
            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}`
            )

            // 서버로 startRow와 endRow를 전달하여 게시물 목록을 가져옴
            const resp = await reportedCommunity(startRow, endRow)
            console.log('받은 데이터:', resp.data)

            // 상태값 업데이트
            setBoards(resp.data.boards) // 서버에서 받은 게시물 목록을 상태에 저장
            setTotalBoards(resp.data.totalCount) // 전체 게시물 수 저장
        } catch (error) {
            console.error('게시물 목록을 불러오는데 실패했습니다.', error)
        }
    }

    // 게시물 신고 내역을 서버에서 가져오는 함수
    const loadBoardReport = async board_seq => {
        try {
            console.log('신고된 게시물 번호 (board_seq):', board_seq)

            const resp = await CommunityReport(board_seq)

            console.log('서버에서 받은 신고 내역 데이터:', resp.data)

            setReportData(resp.data) // 서버에서 받은 신고 내역을 상태에 저장
            setBoardReportModalOpen(true) // 신고 모달 열기
        } catch (error) {
            console.error('신고 내역을 불러오는데 실패했습니다.', error)
        }
    }

    // 게시물 삭제 함수
    const handleDeleteBoard = async board_seq => {
        Swal.fire({
            title: '게시물 삭제',
            text: '정말로 이 게시물을 삭제 하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    const resp = await deleteCommunity(board_seq)
                    if (resp.status === 200) {
                        Swal.fire(
                            '삭제 완료',
                            '게시물이 삭제되었습니다.',
                            'success'
                        )
                        loadReportedCommunity() // 삭제 후 목록 업데이트
                    } else {
                        Swal.fire(
                            '삭제 실패',
                            '게시물 삭제에 실패했습니다.',
                            'error'
                        )
                    }
                } catch (error) {
                    Swal.fire(
                        '오류 발생',
                        '게시물 삭제 중 오류가 발생했습니다.',
                        'error'
                    )
                }
            }
        })
    }

    // 게시물 상세 모달 열기
    const openBoardDetailModal = board => {
        setSelectedBoard(board) // 선택된 게시물 저장
        setBoardDetailModalOpen(true) // 게시물 상세 모달 열기
    }

    // 게시물 상세 모달 닫기
    const closeBoardDetailModal = () => {
        setBoardDetailModalOpen(false)
    }

    // 신고 모달 닫기
    const closeReportModal = () => {
        setBoardReportModalOpen(false)
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = boards.filter(
            post =>
                (post.BOARD_CONTENTS && post.BOARD_CONTENTS.includes(query)) ||
                (post.MEMBER_ID && post.MEMBER_ID.includes(query))
        )
        setSearchResults(results) // 검색 결과 업데이트
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayBoards = searchResults.length > 0 ? searchResults : boards

    // 페이징 처리 핸들러
    const handlePageChange = pageNumber => {
        setPage(pageNumber) // 페이지 상태 업데이트
    }

    return (
        <div className={styles.communityContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="게시글 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.communitylist}>
                <div className={styles.communityHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>게시글</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성일시</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayBoards.length > 0 ? (
                    displayBoards.map((post, index) => (
                        <div className={styles.communityRow} key={index}>
                            <div className={styles.communityItem}>
                                {startRow + index}
                            </div>
                            <div
                                className={styles.communityItem}
                                onClick={() => openBoardDetailModal(post)}
                            >
                                <span className={styles.span}>
                                    {post.BOARD_CONTENTS}
                                </span>
                            </div>
                            <div className={styles.communityItem}>
                                {post.MEMBER_ID}
                            </div>
                            <div className={styles.communityItem}>
                                {formatDate(post.BOARD_WRITE_DATE)}
                            </div>
                            <div
                                className={styles.communityItem}
                                onClick={() => loadBoardReport(post.BOARD_SEQ)}
                            >
                                <span className={styles.reportcount}>
                                    {post.REPORT_COUNT}
                                </span>
                            </div>
                            <div className={styles.communityItem}>
                                <Button
                                    size="s"
                                    title="삭제"
                                    onClick={() =>
                                        handleDeleteBoard(post.BOARD_SEQ)
                                    }
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        신고 게시물 목록이 없습니다
                    </div>
                )}
            </div>

            {/* 게시물 상세 모달창 */}
            {boardDetailModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.detailmodalContent}>
                        {/* 작성자 정보 */}
                        <div className={styles.authorInfo}>
                            <img
                                src={selectedBoard.MEMBER_AVATAR || test}
                                alt="회원 아바타"
                                className={styles.avatar}
                            />
                            <span className={styles.nickname}>
                                {selectedBoard.MEMBER_ID}
                            </span>
                        </div>
                        {/* 첨부된 이미지 스와이프 */}
                        <div className={styles.imageSection}>
                            {selectedBoard.IMAGE_URLS &&
                            selectedBoard.IMAGE_URLS.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={30}
                                    slidesPerView={1}
                                >
                                    {selectedBoard.IMAGE_URLS.split(',')
                                        .filter(Boolean)
                                        .map((url, index) => (
                                            <div className={styles.detailimg}>
                                                <SwiperSlide key={index}>
                                                    <img
                                                        src={url}
                                                        alt={`게시물 이미지 ${
                                                            index + 1
                                                        }`}
                                                        className={
                                                            styles.boardImage
                                                        }
                                                    />
                                                </SwiperSlide>
                                            </div>
                                        ))}
                                </Swiper>
                            ) : (
                                <img
                                    src={test}
                                    alt="기본 이미지"
                                    className={styles.boardImage}
                                />
                            )}
                        </div>
                        <div className={styles.boardContent}>
                            <div>{selectedBoard.BOARD_CONTENTS}</div>
                        </div>
                        <div className={styles.close}>
                            <Button
                                size="s"
                                title="닫기"
                                onClick={closeBoardDetailModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 신고 모달창 */}
            {boardReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>게시판 신고내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 일시</div>
                            </div>
                            {reportData.map((report, index) => (
                                <div className={styles.tableRow} key={index}>
                                    <div>{report.member_id}</div>
                                    <div>{report.report_code}</div>
                                    <div>
                                        {formatDate(report.board_report_date)}
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

            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalBoards}
                    perpage={itemsPerPage}
                    setPage={handlePageChange}
                />
            </div>
        </div>
    )
}

export default Community
