import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { detailNtc } from '../../../../../api/notice'
import styles from './Detail.module.css'
import { Button } from '../../../../../components/Button/Button' // 버튼 컴포넌트 임포트
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop' // 버튼 컴포넌트 임포트
import ReactMarkdown from 'react-markdown'

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

    // 이미지 URL과 텍스트를 분리하는 함수
    const formatNoticeContents = contents => {
        const imageUrlRegex =
            /(https:\/\/storage\.cloud\.google\.com\/hows-attachment\/[^\s]+)/g
        const imageUrls = contents.match(imageUrlRegex) // 모든 이미지 URL 추출
        const text = contents.replace(imageUrlRegex, '').trim() // URL 제외한 나머지 텍스트 추출
        return { imageUrls: imageUrls || [], text } // 여러 이미지 URL 반환
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
            {notice ? (
                <div className={styles.detailBox}>
                    <div>
                        <div className={styles.titleCont}>
                            <h2 className={styles.noticeTitle}>
                                {notice.notice_title}
                            </h2>
                            <div className={styles.subTxt}>
                                <div className={styles.noticeDate}>
                                    {formatDate(notice.notice_date)}
                                </div>
                                <div className={styles.viewCount}>
                                    <i className="bx bx-show"></i>
                                    {notice.view_count}
                                </div>
                            </div>
                        </div>
                        <div className={styles.noticeContents}>
                            {/* 이미지가 있으면 모두 출력 */}
                            {formatNoticeContents(notice.notice_contents)
                                .imageUrls.length > 0 && (
                                <div className={styles.imageContainer}>
                                    {formatNoticeContents(
                                        notice.notice_contents
                                    ).imageUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`공지사항 이미지 ${index + 1}`}
                                            className={styles.noticeImage}
                                        />
                                    ))}
                                </div>
                            )}
                            {/* 텍스트 출력 */}
                            <ReactMarkdown>
                                {
                                    formatNoticeContents(notice.notice_contents)
                                        .text
                                }
                            </ReactMarkdown>
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
            <ScrollTop />
        </>
    )
}
