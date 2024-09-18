import React, { useState, useEffect } from 'react'
import styles from './Faq.module.css'
import { RxQuestionMarkCircled } from 'react-icons/rx'
import { selectAllFaq } from '../../../../api/faq' // FAQ 데이터를 가져오는 API

export const Faq = () => {
    const [faqList, setFaqList] = useState([]) // 서버에서 가져온 FAQ 데이터 상태
    // 각 FAQ 항목의 펼쳐짐 상태를 관리하는 state
    const [activeIndex, setActiveIndex] = useState(null)

    // FAQ 데이터를 서버에서 가져오는 함수
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await selectAllFaq() // API 호출
                console.log(response)
                setFaqList(response.data) // 가져온 데이터 상태에 설정
            } catch (error) {
                console.error('FAQ 데이터를 가져오는 중 오류 발생:', error)
            }
        }

        fetchFaqs() // 컴포넌트가 마운트될 때 FAQ 데이터를 가져옴
    }, [])

    // 항목 클릭 시 activeIndex 설정 함수
    const handleClick = index => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <div className={styles.faqCont}>
            {faqList.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                    <div
                        className={`${styles.faqQuestion} ${
                            activeIndex === index ? styles.activeQuestion : ''
                        }`}
                        onClick={() => handleClick(index)}
                    >
                        <div className={styles.faqBox}>
                            <RxQuestionMarkCircled />
                            {faq.faq_title} {/* FAQ 제목 */}
                        </div>
                        <i
                            className={`bx ${
                                activeIndex === index
                                    ? 'bx-chevron-up'
                                    : 'bx-chevron-down'
                            }`}
                        ></i>
                    </div>
                    <div
                        className={`${styles.faqAnswer} ${
                            activeIndex === index ? styles.active : ''
                        }`}
                    >
                        {faq.faq_contents} {/* FAQ 내용 */}
                    </div>
                </div>
            ))}
        </div>
    )
}
