import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { detailNtc } from '../../../../../api/notice'
import styles from './Detail.module.css'
import { Button } from '../../../../../components/Button/Button' // 버튼 컴포넌트 임포트

export const Detail = () => {
    const { notice_seq } = useParams() // URL 파라미터로 notice_seq를 가져옴
    const [notice, setNotice] = useState(null) // 공지사항 상세 데이터 상태
    const navigate = useNavigate()

    // 공지사항 상세 데이터를 가져오는 함수
    useEffect(() => {
        const fetchNoticeDetail = async () => {
            try {
                const response = await detailNtc(notice_seq) // API 호출
                setNotice(response.data) // 가져온 공지사항 데이터 설정
            } catch (error) {
                console.error(
                    '공지사항 상세 데이터를 가져오는 중 오류 발생:',
                    error
                )
            }
        }

        fetchNoticeDetail() // 컴포넌트가 마운트될 때 공지사항 데이터 가져오기
    }, [notice_seq])

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
            {notice ? (
                <div className={styles.detailBox}>
                    <div>
                        <div className={styles.titleCont}>
                            <h2 className={styles.noticeTitle}>
                                {notice.notice_title}
                            </h2>
                            <p className={styles.noticeDate}>
                                {formatDate(notice.notice_date)}
                            </p>
                        </div>
                        <div className={styles.noticeContents}>
                            {notice.notice_contents}
                        </div>
                    </div>
                    {/* 버튼 컴포넌트를 사용한 리턴 버튼 */}
                    <div className={styles.returnButton}>
                        <Button
                            size="s" // 버튼 크기
                            title="목록으로 돌아가기" // 버튼에 표시될 텍스트
                            onClick={() => navigate(-1)} // 이전 페이지로 이동
                        />
                    </div>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
        </>
    )
}
