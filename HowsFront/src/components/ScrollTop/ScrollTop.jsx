import React, { useState, useEffect } from 'react'
import styles from './ScrollTop.module.css'

export const ScrollTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    // 스크롤 이벤트를 통해 버튼 보이기/숨기기 처리
    const toggleVisibility = () => {
        if (window.scrollY > 100) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    // 페이지 상단으로 이동하는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // 부드럽게 스크롤
        })
    }

    useEffect(() => {
        // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', toggleVisibility)

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    return (
        <div className={styles.scrollToTop}>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={styles.scrollBtn}
                ></button>
            )}
        </div>
    )
}
