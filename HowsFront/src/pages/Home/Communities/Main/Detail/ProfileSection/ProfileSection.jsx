import React, { useState, useEffect } from 'react'
import { Button } from '../../../../../../components/Button/Button'
import styles from './ProfileSection.module.css'
import memberAvatar from './../../../../../../assets/images/cry.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../../../store/store'
import { toggleFollow, userInfo } from '../../../../../../api/member'
import Swal from 'sweetalert2'

// 날짜 형식 변환 함수
const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays <= 7) return `${diffDays}일 전`
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const ProfileSection = ({
    profileData,
    handleDeletePost, // 삭제 처리 함수 추가
    handleModify,
}) => {
    const { isAuth } = useAuthStore() // 로그인 여부
    const navigate = useNavigate()
    const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
    const [isFollowing, setIsFollowing] = useState(false) // 팔로우 상태
    const [memberSeq, setMemberSeq] = useState(null) // 로그인한 사용자의 member_seq 저장

    // 본인 여부 확인
    const isOwner = isAuth && member_id === profileData?.MEMBER_ID

    // 로그인한 사용자의 member_seq 가져오기
    useEffect(() => {
        const fetchMemberInfo = async () => {
            if (!member_id) {
                console.log('member_id가 없습니다. API 호출을 중단합니다.')
                return // member_id가 없으면 API 호출을 하지 않음
            }
            try {
                const response = await userInfo(member_id) // API 호출
                setMemberSeq(response.data.member_seq) // 멤버 데이터 상태에 저장
            } catch (error) {
                console.error('멤버 정보를 가져오는 중 오류 발생:', error)
            }
        }
        fetchMemberInfo()
    }, [member_id])

    // 팔로우 상태만 가져오는 함수
    const fetchFollowStatus = async () => {
        if (
            memberSeq &&
            profileData?.MEMBER_SEQ &&
            memberSeq !== profileData.MEMBER_SEQ
        ) {
            try {
                const response = await toggleFollow({
                    from_member_seq: memberSeq,
                    to_member_seq: profileData?.MEMBER_SEQ,
                    checkStatus: true, // 팔로우 상태 체크 플래그
                })
                setIsFollowing(response.data.isFollowing) // 팔로우 상태 업데이트
            } catch (error) {
                console.error('팔로우 상태를 가져오는 중 오류 발생:', error)
            }
        }
    }

    useEffect(() => {
        fetchFollowStatus()
    }, [memberSeq, profileData?.MEMBER_SEQ])

    const handleFollow = async () => {
        if (!isAuth) {
            navigate('/signIn')
            return
        }
        try {
            // 팔로우 상태를 토글
            const response = await toggleFollow({
                from_member_seq: memberSeq,
                to_member_seq: profileData?.MEMBER_SEQ,
                checkStatus: false, // 팔로우 상태 변경
            })
            if (response.data) {
                setIsFollowing(response.data.isFollowing) // 팔로우 상태 업데이트
            }
        } catch (error) {
            console.error('팔로우 처리 중 오류 발생:', error)
            alert('팔로우 처리 중 오류가 발생했습니다.')
        }
    }
    //마이페이지로 이동
    const goToUserPage = member_id => {
        navigate(`/mypage/main/${member_id}/post`) // member_id를 기반으로 마이페이지 경로 설정
    }

    return (
        <div className={styles.profileSection}>
            <div
                className={styles.profileInfo}
                onClick={() => goToUserPage(profileData?.MEMBER_ID)} // 클릭 시 마이페이지로 이동
            >
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
                        <Button
                            title="삭제"
                            size="s"
                            onClick={handleDeletePost}
                        />
                    </>
                ) : (
                    <Button
                        title={isFollowing ? '팔로잉' : '팔로우'}
                        size="s"
                        isChecked={isFollowing ? 'Y' : 'N'}
                        onClick={handleFollow}
                    />
                )}
            </div>
        </div>
    )
}
