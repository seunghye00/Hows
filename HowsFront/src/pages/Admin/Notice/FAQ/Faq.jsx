import React, { useState, useEffect } from 'react'
import { FaChevronDown, FaTimes } from 'react-icons/fa'
import styles from './Faq.module.css'
import { Button } from '../../../../components/Button/Button'
import {
    selectAllFaq,
    insertFaq,
    modifyFaq,
    deleteFaq,
} from '../../../../api/faq'
import Swal from 'sweetalert2'

const Faq = () => {
    const [faqList, setFaqList] = useState([]) // FAQ 리스트
    const [charCount, setCharCount] = useState({}) // 각 항목의 글자 수
    const [expandedFaqIndex, setExpandedFaqIndex] = useState(null) // 펼쳐진 FAQ 인덱스
    const [isAdd, setIsAdd] = useState(false) // 추가 모드 상태
    const [editIndex, setEditIndex] = useState(null) // 수정 모드 인덱스

    const fetchFaqList = () => {
        selectAllFaq()
            .then(response => {
                setFaqList(response.data) // 상태 업데이트 후 리렌더링
            })
            .catch(error => console.error('FAQ 목록 조회 실패:', error))
    }

    useEffect(() => {
        // 서버에서 FAQ 목록 가져오기
        fetchFaqList()
    }, [])

    // FAQ 항목 토글
    const toggleFaq = index => {
        setExpandedFaqIndex(expandedFaqIndex === index ? null : index)
    }

    const handleInputChange = (e, index, field) => {
        const updatedFaqList = [...faqList]
        const newValue = e.target.value

        // 100자 제한을 초과했을 경우 경고 메시지 표시
        if (newValue.length > 100) {
            Swal.fire({
                title: '입력 제한',
                text: `${
                    field === 'faq_title' ? '제목' : '내용'
                }은 최대 100자까지만 입력할 수 있습니다.`,
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        updatedFaqList[index][field] = newValue
        setFaqList(updatedFaqList)

        // 글자 수 업데이트
        setCharCount({
            ...charCount,
            [index]: {
                ...charCount[index],
                [field]: newValue.length,
            },
        })
    }

    // FAQ 추가
    const addFaqItem = () => {
        const newFaq = { faq_title: '제목', faq_contents: '답변 : ' }
        setFaqList([...faqList, newFaq])
        setIsAdd(true)
        setEditIndex(faqList.length)
    }

    // FAQ 등록
    const handleRegister = () => {
        const newFaq = faqList[editIndex]

        // 제목이나 내용이 비어있는지 확인
        if (!newFaq.faq_title.trim() || !newFaq.faq_contents.trim()) {
            Swal.fire({
                title: '등록 실패',
                text: '제목과 내용을 모두 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        insertFaq(newFaq)
            .then(response => {
                setFaqList(
                    faqList.map((faq, i) =>
                        i === editIndex ? response.data : faq
                    )
                )
                setIsAdd(false)
                setEditIndex(null)
                setExpandedFaqIndex(null)
                Swal.fire({
                    title: '등록 완료',
                    text: 'FAQ가 성공적으로 등록되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                })
                fetchFaqList() // 등록 후 목록을 다시 불러옴
            })
            .catch(error => {
                Swal.fire({
                    title: '등록 실패',
                    text: 'FAQ 등록 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                })
            })
    }

    // FAQ 취소
    const handleCancel = () => {
        setFaqList(faqList.slice(0, -1))
        setIsAdd(false)
        setEditIndex(null)
    }

    // 수정 모드 진입
    const enterEditMode = index => {
        setEditIndex(index)
    }

    // 수정 모드 저장
    const saveEditMode = () => {
        Swal.fire({
            title: '수정 확인',
            text: '이 FAQ를 저장하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                const updatedFaq = faqList[editIndex]

                // 제목과 내용 검증
                if (
                    !updatedFaq.faq_title.trim() ||
                    !updatedFaq.faq_contents.trim()
                ) {
                    Swal.fire({
                        title: '수정 실패',
                        text: '제목과 내용을 모두 입력해주세요.',
                        icon: 'warning',
                        confirmButtonText: '확인',
                    })
                    return
                }

                modifyFaq(updatedFaq.faq_seq, updatedFaq)
                    .then(() => {
                        setEditIndex(null)
                        Swal.fire({
                            title: '수정 완료',
                            text: 'FAQ가 성공적으로 수정되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인',
                        })
                        fetchFaqList() // 수정 후 목록을 다시 불러옴
                    })
                    .catch(error => {
                        Swal.fire({
                            title: '수정 실패',
                            text: 'FAQ 수정 중 오류가 발생했습니다.',
                            icon: 'error',
                            confirmButtonText: '확인',
                        })
                    })
            }
        })
    }

    // 수정 모드 취소
    const cancelEditMode = () => {
        setEditIndex(null)
    }

    // FAQ 삭제
    const deleteFaqItem = index => {
        const faq_seq = faqList[index].faq_seq

        Swal.fire({
            title: '삭제 확인',
            text: '이 FAQ를 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                deleteFaq(faq_seq)
                    .then(() => {
                        const updatedFaqList = faqList.filter(
                            (_, i) => i !== index
                        )
                        setFaqList(updatedFaqList)
                        Swal.fire({
                            title: '삭제 완료',
                            text: 'FAQ가 성공적으로 삭제되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인',
                        })
                        fetchFaqList() // 삭제 후 목록을 다시 불러옴
                    })
                    .catch(error => {
                        Swal.fire({
                            title: '삭제 실패',
                            text: 'FAQ 삭제 중 오류가 발생했습니다.',
                            icon: 'error',
                            confirmButtonText: '확인',
                        })
                    })
            }
        })
    }

    return (
        <div className={styles.faqContainer}>
            {/* FAQ 리스트 */}
            <div className={styles.faqList}>
                {faqList.map((faq, index) => (
                    <div
                        key={index}
                        className={`${styles.faq} ${
                            expandedFaqIndex === index ? styles.active : ''
                        }`}
                    >
                        <div
                            className={styles.faqTitleContainer}
                            onClick={() => toggleFaq(index)}
                        >
                            {editIndex === index ? (
                                <>
                                    <textarea
                                        className={styles.faqTitle}
                                        value={faq.faq_title}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e =>
                                            handleInputChange(
                                                e,
                                                index,
                                                'faq_title'
                                            )
                                        }
                                        maxLength="100"
                                    />
                                </>
                            ) : (
                                <div className={styles.faqTitle}>
                                    {faq.faq_title || '제목 없음'}
                                </div>
                            )}
                            <button
                                className={styles.faqToggle}
                                onClick={e => {
                                    e.stopPropagation() // 버튼 클릭 시 이벤트가 상위로 전파되지 않도록 함
                                    toggleFaq(index)
                                }}
                            >
                                {expandedFaqIndex === index ? (
                                    <FaTimes />
                                ) : (
                                    <FaChevronDown />
                                )}
                            </button>
                        </div>

                        {expandedFaqIndex === index && (
                            <div className={styles.faqText}>
                                {editIndex === index ? (
                                    <>
                                        <textarea
                                            className={styles.faqContent}
                                            value={faq.faq_contents}
                                            onChange={e =>
                                                handleInputChange(
                                                    e,
                                                    index,
                                                    'faq_contents'
                                                )
                                            }
                                            maxLength="100"
                                        />
                                        <span className={styles.charCount}>
                                            {charCount[index]?.faq_contents ||
                                                0}
                                            /100
                                        </span>
                                    </>
                                ) : (
                                    <div className={styles.faqContent}>
                                        {faq.faq_contents || '내용 없음'}
                                    </div>
                                )}

                                {!isAdd && (
                                    <div className={styles.faqActionButtons}>
                                        {editIndex === index ? (
                                            <>
                                                <Button
                                                    size="s"
                                                    title="저장"
                                                    onClick={saveEditMode}
                                                />
                                                <Button
                                                    size="s"
                                                    title="취소"
                                                    onClick={cancelEditMode}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="s"
                                                    title="수정"
                                                    onClick={() =>
                                                        enterEditMode(index)
                                                    }
                                                />
                                                <Button
                                                    size="s"
                                                    title="삭제"
                                                    onClick={() =>
                                                        deleteFaqItem(index)
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.addfaqSection}>
                {isAdd ? (
                    <>
                        <Button
                            size="s"
                            title="등록"
                            onClick={handleRegister}
                        />
                        <Button size="s" title="취소" onClick={handleCancel} />
                    </>
                ) : (
                    <Button size="s" title="추가" onClick={addFaqItem} />
                )}
            </div>
        </div>
    )
}

export default Faq
