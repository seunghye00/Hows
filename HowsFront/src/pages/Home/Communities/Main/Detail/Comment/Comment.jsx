import React, { useState, useEffect } from 'react'
import {
    Editor,
    EditorState,
    ContentState,
    Modifier,
    CompositeDecorator,
    getDefaultKeyBinding,
    convertToRaw,
    RichUtils,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import styles from './Comment.module.css'
import { PiSiren } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../../../store/store'
import {
    toggleLikeAPI,
    sendReply,
    getReplies,
    updateReplyAPI, // Reply 업데이트 API 추가
} from '../../../../../../api/comment'
import { userInfo } from '../../../../../../api/member'
import { Reply } from './Reply/Reply'

// 링크 스타일을 적용하는 컴포넌트
const TagLink = props => {
    const navigate = useNavigate()
    return (
        <span
            className={styles.tagLink}
            onClick={() =>
                navigate(
                    `/profile/${
                        props.contentState.getEntity(props.entityKey).getData()
                            .id
                    }`
                )
            } // 엔티티에서 ID 추출 후 프로필로 이동
            style={{ color: 'blue', cursor: 'pointer' }}
        >
            {props.children}
        </span>
    )
}

// Draft.js 데코레이터: `@태그`를 감지해서 스타일을 적용
const findTagEntities = (contentBlock, callback, contentState) => {
    const text = contentBlock.getText()
    const tagRegex = /@\w+/g
    let matchArr, start
    while ((matchArr = tagRegex.exec(text)) !== null) {
        start = matchArr.index
        callback(start, start + matchArr[0].length)
    }
}

// 엔티티가 추가된 데코레이터 정의
const decorator = new CompositeDecorator([
    {
        strategy: findTagEntities,
        component: TagLink,
    },
])

// 날짜 형식을 처리하는 유틸리티 함수
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

// Comment 컴포넌트는 각 댓글과 답글 기능을 관리합니다.
export const Comment = ({
    commentData,
    handleOpenReportModalForComment,
    handleUpdateComment,
    handleDeleteComment,
}) => {
    const navigate = useNavigate()
    const { isAuth } = useAuthStore()
    const member_id = sessionStorage.getItem('member_id')
    const isOwner = isAuth && member_id === commentData?.MEMBER_ID
    const [isEditing, setIsEditing] = useState(false)
    const [isLiked, setIsLiked] = useState(commentData.isLiked || false)
    const [likeCount, setLikeCount] = useState(commentData.LIKE_COUNT || 0)

    const [editedComment, setEditedComment] = useState(
        EditorState.createWithContent(
            ContentState.createFromText(commentData.COMMENT_CONTENTS),
            decorator
        )
    )

    const [replyContent, setReplyContent] = useState(
        EditorState.createEmpty(decorator)
    )
    const [replies, setReplies] = useState([])
    const [activeReplySeq, setActiveReplySeq] = useState(null)
    const [userProfile, setUserProfile] = useState('')
    const [showAllReplies, setShowAllReplies] = useState(false)
    const [editingReplySeq, setEditingReplySeq] = useState(null)

    // 유저 프로필 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (member_id) {
                try {
                    const response = await userInfo(member_id)
                    setUserProfile(response.data.member_avatar)
                } catch (error) {
                    console.error('유저 정보 불러오기 중 오류 발생:', error)
                }
            }
        }
        fetchUserInfo()
    }, [member_id])

    // 댓글에 달린 답글 불러오기
    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await getReplies(
                    commentData.COMMENT_SEQ,
                    member_id
                )
                setReplies(response.replies)
            } catch (error) {
                console.error('답글 불러오기 중 오류 발생:', error)
            }
        }
        fetchReplies()
    }, [commentData.COMMENT_SEQ, member_id])

    // 답글 업데이트 함수 (Reply 컴포넌트에 전달)
    const handleUpdateReply = async (replySeq, updatedContent) => {
        try {
            await updateReplyAPI(replySeq, updatedContent)
            const updatedReplies = replies.map(reply =>
                reply.REPLY_SEQ === replySeq
                    ? { ...reply, REPLY_CONTENTS: updatedContent }
                    : reply
            )
            setReplies(updatedReplies)
        } catch (error) {
            console.error('답글 수정 중 오류 발생:', error)
        }
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
            setIsLiked(updatedIsLiked)
            setLikeCount(updatedLikeCount)
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    const toggleReply = () => {
        setActiveReplySeq(prevSeq =>
            prevSeq === commentData.COMMENT_SEQ ? null : commentData.COMMENT_SEQ
        )
        const taggedContent = `@${commentData.NICKNAME} `
        const newState = Modifier.insertText(
            replyContent.getCurrentContent(),
            replyContent.getSelection(),
            taggedContent
        )
        const newEditorState = EditorState.push(
            replyContent,
            newState,
            'insert-characters'
        )
        setReplyContent(EditorState.moveFocusToEnd(newEditorState))
    }

    const handleReplySubmit = async replySeq => {
        const content = replyContent.getCurrentContent().getPlainText().trim()
        if (!content) return
        try {
            await sendReply(replySeq, content, member_id)
            setReplyContent(EditorState.createEmpty(decorator))
            setActiveReplySeq(null)
            const response = await getReplies(
                commentData.COMMENT_SEQ,
                member_id
            )
            setReplies(response.replies)
        } catch (error) {
            console.error('답글 작성 중 오류 발생:', error)
        }
    }

    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    const handleSaveEdit = () => {
        const content = editedComment.getCurrentContent().getPlainText()
        handleUpdateComment(commentData.COMMENT_SEQ, content)
        setIsEditing(false)
    }

    const handleDelete = () => {
        handleDeleteComment(commentData.COMMENT_SEQ)
    }

    const keyBindingFn = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            return 'submit-reply'
        }
        return getDefaultKeyBinding(e)
    }

    const handleKeyCommand = command => {
        if (command === 'submit-reply') {
            handleReplySubmit(commentData.COMMENT_SEQ)
            return 'handled'
        }
        return 'not-handled'
    }

    return (
        <div className={styles.commentCont}>
            <div className={styles.commentInfo}>
                <div className={styles.imgBox}>
                    <img src={commentData.MEMBER_AVATAR} alt="profile" />
                </div>
                <div className={styles.commentName}>
                    <a
                        onClick={() =>
                            navigate(`/profile/${commentData.MEMBER_ID}`)
                        }
                    >
                        {commentData.NICKNAME}
                    </a>
                </div>
            </div>

            <div className={styles.commentBox}>
                <div className={styles.commentTxt}>
                    {isEditing ? (
                        <Editor
                            editorState={editedComment}
                            onChange={setEditedComment}
                        />
                    ) : (
                        commentData.COMMENT_CONTENTS
                    )}
                </div>

                <div className={styles.btnBox}>
                    <div className={styles.replyBtnBox}>
                        <div className={styles.replyLeft}>
                            <div className={styles.commentDate}>
                                {formatDate(commentData.COMMENT_WRITE_DATE)}
                            </div>
                            <div
                                className={styles.btnLike}
                                onClick={handleLike}
                            >
                                <i
                                    className={
                                        isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                    }
                                ></i>
                                <span className={styles.likeCount}>
                                    {likeCount}
                                </span>
                            </div>
                            <div
                                className={styles.replyLeave}
                                onClick={toggleReply}
                            >
                                답글 달기
                            </div>
                        </div>

                        <div className={styles.replyRight}>
                            {isOwner && (
                                <>
                                    {isEditing ? (
                                        <>
                                            <div
                                                className={styles.btnSave}
                                                onClick={handleSaveEdit}
                                            >
                                                저장
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
                                                수정
                                            </div>
                                            <div
                                                className={styles.btnDelete}
                                                onClick={handleDelete}
                                            >
                                                삭제
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
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
                    </div>
                </div>

                {replies.length > 1 && (
                    <a
                        className={styles.toggleReplyBtn}
                        onClick={() => setShowAllReplies(!showAllReplies)}
                    >
                        {showAllReplies
                            ? '접기'
                            : `${replies.length}개 댓글 보기`}
                    </a>
                )}

                <div className={styles.replyList}>
                    {showAllReplies
                        ? replies.map(reply => (
                              <Reply
                                  key={reply.REPLY_SEQ}
                                  replyData={reply}
                                  handleReplyToggle={setActiveReplySeq}
                                  activeReplySeq={activeReplySeq}
                                  handleReplySubmit={handleReplySubmit}
                                  replyContent={replyContent}
                                  setReplyContent={setReplyContent}
                                  isOwner={isOwner}
                                  editingReplySeq={editingReplySeq}
                                  setEditingReplySeq={setEditingReplySeq}
                                  handleUpdateReply={handleUpdateReply} // 프롭스 전달
                              />
                          ))
                        : replies.slice(-1).map(reply => (
                              <Reply
                                  key={reply.REPLY_SEQ}
                                  replyData={reply}
                                  handleReplyToggle={setActiveReplySeq}
                                  activeReplySeq={activeReplySeq}
                                  handleReplySubmit={handleReplySubmit}
                                  replyContent={replyContent}
                                  setReplyContent={setReplyContent}
                                  isOwner={isOwner}
                                  editingReplySeq={editingReplySeq}
                                  setEditingReplySeq={setEditingReplySeq}
                                  handleUpdateReply={handleUpdateReply} // 프롭스 전달
                              />
                          ))}
                </div>

                {activeReplySeq === commentData.COMMENT_SEQ && (
                    <div className={styles.replyInputContainer}>
                        <div className={styles.imgBox}>
                            <img src={userProfile} alt="profile" />
                        </div>
                        <div className={styles.replyTextarea}>
                            <Editor
                                editorState={replyContent}
                                onChange={setReplyContent}
                                handleKeyCommand={handleKeyCommand}
                                keyBindingFn={keyBindingFn}
                                placeholder="답글을 입력하세요."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
