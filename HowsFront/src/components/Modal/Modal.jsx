import React from 'react'
import styles from './Modal.module.css'

export const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times; {/* 닫기 버튼 */}
                </button>
                <div className={styles.content}>
                    {children} {/* 자식 요소가 여기 렌더링됨 */}
                </div>
            </div>
        </div>
    )
}
