import React, { useState } from 'react'
import { FaChevronDown, FaTimes } from 'react-icons/fa'
import styles from './Faq.module.css'

const Faq = () => {
    const [faqList, setFaqList] = useState([]) // FAQ 리스트
    const [expandedFaqIndex, setExpandedFaqIndex] = useState(null) // 펼쳐진 FAQ 인덱스
    const [isAdd, setIsAdd] = useState(false) // 추가 모드 상태
    const [editIndex, setEditIndex] = useState(null) // 수정 모드 인덱스

    // FAQ 항목 토글
    const toggleFaq = index => {
        setExpandedFaqIndex(expandedFaqIndex === index ? null : index)
    }

    const handleInputChange = (e, index, field) => {
        const updatedFaqList = [...faqList]
        const newValue = e.target.innerText

        if (updatedFaqList[index][field] !== newValue) {
            updatedFaqList[index][field] = newValue
            setFaqList(updatedFaqList)
        }
    }

    // FAQ 삭제
    const deleteFaqItem = index => {
        const updatedFaqList = faqList.filter((_, i) => i !== index)
        setFaqList(updatedFaqList)
    }

    // FAQ 추가
    const addFaqItem = () => {
        const newFaq = { title: '제목', content: '답변 :' }
        const updatedFaqList = [...faqList, newFaq]
        setFaqList(updatedFaqList)
        setIsAdd(true)
        setEditIndex(updatedFaqList.length - 1)
    }

    // FAQ 등록
    const handleRegister = () => {
        setIsAdd(false)
        setEditIndex(null)
        setExpandedFaqIndex(null)
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

    // 수정 모드 취소
    const cancelEditMode = () => {
        setEditIndex(null)
    }

    // 수정 모드 저장
    const saveEditMode = () => {
        setEditIndex(null)
    }

    return (
        <div className={styles.faqContainer}>
            <div className={styles.headerSection}>
                <h2>FAQ</h2>
            </div>

            {/* FAQ 리스트 */}
            <div className={styles.faqList}>
                {faqList.map((faq, index) => (
                    <div
                        key={index}
                        className={`${styles.faq} ${
                            expandedFaqIndex === index ? styles.active : ''
                        }`}
                    >
                        <div className={styles.faqTitleContainer}>
                            <div
                                className={styles.faqTitle}
                                contentEditable={editIndex === index}
                                suppressContentEditableWarning={true}
                                onBlur={e =>
                                    handleInputChange(e, index, 'title')
                                }
                            >
                                {faq.title}
                            </div>
                            <button
                                className={styles.faqToggle}
                                onClick={() => toggleFaq(index)}
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
                                <div
                                    className={styles.faqContent}
                                    contentEditable={editIndex === index}
                                    suppressContentEditableWarning={true}
                                    onBlur={e =>
                                        handleInputChange(e, index, 'content')
                                    }
                                >
                                    {faq.content}
                                </div>

                                {!isAdd && (
                                    <div className={styles.faqActionButtons}>
                                        {editIndex === index ? (
                                            <>
                                                <button
                                                    className={styles.saveBtn}
                                                    onClick={saveEditMode}
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    className={styles.cancelBtn}
                                                    onClick={cancelEditMode}
                                                >
                                                    취소
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() =>
                                                        enterEditMode(index)
                                                    }
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() =>
                                                        deleteFaqItem(index)
                                                    }
                                                >
                                                    삭제
                                                </button>
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
                        <button
                            className={styles.saveBtn}
                            onClick={handleRegister}
                        >
                            등록
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <button className={styles.addfaq} onClick={addFaqItem}>
                        추가
                    </button>
                )}
            </div>
        </div>
    )
}

export default Faq
