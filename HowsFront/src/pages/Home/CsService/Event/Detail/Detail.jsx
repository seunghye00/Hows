import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './Detail.module.css'
import { Button } from '../../../../../components/Button/Button'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import { detailEvt } from '../../../../../api/event' // 이벤트 API 불러오기
import ReactMarkdown from 'react-markdown'

export const Detail = () => {
    const { event_seq } = useParams() // URL 파라미터에서 event_seq 가져오기
    const [event, setEvent] = useState(null)
    const navigate = useNavigate()

    // 이벤트 상세 데이터를 가져오는 함수
    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                const response = await detailEvt(event_seq) // API 호출
                setEvent(response.data) // API에서 받아온 데이터를 상태에 저장
                console.log(response.data)
            } catch (error) {
                console.error(
                    '이벤트 상세 데이터를 가져오는 중 오류 발생:',
                    error
                )
            }
        }

        fetchEventDetail() // 이벤트 상세 데이터 가져오기 호출
    }, [event_seq])

    // 이미지 URL과 텍스트를 분리하는 함수
    const formatEventContents = contents => {
        const imageUrlRegex =
            /(https:\/\/storage\.cloud\.google\.com\/hows-attachment\/[^\s]+)/g
        const imageUrls = contents.match(imageUrlRegex) || [] // 모든 이미지 URL 추출
        const text = contents.replace(imageUrlRegex, '').trim() // URL 제외한 나머지 텍스트 추출
        return { imageUrls, text }
    }

    // 날짜 포맷을 yyyy.mm.dd로 변환하는 함수
    const formatDate = dateString => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}.${month}.${day}`
    }

    return (
        <>
            {event ? (
                <div className={styles.detailBox}>
                    <div>
                        <div className={styles.titleCont}>
                            <h2 className={styles.eventTitle}>
                                {event.event_title}
                            </h2>
                            <div className={styles.subTxt}>
                                <div className={styles.eventDate}>
                                    {formatDate(event.event_date)}
                                </div>
                                <div className={styles.viewCount}>
                                    <i className="bx bx-show"></i>
                                    {event.view_count}
                                </div>
                            </div>
                        </div>
                        <div className={styles.eventContents}>
                            {/* 이미지가 있으면 출력 */}
                            {formatEventContents(event.event_contents).imageUrls
                                .length > 0 && (
                                <div className={styles.imageContainer}>
                                    {formatEventContents(
                                        event.event_contents
                                    ).imageUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`이벤트 이미지 ${index + 1}`}
                                            className={styles.eventImage}
                                        />
                                    ))}
                                </div>
                            )}
                            {/* 텍스트 출력 */}
                            <ReactMarkdown>
                                {formatEventContents(event.event_contents).text}
                            </ReactMarkdown>
                        </div>
                    </div>
                    {/* 버튼 컴포넌트를 사용한 리턴 버튼 */}
                    <div className={styles.returnButton}>
                        <Button
                            size="s"
                            title="목록으로 돌아가기"
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
            <ScrollTop />
        </>
    )
}
