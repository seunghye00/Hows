import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { selectEvents } from '../../../../../api/event' // 이벤트 API
import styles from './EventList.module.css'
import { Paging } from '../../../../../components/Pagination/Paging' // 페이지네이션 컴포넌트

export const EventList = () => {
    const [events, setEvents] = useState([]) // events 상태
    const [totalEvents, setTotalEvents] = useState(0) // totalEvents 상태
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const navigate = useNavigate()

    const startRow = (page - 1) * perPage + 1
    const endRow = page * perPage

    useEffect(() => {
        // API 대신 임의의 데이터를 설정
        const fetchEvents = async () => {
            try {
                // 임의 데이터 설정
                const mockEvents = [
                    {
                        event_seq: 1,
                        event_title: '가을 할인 이벤트',
                        event_date: '2024-09-22',
                    },
                    {
                        event_seq: 2,
                        event_title: '여름 맞이 대박 세일',
                        event_date: '2024-08-15',
                    },
                    {
                        event_seq: 3,
                        event_title: '겨울 시즌 사전 예약 이벤트',
                        event_date: '2024-10-01',
                    },
                ]

                setEvents(mockEvents)
                setTotalEvents(mockEvents.length)
            } catch (error) {
                console.error(
                    '이벤트 데이터를 불러오는 중 오류가 발생했습니다.',
                    error
                )
            }
        }

        fetchEvents()
    }, [startRow, endRow])

    const formatDate = dateString => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}.${month}.${day}`
    }

    const handleEventClick = eventSeq => {
        navigate(`/csservice/event/detail/${eventSeq}`)
    }

    return (
        <>
            <h2 className={styles.title}>이벤트</h2>
            {events.length > 0 ? (
                events.map((event, index) => (
                    <div
                        key={index}
                        className={styles.eventItem}
                        onClick={() => handleEventClick(event.event_seq)}
                    >
                        <p className={styles.eventTitle}>{event.event_title}</p>
                        <p className={styles.eventDate}>
                            {formatDate(event.event_date)}
                        </p>
                    </div>
                ))
            ) : (
                <p className={styles.noEvent}>게시글이 없습니다.</p>
            )}
            <Paging
                page={page}
                count={totalEvents}
                setPage={setPage}
                perpage={perPage}
            />
        </>
    )
}
