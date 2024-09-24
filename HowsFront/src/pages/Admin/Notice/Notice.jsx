import React, { useState, useEffect } from 'react'
import styles from './Notice.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { selectNtc, detailNtc, deleteNtc } from '../../../api/notice'
import { formatDate } from '../../../commons/commons'
import ReactMarkdown from 'react-markdown'

export const Notice = () => {
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 저장
    const [notices, setNotices] = useState([]) // 공지사항 목록 저장
    const [totalNtcs, setTotalNtcs] = useState(0) // 전체 공지사항 수
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [itemsPerPage] = useState(10) // 페이지당 항목 수
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달 열림 상태
    const [selectedNotice, setSelectedNotice] = useState(null) // 선택된 공지사항

    const navigate = useNavigate()

    // 페이징에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    // 공지사항 목록 가져오기 (useEffect 사용)
    useEffect(() => {
        loadNotices()
    }, [page])

    const loadNotices = async () => {
        try {
            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}, 페이지당 항목 수: ${itemsPerPage}`
            )

            // 서버에 startRow와 endRow를 넘겨서 데이터를 받아옴
            const response = await selectNtc(startRow, endRow)

            // 서버 응답 데이터 확인
            console.log('서버에서 받은 데이터:', response.data)

            // 서버에서 받은 공지사항 목록과 전체 공지사항 수를 상태에 저장
            const { noticeList, totalNotices } = response.data
            console.log(
                '공지사항 목록:',
                noticeList,
                '전체 공지사항 수:',
                totalNotices
            )

            // 서버에서 받은 공지사항 목록을 상태에 저장
            setNotices(noticeList)
            // 전체 공지사항 수 저장 (페이징을 위한 값)
            setTotalNtcs(totalNotices)
        } catch (error) {
            console.error('공지사항 목록을 불러오는데 실패했습니다.', error)
        }
    }

    // 공지사항 삭제 함수
    const handleDelete = async notice_seq => {
        Swal.fire({
            title: '공지사항 삭제',
            text: '정말로 이 공지사항을 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    const resp = await deleteNtc(notice_seq)
                    if (resp.status === 200) {
                        Swal.fire({
                            title: '삭제 완료',
                            text: '공지사항이 성공적으로 삭제되었습니다.',
                            icon: 'success',
                        })
                        // 공지사항 삭제 후 목록을 다시 불러옴
                        loadNotices() // 목록을 다시 로드
                    } else {
                        Swal.fire({
                            title: '삭제 실패',
                            text: '공지사항 삭제에 실패했습니다.',
                            icon: 'error',
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: '오류 발생',
                        text: '공지사항 삭제 중 오류가 발생했습니다.',
                        icon: 'error',
                    })
                }
            }
        })
    }

    // // 이미지와 텍스트 분리하는 함수
    // const formatNoticeContents = contents => {
    //     const imageUrlRegex =
    //         /(https:\/\/storage\.cloud\.google\.com\/hows-attachment\/[^\s]+)/
    //     const imageUrl = contents.match(imageUrlRegex) // 이미지 URL 추출
    //     const text = contents.replace(imageUrlRegex, '').trim() // URL 제외한 나머지 텍스트 추출
    //     return { imageUrl: imageUrl ? imageUrl[0] : '', text }
    // }

    // 이미지와 텍스트 분리하는 함수 (여러 이미지 처리)
    const formatNoticeContents = contents => {
        const imageUrlRegex =
            /(https:\/\/storage\.cloud\.google\.com\/hows-attachment\/[^\s]+)/g
        const imageUrls = contents.match(imageUrlRegex) // 모든 이미지 URL 추출
        const text = contents.replace(imageUrlRegex, '').trim() // URL 제외한 나머지 텍스트 추출
        return { imageUrls: imageUrls || [], text }
    }

    // 공지사항 제목 클릭 시 모달 열기
    const openModal = async notice_seq => {
        try {
            const response = await detailNtc(notice_seq)
            const noticeData = response.data
            setSelectedNotice(noticeData)
            setIsModalOpen(true)
        } catch (error) {
            console.error('공지사항 조회 실패:', error)
        }
    }

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedNotice(null)
        loadNotices()
    }

    // 검색 기능 구현
    const handleSearch = query => {
        if (query) {
            const results = notices.filter(notice =>
                notice.notice_title.includes(query)
            )
            setSearchResults(results)
        } else {
            setSearchResults([]) // 검색어가 없을 경우 검색 결과 초기화
        }
    }

    // 페이지 변경 처리
    const handlePageChange = pageNumber => {
        setPage(pageNumber) // 페이지 상태 업데이트
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayNotices = searchResults.length > 0 ? searchResults : notices

    return (
        <div className={styles.noticeContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search placeholder="제목 검색" onSearch={handleSearch} />
                    <Button
                        size="s"
                        title="등록하기"
                        onClick={() => {
                            navigate('/admin/notice/writeNotice')
                        }}
                    />
                </div>
            </div>

            <div className={styles.noticelist}>
                <div className={styles.noticeHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성일시</div>
                    <div className={styles.headerItem}>조회수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayNotices.length > 0 ? (
                    displayNotices.map((notice, index) => (
                        <div
                            className={styles.noticeRow}
                            key={notice.notice_seq}
                        >
                            <div className={styles.noticeItem}>
                                {startRow + index}
                            </div>
                            <div
                                className={styles.noticeItem}
                                onClick={() => openModal(notice.notice_seq)} // 공지사항 제목 클릭 시 모달 열기
                            >
                                <span className={styles.span}>
                                    {notice.notice_title}
                                </span>
                            </div>
                            <div className={styles.noticeItem}>
                                {formatDate(notice.notice_date)}
                            </div>
                            <div className={styles.noticeItem}>
                                {notice.view_count}
                            </div>
                            <div className={styles.noticeItem}>
                                <Button
                                    size="s"
                                    title="삭제"
                                    onClick={() =>
                                        handleDelete(notice.notice_seq)
                                    } // 삭제 버튼 클릭 시 삭제 함수 호출
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>공지사항이 없습니다</div>
                )}
            </div>

            {/* 페이징 컴포넌트 */}
            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalNtcs} // 전체 공지사항 개수
                    perpage={itemsPerPage} // 페이지당 항목 수
                    setPage={handlePageChange} // 페이지 변경 함수
                />
            </div>

            {/* 모달 창 */}
            {isModalOpen && selectedNotice && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.headerSection}>
                            <div className={styles.titleView}>
                                <h3>{selectedNotice.notice_title}</h3>
                            </div>
                            <div className={styles.writerDate}>
                                <span>
                                    작성날짜 :{' '}
                                    {formatDate(selectedNotice.notice_date)}
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div className={styles.modalBody}>
                            <div className={styles.contentContainer}>
                                {/* 이미지가 있으면 모두 출력 */}
                                {formatNoticeContents(
                                    selectedNotice.notice_contents
                                ).imageUrls.length > 0 && (
                                    <div className={styles.imageContainer}>
                                        {formatNoticeContents(
                                            selectedNotice.notice_contents
                                        ).imageUrls.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`공지사항 이미지 ${
                                                    index + 1
                                                }`}
                                                className={styles.img}
                                            />
                                        ))}
                                    </div>
                                )}
                                {/* 이미지 아래에 텍스트 출력 */}
                                {formatNoticeContents(
                                    selectedNotice.notice_contents
                                ).text && (
                                    <div>
                                        <ReactMarkdown>
                                            {
                                                formatNoticeContents(
                                                    selectedNotice.notice_contents
                                                ).text
                                            }
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.btn}>
                            <Button
                                size="s"
                                title="수정"
                                onClick={() =>
                                    navigate(
                                        `/admin/notice/modifyNotice/${selectedNotice.notice_seq}`
                                    )
                                }
                            />
                            <Button
                                size="s"
                                title="닫기"
                                onClick={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notice
