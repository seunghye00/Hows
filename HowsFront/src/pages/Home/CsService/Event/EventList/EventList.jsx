import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectEvt } from '../../../../../api/event' // 이벤트 API
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
        const fetchEvents = async () => {
            try {
                // selectEvt API 호출로 실제 이벤트 데이터를 가져옴
                const response = await selectEvt(startRow, endRow)
                // 응답 데이터가 undefined가 아닌지 체크
                if (response && response.data && response.data.eventList) {
                    setEvents(response.data.eventList) // 이벤트 데이터 설정
                    setTotalEvents(response.data.totalEvents) // 총 이벤트 개수 설정
                } else {
                    setEvents([]) // 응답이 없을 경우 빈 배열 설정
                    setTotalEvents(0) // 총 이벤트 개수를 0으로 설정
                }
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
            {events && events.length > 0 ? (
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
