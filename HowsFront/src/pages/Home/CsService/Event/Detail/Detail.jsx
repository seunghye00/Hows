import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './Detail.module.css'
import { Button } from '../../../../../components/Button/Button'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'
import img from '../../../../../assets/images/Group16.png'

export const Detail = () => {
    const { event_seq } = useParams()
    const [event, setEvent] = useState(null)
    const navigate = useNavigate()

    // 이벤트 상세 데이터를 가져오는 함수 (임의의 값으로 설정)
    useEffect(() => {
        setEvent({
            event_title: '이벤트 타이틀',
            event_date: '2024-09-22',
            event_contents: `이벤트 내용입니다. ${img}`,
        })
    }, [event_seq])

    // 이미지 URL과 텍스트를 분리하는 함수
    const formatEventContents = contents => {
        const imageUrlRegex =
            /(https:\/\/storage\.cloud\.google\.com\/hows-attachment\/[^\s]+)/
        const imageUrl = contents.match(imageUrlRegex) // 이미지 URL 추출
        const text = contents.replace(imageUrlRegex, '').trim() // URL 제외한 나머지 텍스트 추출
        return { imageUrl: imageUrl ? imageUrl[0] : '', text }
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
                            <p className={styles.eventDate}>
                                {formatDate(event.event_date)}
                            </p>
                        </div>
                        <div className={styles.eventContents}>
                            {/* 이미지가 있으면 출력 */}
                            {formatEventContents(event.event_contents)
                                .imageUrl && (
                                <img
                                    src={
                                        formatEventContents(
                                            event.event_contents
                                        ).imageUrl
                                    }
                                    alt="이벤트 이미지"
                                    className={styles.eventImage}
                                />
                            )}
                            {/* 텍스트 출력 */}
                            <p>
                                {formatEventContents(event.event_contents).text}
                            </p>

                            {/* 직접 넣은 이미지 출력 */}
                            <img
                                src={img}
                                alt="추가된 이미지"
                                className={styles.additionalImage}
                            />
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
