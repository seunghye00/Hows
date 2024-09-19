import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectNtc } from '../../../../../api/notice' // 공지사항 API
import styles from './NoticeList.module.css'
import { Paging } from '../../../../../components/Pagination/Paging' // 페이지네이션 컴포넌트

export const NoticeList = () => {
    const [notices, setNotices] = useState([])
    const [totalNotices, setTotalNotices] = useState(0)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const navigate = useNavigate()

    const startRow = (page - 1) * perPage + 1
    const endRow = page * perPage

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await selectNtc(startRow, endRow)
                setNotices(response.data.noticeList)
                setTotalNotices(response.data.totalNotices)
            } catch (error) {
                console.error(
                    '공지사항 데이터를 불러오는 중 오류가 발생했습니다.',
                    error
                )
            }
        }

        fetchNotices()
    }, [startRow, endRow])

    const formatDate = dateString => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}.${month}.${day}`
    }

    const handleNoticeClick = noticeSeq => {
        navigate(`/csservice/notice/detail/${noticeSeq}`)
    }

    return (
        <>
            <h2 className={styles.title}>공지사항</h2>
            {notices.length > 0 ? (
                notices.map((notice, index) => (
                    <div
                        key={index}
                        className={styles.noticeItem}
                        onClick={() => handleNoticeClick(notice.notice_seq)}
                    >
                        <p className={styles.noticeTitle}>
                            {notice.notice_title}
                        </p>
                        <p className={styles.noticeDate}>
                            {formatDate(notice.notice_date)}
                        </p>
                    </div>
                ))
            ) : (
                <p className={styles.noNotice}>게시글이 없습니다.</p> // 공지사항이 없을 때 표시할 메시지
            )}
            <Paging
                page={page}
                count={totalNotices}
                setPage={setPage}
                perpage={perPage}
            />
        </>
    )
}
