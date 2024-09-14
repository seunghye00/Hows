import React from 'react'
import styles from './Modal.module.css'

export const Modal = ({ isOpen, onClose, children, modalType, modalContent = [] }) => {
    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times; {/* 닫기 버튼 */}
                </button>

                <div className={styles.content}>
                    {children}
                    <h2>{modalType === 'follower' ? '팔로워 목록' : '팔로잉 목록'}</h2>
                    <ul>
                        {modalContent.length > 0 ? (
                            modalContent.map((item, index) => (
                                <li key={index}>{item.nickname}</li>
                            ))
                        ) : (
                            <p>목록이 없습니다.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
