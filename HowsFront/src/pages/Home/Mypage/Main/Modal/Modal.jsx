import React from 'react'
import styles from './Modal.module.css'

export const Modal = ({ isOpen, onClose, modalType, children }) => {
    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times; {/* 닫기 버튼 */}
                </button>
                <div className={styles.content}>
                    <h2>{modalType === 'follower' ? '팔로워 목록' : '팔로잉 목록'}</h2>
                </div>
            </div>
        </div>
    )
}
