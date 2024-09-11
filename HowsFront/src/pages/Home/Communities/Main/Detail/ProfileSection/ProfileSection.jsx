import React from 'react'
import { Button } from '../../../../../../components/Button/Button'
import styles from './ProfileSection.module.css'
import memberAvatar from './../../../../../../assets/images/cry.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../../../store/store'

// 날짜 형식 변환 함수
const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()

    // 시간 차이 계산 (밀리초)
    const diffTime = now - date

    // 일(day)로 변환
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // 7일 이내일 경우 "몇일 전"으로 표기
    if (diffDays < 1) {
        return '오늘'
    } else if (diffDays === 1) {
        return '어제'
    } else if (diffDays <= 7) {
        return `${diffDays}일 전`
    } else {
        // 7일이 지난 경우 년월일로 표기
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
}

export const ProfileSection = ({ profileData }) => {
    const { isAuth, user } = useAuthStore() // 로그인 여부 및 로그인한 유저 정보
    const navigate = useNavigate() // 페이지 전환을 위한 훅

    const handleModify = () => {
        navigate('/communities/post') // '/post' 페이지로 이동
    }

    const handleDelete = () => {
        // 삭제 로직 처리
    }

    const handleFollow = () => {
        // 팔로우 로직 처리
    }

    const isOwner = isAuth && user?.member_id === profileData?.MEMBER_ID // 본인 여부 확인

    return (
        <div className={styles.profileSection}>
            <div className={styles.profileInfo}>
                <img
                    src={profileData?.MEMBER_AVATAR || memberAvatar}
                    alt="Profile"
                    className={styles.avatar}
                />
                <div className={styles.nickname}>
                    {profileData?.NICKNAME || 'Unknown'}
                </div>
                <div className={styles.time}>
                    {profileData?.BOARD_WRITE_DATE
                        ? formatDate(profileData.BOARD_WRITE_DATE)
                        : '알 수 없음'}
                </div>
            </div>
            <div className={styles.actionButtons}>
                {isOwner ? (
                    <>
                        <Button title="수정" size="s" onClick={handleModify} />
                        <Button title="삭제" size="s" onClick={handleDelete} />
                    </>
                ) : (
                    <Button title="팔로우" size="s" onClick={handleFollow} />
                )}
            </div>
        </div>
    )
}
