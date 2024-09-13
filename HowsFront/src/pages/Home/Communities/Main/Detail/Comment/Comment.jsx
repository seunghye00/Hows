import React, { useState, useEffect } from 'react'
import styles from './Comment.module.css'
import { PiSiren } from 'react-icons/pi'
import { useAuthStore } from '../../../../../../store/store'
import { toggleLikeAPI } from '../../../../../../api/comment' // 좋아요 처리 API 함수
import { useNavigate } from 'react-router-dom'
import { sendReply, getReplies } from '../../../../../../api/comment' // API 함수 불러오기
import { userInfo } from '../../../../../../api/member' // API 함수 불러오기

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

export const Comment = ({
    commentData,
    isReply = false, // 답글 여부
    handleOpenReportModalForComment,
    handleUpdateComment,
    handleDeleteComment,
}) => {
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    const { isAuth } = useAuthStore() // 로그인 여부
    const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기
    const isOwner = isAuth && member_id === commentData?.MEMBER_ID
    const [isEditing, setIsEditing] = useState(false) // 수정 상태 관리
    const [isLiked, setIsLiked] = useState(commentData.isLiked || false) // 서버에서 받은 좋아요 여부 상태
    const [likeCount, setLikeCount] = useState(commentData.LIKE_COUNT || 0) // 서버에서 받은 좋아요 수 상태
    const [editedComment, setEditedComment] = useState(
        commentData.COMMENT_CONTENTS
    ) // 수정된 댓글 내용
    const [replyOpen, setReplyOpen] = useState(false) // 댓글에서 답글 입력창 토글
    const [replyContent, setReplyContent] = useState('') // 답글 내용
    const [replies, setReplies] = useState(commentData.replies || []) // 답글 목록 상태
    const [replyInputOpen, setReplyInputOpen] = useState({}) // 답글들 각각에 대한 답글 입력창 토글 상태
    const [userProfile, setUserProfile] = useState('') // 유저 프로필 정보 상태
    const [showAllReplies, setShowAllReplies] = useState(false) // 더보기/접기 여부
    const [likeStatus, setLikeStatus] = useState({}) // 각 답글의 좋아요 상태
    const [replyEditingState, setReplyEditingState] = useState({}) // 답글 수정 상태

    // 유저 정보 불러오기 (세션에서 가져온 member_id로)
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (member_id) {
                try {
                    const response = await userInfo(member_id)
                    setUserProfile(response.data.member_avatar) // 유저 아바타 정보 가져오기
                } catch (error) {
                    console.error('유저 정보 불러오기 중 오류 발생:', error)
                }
            }
        }

        fetchUserInfo()
    }, [member_id])

    // 수정 모드를 토글하는 함수
    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    // 댓글 삭제 함수
    const handleSaveEdit = () => {
        handleUpdateComment(commentData.COMMENT_SEQ, editedComment) // 수정된 댓글 서버에 업데이트
        setIsEditing(false) // 수정 모드 종료
    }

    // 좋아요 처리 함수
    const handleLike = async () => {
        if (!isAuth) navigate('/signIn')
        try {
            const response = await toggleLikeAPI(
                commentData.COMMENT_SEQ,
                member_id
            )
            const { isLiked: updatedIsLiked, like_count: updatedLikeCount } =
                response.data

            setIsLiked(updatedIsLiked) // 서버에서 받은 좋아요 상태로 업데이트
            setLikeCount(updatedLikeCount) // 서버에서 받은 좋아요 수로 업데이트
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    // 댓글 삭제 완료 함수
    const handleDelete = () => {
        handleDeleteComment(commentData.COMMENT_SEQ) // 서버에서 댓글 삭제
    }

    // 답글 목록 가져오기
    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await getReplies(
                    commentData.COMMENT_SEQ,
                    member_id
                ) // 서버에서 해당 댓글의 답글 목록 불러오기
                setReplies(response.replies) // 답글 목록 업데이트
            } catch (error) {
                console.error('답글 불러오기 중 오류 발생:', error)
            }
        }

        fetchReplies() // 컴포넌트 마운트 시 답글 목록 불러오기
    }, [commentData.COMMENT_SEQ])

    // 답글 모드 토글
    const toggleReply = () => {
        setReplyOpen(!replyOpen)
    }

    // 답글에서 답글 달기 토글
    const toggleReplyInputForReply = replySeq => {
        setReplyInputOpen(prevState => ({
            ...prevState,
            [replySeq]: !prevState[replySeq], // 해당 답글의 답글 입력창 토글
        }))
    }

    // 엔터로 답글 제출 처리
    const handleReplyKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // 기본 엔터 키 동작 방지
            handleReplySubmit() // 답글 전송 함수 호출
        }
    }

    // 답글 작성 처리 함수
    const handleReplySubmit = async (commentSeq = commentData.COMMENT_SEQ) => {
        if (!replyContent.trim()) return // 내용이 없으면 제출하지 않음

        try {
            await sendReply(commentSeq, replyContent, member_id) // 답글 작성 API 호출
            setReplyContent('') // 입력창 초기화
            setReplyOpen(false) // 입력창 닫기
            setReplyInputOpen({}) // 답글 입력창 닫기

            // 답글 작성 후 답글 목록 다시 불러오기
            const response = await getReplies(
                commentData.COMMENT_SEQ,
                member_id
            )
            setReplies(response.replies) // 새로 받은 답글 목록으로 업데이트
        } catch (error) {
            console.error('답글 작성 중 오류 발생:', error)
        }
    }

    // 답글 수정 모드 토글 함수
    const toggleReplyEditMode = replySeq => {
        setReplyEditingState(prevState => ({
            ...prevState,
            [replySeq]: !prevState[replySeq], // 해당 답글의 수정 상태를 토글
        }))
    }

    // 답글 수정 저장 함수
    const handleSaveReplyEdit = async replySeq => {
        setReplyEditingState(prevState => ({
            ...prevState,
            [replySeq]: false, // 수정 후 다시 수정 모드 종료
        }))
    }

    // 답글 삭제 함수
    const handleDeleteReply = async replySeq => {
        // 답글 삭제 로직 추가
    }

    // 답글 수 1개일 땐 보이게 처리 1개 이상 시 더보기 생성
    const toggleShowAllReplies = () => {
        setShowAllReplies(prevState => !prevState)
    }

    return (
        <div className={styles.commentCont}>
            {/* 댓글 또는 답글의 프로필 이미지와 내용 */}
            <div className={styles.commentInfo}>
                <div className={styles.imgBox}>
                    <img src={commentData.MEMBER_AVATAR} alt="profile" />
                </div>
                <div className={styles.commentName}>{commentData.NICKNAME}</div>
            </div>
            <div className={styles.commentBox}>
                <div className={styles.commentTxt}>
                    {isEditing ? (
                        <textarea
                            value={editedComment}
                            className={styles.editInput}
                            onChange={e => {
                                if (e.target.value.length <= 300)
                                    setEditedComment(e.target.value)
                            }}
                            onInput={e => {
                                e.target.style.height = 'auto' // 높이를 자동으로 설정하여 이전 설정을 초기화
                                e.target.style.height = `${Math.min(
                                    e.target.scrollHeight,
                                    72
                                )}px` // 내용에 따라 높이를 조정, 최대 72px로 제한
                            }}
                        />
                    ) : (
                        commentData.COMMENT_CONTENTS
                    )}
                </div>
                <div className={styles.btnBox}>
                    <div className={styles.btnLeft}>
                        <div className={styles.commentDate}>
                            {commentData?.COMMENT_WRITE_DATE
                                ? formatDate(commentData.COMMENT_WRITE_DATE)
                                : '알 수 없음'}
                        </div>
                        {/* 좋아요, 신고, 수정, 삭제 등 공통 액션 */}
                        <div className={styles.btnLike} onClick={handleLike}>
                            <i
                                className={
                                    isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                }
                            ></i>
                            <span className={styles.likeCount}>
                                {likeCount}
                            </span>
                        </div>
                        <div className={styles.btnReply} onClick={toggleReply}>
                            답글 달기
                        </div>
                        {isOwner ? (
                            <>
                                {isEditing ? (
                                    <>
                                        <div
                                            className={styles.btnSave}
                                            onClick={handleSaveEdit}
                                        >
                                            <i className="bx bx-save"></i>
                                        </div>
                                        <div
                                            className={styles.btnCancel}
                                            onClick={toggleEditMode}
                                        >
                                            취소
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className={styles.btnEdit}
                                            onClick={toggleEditMode}
                                        >
                                            <i className="bx bx-edit"></i>
                                        </div>
                                        <div
                                            className={styles.btnDelete}
                                            onClick={handleDelete}
                                        >
                                            <i className="bx bx-trash"></i>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className={styles.reportComment}
                        onClick={() =>
                            handleOpenReportModalForComment(
                                commentData.COMMENT_SEQ
                            )
                        }
                    >
                        <PiSiren />
                        신고하기
                    </div>
                </div>

                {/* 답글 작성 UI */}
                {replyOpen && (
                    <div className={styles.replyInputContainer}>
                        <div className={styles.imgBox}>
                            <img src={userProfile} alt="profile" />
                        </div>
                        <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder="답글을 입력하세요."
                            className={styles.replyTextarea}
                            onKeyPress={handleReplyKeyPress} // 엔터로 제출
                            onInput={e => {
                                e.target.style.height = 'auto' // 높이를 자동으로 설정하여 초기화
                                e.target.style.height = `${Math.min(
                                    e.target.scrollHeight,
                                    72
                                )}px` // 최대 72px로 제한
                            }}
                        />
                    </div>
                )}

                {/* 답글 목록 렌더링 */}
                <div className={styles.replyList}>
                    {Array.isArray(replies) &&
                        replies.length > 0 &&
                        replies.map(reply => (
                            <div
                                key={reply.REPLY_SEQ}
                                className={styles.replyItem}
                            >
                                <div className={styles.replyCont}>
                                    <div className={styles.replyHeader}>
                                        <div className={styles.imgBox}>
                                            <img
                                                src={reply.MEMBER_AVATAR}
                                                alt={reply.NICKNAME}
                                            />
                                        </div>
                                        <div className={styles.replyNickname}>
                                            {reply.NICKNAME}
                                        </div>
                                    </div>
                                    <div className={styles.replyBox}>
                                        <div className={styles.replyTextCont}>
                                            {replyEditingState[
                                                reply.REPLY_SEQ
                                            ] ? (
                                                <textarea
                                                    value={editedComment}
                                                    className={styles.editInput}
                                                    onChange={e => {
                                                        if (
                                                            e.target.value
                                                                .length <= 300
                                                        )
                                                            setEditedComment(
                                                                e.target.value
                                                            )
                                                    }}
                                                />
                                            ) : (
                                                reply.REPLY_CONTENTS
                                            )}
                                        </div>
                                        <div className={styles.replyBtnBox}>
                                            <div className={styles.replyLeft}>
                                                <div
                                                    className={
                                                        styles.replyWriteDate
                                                    }
                                                >
                                                    {reply?.REPLY_DATE
                                                        ? formatDate(
                                                              reply.REPLY_DATE
                                                          )
                                                        : '알 수 없음'}
                                                </div>
                                                <div
                                                    className={styles.replyLike}
                                                >
                                                    <i
                                                        className={
                                                            likeStatus[
                                                                reply.REPLY_SEQ
                                                            ]
                                                                ? 'bx bxs-heart'
                                                                : 'bx bx-heart'
                                                        }
                                                    ></i>
                                                    <span
                                                        className={
                                                            styles.likeCount
                                                        }
                                                    >
                                                        {reply.LIKE_COUNT}
                                                    </span>
                                                </div>
                                                <div
                                                    onClick={() =>
                                                        toggleReplyInputForReply(
                                                            reply.REPLY_SEQ
                                                        )
                                                    }
                                                    className={
                                                        styles.replyLeave
                                                    }
                                                >
                                                    답글 달기
                                                </div>
                                            </div>
                                            {isAuth &&
                                                member_id ===
                                                    reply?.MEMBER_ID && (
                                                    <>
                                                        {replyEditingState[
                                                            reply.REPLY_SEQ
                                                        ] ? (
                                                            <>
                                                                <div
                                                                    className={
                                                                        styles.btnSave
                                                                    }
                                                                    onClick={() =>
                                                                        handleSaveReplyEdit(
                                                                            reply.REPLY_SEQ
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bx bx-save"></i>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.btnCancel
                                                                    }
                                                                    onClick={() =>
                                                                        toggleReplyEditMode(
                                                                            reply.REPLY_SEQ
                                                                        )
                                                                    }
                                                                >
                                                                    취소
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div
                                                                    className={
                                                                        styles.btnEdit
                                                                    }
                                                                    onClick={() =>
                                                                        toggleReplyEditMode(
                                                                            reply.REPLY_SEQ
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bx bx-edit"></i>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.btnDelete
                                                                    }
                                                                    onClick={() =>
                                                                        handleDeleteReply(
                                                                            reply.REPLY_SEQ
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bx bx-trash"></i>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            <div className={styles.replyRight}>
                                                <PiSiren />
                                                신고하기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* 답글에 답글 입력창 */}
                                {replyInputOpen[reply.REPLY_SEQ] && (
                                    <div className={styles.replyInputContainer}>
                                        <div className={styles.imgBox}>
                                            <img
                                                src={userProfile}
                                                alt="profile"
                                            />
                                        </div>
                                        <textarea
                                            value={replyContent}
                                            onChange={e =>
                                                setReplyContent(e.target.value)
                                            }
                                            placeholder="답글을 입력하세요."
                                            className={styles.replyTextarea}
                                            onKeyPress={handleReplyKeyPress} // 엔터로 제출
                                            onInput={e => {
                                                e.target.style.height = 'auto' // 높이를 자동으로 설정하여 초기화
                                                e.target.style.height = `${Math.min(
                                                    e.target.scrollHeight,
                                                    72
                                                )}px` // 최대 72px로 제한
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
