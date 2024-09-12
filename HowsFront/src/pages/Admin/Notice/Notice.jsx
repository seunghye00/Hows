import React, { useState, useEffect } from 'react'
import styles from './Notice.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { selectNtc, detailNtc, deleteNtc } from '../../../api/notice'
import { formatDate } from '../../../commons/commons'
import { SwalComp } from '../../../commons/commons'

export const Notice = () => {
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 저장
    const [notices, setNotices] = useState([]) // 공지사항 목록 저장
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedNotice, setSelectedNotice] = useState(null)

    const navigate = useNavigate()

    // 공지사항 목록 가져오기 (useEffect 사용)
    useEffect(() => {
        fetchNotices()
    }, [])

    // 공지사항 목록 불러오기 함수
    const fetchNotices = async () => {
        try {
            console.log('공지사항 목록 가져오는 중...')
            const response = await selectNtc() // API 호출
            console.log('공지사항 조회 성공:', response.data)
            setNotices(response.data)
        } catch (error) {
            console.error('공지사항 조회 실패:', error)
        }
    }

    // 공지사항 삭제 함수
    const handleDelete = async notice_seq => {
        try {
            const confirmResult = await SwalComp({
                type: 'confirm',
                text: '정말로 삭제하시겠습니까?',
            })

            if (confirmResult.isConfirmed) {
                // 삭제 API 호출
                await deleteNtc(notice_seq)
                SwalComp({
                    type: 'success',
                    text: '공지사항이 삭제되었습니다.',
                })

                // 공지사항 목록을 다시 불러오기
                fetchNotices()
            }
        } catch (error) {
            console.error('공지사항 삭제 실패:', error)
            SwalComp({
                type: 'error',
                text: '공지사항 삭제에 실패했습니다.',
            })
        }
    }

    // 공지사항 제목 클릭 시 모달 열기 및 조회수 증가
    const openModal = async notice_seq => {
        try {
            // 조회수 증가 및 상세 조회
            const response = await detailNtc(notice_seq)
            setSelectedNotice(response.data) // 조회된 공지사항 데이터 설정
            setIsModalOpen(true) // 모달 열기

            // 조회수 업데이트를 바로 적용하기 위해 상태 변경
            setNotices(prevNotices =>
                prevNotices.map(notice =>
                    notice.notice_seq === notice_seq
                        ? { ...notice, view_count: notice.view_count + 1 }
                        : notice
                )
            )
        } catch (error) {
            console.error('상세 조회 실패:', error)
        }
    }

    // 모달 닫기
    const closeModal = () => {
        console.log('모달 닫기')
        setIsModalOpen(false)
        setSelectedNotice(null)
    }

    // 검색 기능 구현
    const handleSearch = query => {
        console.log('검색어:', query)
        const results = notices.filter(
            notice =>
                notice.title.includes(query) || notice.writer.includes(query)
        )
        console.log('검색 결과:', results)
        setSearchResults(results)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayNotices = searchResults.length > 0 ? searchResults : notices

    return (
        <div className={styles.noticeContainer}>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="제목 또는 작성자 검색"
                        onSearch={handleSearch} // 검색 이벤트
                    />
                    <Button
                        size="s"
                        title="등록하기"
                        onClick={() => {
                            console.log('공지사항 등록 페이지로 이동')
                            navigate('/admin/notice/writeNotice')
                        }}
                    />
                </div>
            </div>

            <div className={styles.noticelist}>
                <div className={styles.noticeHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>조회수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                {displayNotices.map((notice, index) => (
                    <div className={styles.noticeRow} key={notice.notice_seq}>
                        <div className={styles.noticeItem}>{index + 1}</div>
                        <div className={styles.noticeItem}>
                            <span
                                className={styles.span}
                                onClick={() => openModal(notice.notice_seq)} // 공지사항 제목 클릭 시 모달 열기
                            >
                                {notice.notice_title}
                            </span>
                        </div>
                        <div className={styles.noticeItem}>
                            {formatDate(notice.notice_date)}
                        </div>
                        <div className={styles.noticeItem}>
                            <span className={styles.viewcount}>
                                {notice.view_count}
                            </span>
                        </div>
                        <div className={styles.noticeItem}>
                            <Button
                                size="s"
                                title="삭제"
                                onClick={() => handleDelete(notice.notice_seq)} // 삭제 버튼 클릭 시 삭제 함수 호출
                            />
                        </div>
                    </div>
                ))}
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
                                <div>{selectedNotice.notice_contents}</div>
                            </div>
                        </div>
                        <div className={styles.btn}>
                            <Button
                                size="s"
                                title="닫기"
                                onClick={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 페이징 컴포넌트 */}
            <div className={styles.pagination}>
                <Paging />
            </div>
        </div>
    )
}

export default Notice
