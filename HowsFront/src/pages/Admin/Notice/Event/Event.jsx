import React, { useState, useEffect } from 'react'
import styles from './Event.module.css'
import { Search } from '../../../../components/Search/Search'
import { Paging } from '../../../../components/Pagination/Paging'
import { Button } from '../../../../components/Button/Button'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { selectEvt, detailEvt, deleteEvt } from '../../../../api/event'
import { formatDate } from '../../../../commons/commons'
import ReactMarkdown from 'react-markdown'

export const Event = () => {
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 저장
    const [events, setEvents] = useState([]) // 이벤트 목록 저장
    const [totalEvts, setTotalEvts] = useState(0) // 전체 이벤트 수
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [itemsPerPage] = useState(10) // 페이지당 항목 수
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달 열림 상태
    const [selectedEvent, setSelectedEvent] = useState(null) // 선택된 이벤트

    const navigate = useNavigate()

    // 페이징에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    // 이벤트 목록 가져오기 (useEffect 사용)
    useEffect(() => {
        loadEvents()
    }, [page])

    const loadEvents = async () => {
        try {
            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}, 페이지당 항목 수: ${itemsPerPage}`
            )

            // 서버에 startRow와 endRow를 넘겨서 데이터를 받아옴
            const response = await selectEvt(startRow, endRow)

            // 서버 응답 데이터 확인
            console.log('서버에서 받은 데이터:', response.data)

            // 서버에서 받은 이벤트 목록과 전체 이벤트 수를 상태에 저장
            const { eventList, totalEvents } = response.data
            console.log(
                '이벤트 목록:',
                eventList,
                '전체 이벤트 수:',
                totalEvents
            )

            // 서버에서 받은 이벤트 목록을 상태에 저장
            setEvents(eventList)
            // 전체 이벤트 수 저장 (페이징을 위한 값)
            setTotalEvts(totalEvents)
        } catch (error) {
            console.error('이벤트 목록을 불러오는데 실패했습니다.', error)
        }
    }

    // 이벤트 삭제 함수
    const handleDelete = async event_seq => {
        Swal.fire({
            title: '이벤트 삭제',
            text: '정말로 이 이벤트를 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    const resp = await deleteEvt(event_seq)
                    if (resp.status === 200) {
                        Swal.fire({
                            title: '삭제 완료',
                            text: '이벤트가 성공적으로 삭제되었습니다.',
                            icon: 'success',
                        })
                        // 이벤트 삭제 후 목록을 다시 불러옴
                        loadEvents() // 목록을 다시 로드
                    } else {
                        Swal.fire({
                            title: '삭제 실패',
                            text: '이벤트 삭제에 실패했습니다.',
                            icon: 'error',
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: '오류 발생',
                        text: '이벤트 삭제 중 오류가 발생했습니다.',
                        icon: 'error',
                    })
                }
            }
        })
    }

    // 이미지와 텍스트 분리하는 함수
    const formatEventContents = contents => {
        const imageUrlRegex =
            /(https:\/\/storage\.cloud\.google\.com\/hows-attachment\/[^\s]+)/g
        const imageUrls = contents.match(imageUrlRegex) || [] // 모든 이미지 URL 추출
        const text = contents.replace(imageUrlRegex, '').trim() // URL 제외한 나머지 텍스트 추출
        return { imageUrls, text }
    }

    // 모달을 여는 함수
    const openModal = async event_seq => {
        try {
            const response = await detailEvt(event_seq)
            const eventData = response.data
            setSelectedEvent(eventData)
            setIsModalOpen(true)
        } catch (error) {
            console.error('이벤트 상세 조회 실패:', error)
        }
    }

    // 모달을 닫는 함수
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedEvent(null)
        loadEvents()
    }

    // 검색 기능 구현
    const handleSearch = query => {
        if (query) {
            const results = events.filter(event =>
                event.event_title.includes(query)
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
    const displayEvents = searchResults.length > 0 ? searchResults : events

    return (
        <div className={styles.eventContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search placeholder="제목 검색" onSearch={handleSearch} />
                    <Button
                        size="s"
                        title="등록하기"
                        onClick={() => {
                            navigate('/admin/event/writeEvent')
                        }}
                    />
                </div>
            </div>

            <div className={styles.eventlist}>
                <div className={styles.eventHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성일시</div>
                    <div className={styles.headerItem}>조회수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayEvents.length > 0 ? (
                    displayEvents.map((event, index) => (
                        <div className={styles.eventRow} key={event.event_seq}>
                            <div className={styles.eventItem}>
                                {startRow + index}
                            </div>
                            <div
                                className={styles.eventItem}
                                onClick={() => openModal(event.event_seq)} // 이벤트 제목 클릭 시 모달 열기
                            >
                                <span className={styles.span}>
                                    {event.event_title}
                                </span>
                            </div>
                            <div className={styles.eventItem}>
                                {formatDate(event.event_date)}
                            </div>
                            <div className={styles.eventItem}>
                                {event.view_count}
                            </div>
                            <div className={styles.eventItem}>
                                <Button
                                    size="s"
                                    title="삭제"
                                    onClick={() =>
                                        handleDelete(event.event_seq)
                                    } // 삭제 버튼 클릭 시 삭제 함수 호출
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>이벤트가 없습니다</div>
                )}
            </div>

            {/* 페이징 컴포넌트 */}
            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalEvts} // 전체 이벤트 개수
                    perpage={itemsPerPage} // 페이지당 항목 수
                    setPage={handlePageChange} // 페이지 변경 함수
                />
            </div>

            {/* 모달 창 */}
            {isModalOpen && selectedEvent && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.headerSection}>
                            <div className={styles.titleView}>
                                <h3>{selectedEvent.event_title}</h3>
                            </div>
                            <div className={styles.writerDate}>
                                <span>
                                    작성날짜 :{' '}
                                    {formatDate(selectedEvent.event_date)}
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div className={styles.modalBody}>
                            <div className={styles.contentContainer}>
                                {/* 이미지가 있으면 출력 */}
                                {formatEventContents(
                                    selectedEvent.event_contents
                                ).imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`이벤트 이미지 ${index}`}
                                        className={styles.img}
                                    />
                                ))}

                                {/* 텍스트 출력 */}
                                {formatEventContents(
                                    selectedEvent.event_contents
                                ).text && (
                                    <div>
                                        <ReactMarkdown>
                                            {
                                                formatEventContents(
                                                    selectedEvent.event_contents
                                                ).text
                                            }
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.btn}>
                            {/* 수정 버튼 추가 */}
                            <Button
                                size="s"
                                title="수정"
                                onClick={() =>
                                    navigate(
                                        `/admin/event/modifyEvent/${selectedEvent.event_seq}`
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

export default Event
