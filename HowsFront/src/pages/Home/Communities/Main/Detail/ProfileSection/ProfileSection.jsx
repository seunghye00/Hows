import React from 'react'
import { Button } from '../../../../../../components/Button/Button'
import styles from './ProfileSection.module.css'
import memberAvatar from './../../../../../../assets/images/cry.jpg'
import { useNavigate } from 'react-router-dom'

export const ProfileSection = () => {
    const navigate = useNavigate() // 페이지 전환을 위한 훅

    const handleModify = () => {
        navigate('/communities/post') // '/post' 페이지로 이동
    }

    const handleDelete = () => {}

    return (
        <div className={styles.profileSection}>
            <div className={styles.profileInfo}>
                <img
                    src={memberAvatar}
                    alt="Profile"
                    className={styles.avatar}
                />
                <div className={styles.nickname}>Moontari 96</div>
                <div className={styles.time}>2시간 전</div>
            </div>
            <div className={styles.actionButtons}>
                <Button title="수정" size="s" onClick={handleModify} />
                <Button title="삭제" size="s" />
                <Button title="팔로우" size="s" />
            </div>
        </div>
    )
}
