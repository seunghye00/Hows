import React, { useState, useEffect } from 'react'
import {
    Editor,
    EditorState,
    ContentState,
    Modifier,
    CompositeDecorator,
    getDefaultKeyBinding,
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
    deleteReply,
} from '../../../../../../api/comment'
import { userInfo } from '../../../../../../api/member'
import { Reply } from './Reply/Reply'
import Swal from 'sweetalert2'

// 링크 스타일을 적용하는 컴포넌트 (Draft.js에서 `@태그`에 스타일을 적용)
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
            } // 태그된 엔티티에서 ID를 추출 후 프로필로 이동
            style={{ color: 'blue', cursor: 'pointer' }}
        >
            {props.children} {/* `@태그`로 표시되는 텍스트 */}
        </span>
    )
}

// Draft.js 데코레이터: `@태그`를 감지해서 스타일을 적용
const findTagEntities = (contentBlock, callback, contentState) => {
    const text = contentBlock.getText() // 블록의 텍스트를 가져옴
    const tagRegex = /@\w+/g // `@`로 시작하는 단어를 찾는 정규식
    let matchArr, start
    while ((matchArr = tagRegex.exec(text)) !== null) {
        start = matchArr.index
        callback(start, start + matchArr[0].length) // 태그의 시작과 끝 인덱스를 반환
    }
}

// Draft.js 데코레이터 설정: `@태그`를 인식해서 스타일을 적용
const decorator = new CompositeDecorator([
    {
        strategy: findTagEntities,
        component: TagLink, // 태그된 텍스트를 링크로 표시
    },
])

// 날짜 형식을 처리하는 유틸리티 함수
const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return '오늘' // 하루 이내인 경우
    if (diffDays === 1) return '어제' // 어제인 경우
    if (diffDays <= 7) return `${diffDays}일 전` // 7일 이내인 경우
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}` // 7일 이상인 경우 연-월-일 형식 반환
}

// Comment 컴포넌트는 각 댓글과 답글 기능을 관리합니다.
export const Comment = ({
    commentData, // 댓글 데이터
    handleOpenReportModalForComment, // 댓글 신고 모달을 여는 함수
    handleUpdateComment, // 댓글 수정 함수
    handleDeleteComment, // 댓글 삭제 함수
    setIsModalOpen, // 상위 컴포넌트에서 전달받음
    setSelectedReplySeq, // 상위 컴포넌트에서 전달받음
}) => {
    const navigate = useNavigate() // 프로필 페이지로 이동을 위한 네비게이션 훅
    const { isAuth } = useAuthStore() // 로그인 여부를 확인하는 전역 상태
    const member_id = sessionStorage.getItem('member_id') // 로그인된 유저의 ID를 가져옴
    const isOwner = isAuth && member_id === commentData?.MEMBER_ID // 댓글 작성자가 현재 로그인된 유저인지 확인
    const [isEditing, setIsEditing] = useState(false) // 댓글 수정 모드 여부
    const [isLiked, setIsLiked] = useState(commentData.isLiked || false) // 좋아요 여부
    const [likeCount, setLikeCount] = useState(commentData.LIKE_COUNT || 0) // 좋아요 개수

    // 댓글 수정 시의 Draft.js 에디터 상태 (댓글 내용을 에디터로 관리)
    const [editedComment, setEditedComment] = useState(
        EditorState.createWithContent(
            ContentState.createFromText(commentData.COMMENT_CONTENTS), // 댓글 내용을 Draft.js의 ContentState로 변환
            decorator // 태그 데코레이터 적용
        )
    )

    // 답글 작성 시의 Draft.js 에디터 상태
    const [replyContent, setReplyContent] = useState(
        EditorState.createEmpty(decorator) // 빈 상태로 시작하며, 태그 데코레이터 적용
    )

    const [replies, setReplies] = useState([]) // 답글 목록을 상태로 관리
    const [activeReplySeq, setActiveReplySeq] = useState(null) // 활성화된 답글 입력창의 댓글 번호
    const [userProfile, setUserProfile] = useState('') // 유저 프로필 이미지
    const [showAllReplies, setShowAllReplies] = useState(false) // 모든 답글을 보여줄지 여부
    const [editingReplySeq, setEditingReplySeq] = useState(null) // 현재 수정 중인 답글의 seq 관리

    // 유저 프로필 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (member_id) {
                try {
                    const response = await userInfo(member_id) // 유저 정보 API 호출
                    setUserProfile(response.data.member_avatar) // 유저 프로필 이미지 설정
                } catch (error) {
                    console.error('유저 정보 불러오기 중 오류 발생:', error)
                }
            }
        }
        fetchUserInfo()
    }, [member_id]) // member_id가 변경될 때마다 실행

    // 댓글에 달린 답글 목록을 불러오기
    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await getReplies(
                    commentData.COMMENT_SEQ,
                    member_id
                )
                setReplies(response.replies) // 답글 목록 설정
            } catch (error) {
                console.error('답글 불러오기 중 오류 발생:', error)
            }
        }
        fetchReplies()
    }, [commentData.COMMENT_SEQ, member_id])

    // 답글 업데이트 함수 (Reply 컴포넌트에 전달)
    const handleUpdateReply = async (replySeq, updatedContent) => {
        try {
            await updateReplyAPI(replySeq, updatedContent) // 답글 수정 API 호출
            const updatedReplies = replies.map(reply =>
                reply.REPLY_SEQ === replySeq
                    ? { ...reply, REPLY_CONTENTS: updatedContent } // 해당 답글 업데이트
                    : reply
            )
            setReplies(updatedReplies) // 업데이트된 답글 목록 상태로 설정
        } catch (error) {
            console.error('답글 수정 중 오류 발생:', error)
        }
    }

    // 좋아요 처리 함수
    const handleLike = async () => {
        if (!isAuth) navigate('/signIn') // 로그인되지 않은 경우 로그인 페이지로 이동
        try {
            const response = await toggleLikeAPI(
                commentData.COMMENT_SEQ,
                member_id
            )
            const { isLiked: updatedIsLiked, like_count: updatedLikeCount } =
                response.data
            setIsLiked(updatedIsLiked) // 좋아요 상태 업데이트
            setLikeCount(updatedLikeCount) // 좋아요 개수 업데이트
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error)
        }
    }

    // 답글 입력창을 열거나 닫는 함수
    const toggleReply = () => {
        setActiveReplySeq(prevSeq =>
            prevSeq === commentData.COMMENT_SEQ ? null : commentData.COMMENT_SEQ
        )
        const taggedContent = `@${commentData.NICKNAME} ` // 답글 작성 시 태그된 내용
        const newState = Modifier.insertText(
            replyContent.getCurrentContent(),
            replyContent.getSelection(),
            taggedContent
        ) // Draft.js에서 답글 입력창에 태그된 텍스트 삽입
        const newEditorState = EditorState.push(
            replyContent,
            newState,
            'insert-characters'
        )
        setReplyContent(EditorState.moveFocusToEnd(newEditorState)) // 답글 입력창에 포커스 이동
    }

    // 답글 작성 함수
    const handleReplySubmit = async replySeq => {
        const content = replyContent.getCurrentContent().getPlainText().trim() // 입력된 답글 내용 가져오기
        if (!content) return
        try {
            await sendReply(replySeq, content, member_id) // 답글 전송 API 호출
            setReplyContent(EditorState.createEmpty(decorator)) // 답글 입력창 초기화
            setActiveReplySeq(null) // 답글 입력창 닫기
            const response = await getReplies(
                commentData.COMMENT_SEQ,
                member_id
            ) // 답글 목록 다시 불러오기
            setReplies(response.replies) // 답글 목록 업데이트
        } catch (error) {
            console.error('답글 작성 중 오류 발생:', error)
        }
    }

    // 댓글 수정 모드 토글
    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    // 댓글 수정 후 저장 처리
    const handleSaveEdit = () => {
        const content = editedComment.getCurrentContent().getPlainText() // 수정된 댓글 내용 가져오기
        handleUpdateComment(commentData.COMMENT_SEQ, content) // 수정된 댓글 저장
        setIsEditing(false) // 수정 모드 종료
    }

    // 댓글 삭제 처리
    const handleDelete = () => {
        handleDeleteComment(commentData.COMMENT_SEQ) // 댓글 삭제
    }

    // Draft.js 키 바인딩 함수 (엔터 키로 답글 전송 처리)
    const keyBindingFn = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            return 'submit-reply' // 엔터 키로 답글 전송
        }
        return getDefaultKeyBinding(e) // 기본 키 바인딩 처리
    }

    // Draft.js 커맨드 처리 (답글 전송 처리)
    const handleKeyCommand = command => {
        if (command === 'submit-reply') {
            handleReplySubmit(commentData.COMMENT_SEQ) // 답글 전송
            return 'handled'
        }
        return 'not-handled'
    }

    // 답글 삭제 처리 함수
    const handleDeleteReply = async replySeq => {
        try {
            const result = await Swal.fire({
                title: '정말로 삭제하시겠습니까?',
                text: '삭제 후에는 되돌릴 수 없습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '네, 삭제할래요!',
                cancelButtonText: '아니요, 취소할래요',
            })

            // 사용자가 '네, 삭제할래요!'를 선택한 경우에만 삭제 처리
            if (result.isConfirmed) {
                await deleteReply(replySeq) // 삭제 API 호출

                // 삭제 후 상태 업데이트 (해당 replySeq만 제거)
                setReplies(
                    replies.filter(reply => reply.REPLY_SEQ !== replySeq)
                )

                // 삭제 완료 메시지 표시
                Swal.fire({
                    title: '삭제 완료',
                    text: '답글이 삭제되었습니다.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                })
            }
        } catch (error) {
            console.error('답글 삭제 중 오류 발생:', error)
            Swal.fire({
                title: '오류 발생',
                text: '답글 삭제 중 문제가 발생했습니다. 다시 시도해주세요.',
                icon: 'error',
            })
        }
    }

    // 답글 신고 모달 열기
    const handleOpenReportModalForReply = replySeq => {
        setIsModalOpen(true) // 신고 모달을 열기 위한 상태 업데이트
        setSelectedReplySeq(replySeq) // 선택된 답글의 seq 저장
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
                        {commentData.NICKNAME} {/* 댓글 작성자의 닉네임 */}
                    </a>
                </div>
            </div>

            {/* 댓글 본문 */}
            <div className={styles.commentBox}>
                <div className={styles.commentTxt}>
                    {isEditing ? (
                        <Editor
                            editorState={editedComment}
                            onChange={setEditedComment} // 수정 중일 때 댓글 내용을 에디터로 표시
                        />
                    ) : (
                        commentData.COMMENT_CONTENTS // 수정 중이 아닐 때 댓글 내용 표시
                    )}
                </div>

                {/* 댓글 하단 버튼: 좋아요, 답글 달기, 수정/삭제 */}
                <div className={styles.btnBox}>
                    <div className={styles.replyBtnBox}>
                        <div className={styles.replyLeft}>
                            <div className={styles.commentDate}>
                                {formatDate(commentData.COMMENT_WRITE_DATE)}
                            </div>
                            <div
                                className={styles.btnLike}
                                onClick={handleLike} // 좋아요 클릭 처리
                            >
                                <i
                                    className={
                                        isLiked ? 'bx bxs-heart' : 'bx bx-heart'
                                    }
                                ></i>
                                <span className={styles.likeCount}>
                                    {likeCount} {/* 좋아요 개수 */}
                                </span>
                            </div>
                            <div
                                className={styles.replyLeave}
                                onClick={toggleReply} // 답글 입력창 열기
                            >
                                답글 달기
                            </div>
                        </div>

                        {/* 댓글 작성자만 수정/삭제 가능 */}
                        <div className={styles.replyRight}>
                            {isOwner && (
                                <>
                                    {isEditing ? (
                                        <>
                                            <div
                                                className={styles.btnSave}
                                                onClick={handleSaveEdit} // 댓글 수정 저장
                                            >
                                                저장
                                            </div>
                                            <div
                                                className={styles.btnCancel}
                                                onClick={toggleEditMode} // 수정 모드 취소
                                            >
                                                취소
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={styles.btnEdit}
                                                onClick={toggleEditMode} // 댓글 수정 모드 진입
                                            >
                                                수정
                                            </div>
                                            <div
                                                className={styles.btnDelete}
                                                onClick={handleDelete} // 댓글 삭제 처리
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
                                } // 댓글 신고 처리
                            >
                                <PiSiren />
                                신고하기
                            </div>
                        </div>
                    </div>
                </div>

                {/* 답글 목록 토글 버튼 (1개 이상의 답글이 있을 때만 표시) */}
                {replies.length > 1 && (
                    <a
                        className={styles.toggleReplyBtn}
                        onClick={() => setShowAllReplies(!showAllReplies)}
                    >
                        {showAllReplies
                            ? '접기'
                            : `${replies.length}개 댓글 보기`}{' '}
                        {/* 답글 보기/접기 */}
                    </a>
                )}

                {/* 답글 목록 */}
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
                                  member_id={member_id}
                                  editingReplySeq={editingReplySeq}
                                  setEditingReplySeq={setEditingReplySeq}
                                  handleUpdateReply={handleUpdateReply} // 답글 수정 처리
                                  handleDeleteReply={handleDeleteReply} // 답글 삭제 처리
                                  handleOpenReportModalForReply={
                                      handleOpenReportModalForReply
                                  } // 답글 신고 처리
                                  toggleReply={toggleReply} // toggleReply 함수 전달
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
                                  member_id={member_id}
                                  editingReplySeq={editingReplySeq}
                                  setEditingReplySeq={setEditingReplySeq}
                                  handleUpdateReply={handleUpdateReply} // 답글 수정 처리
                                  handleDeleteReply={handleDeleteReply} // 답글 삭제 처리
                                  handleOpenReportModalForReply={
                                      handleOpenReportModalForReply
                                  } // 답글 신고 처리
                                  toggleReply={toggleReply} // toggleReply 함수 전달
                              />
                          ))}
                </div>

                {/* 답글 입력창 (답글 달기 버튼을 클릭한 경우에만 표시) */}
                {activeReplySeq === commentData.COMMENT_SEQ && (
                    <div className={styles.replyInputContainer}>
                        <div className={styles.imgBox}>
                            <img src={userProfile} alt="profile" />
                        </div>
                        <div className={styles.replyTextarea}>
                            <Editor
                                editorState={replyContent} // Draft.js 에디터로 답글 입력창 관리
                                onChange={setReplyContent}
                                handleKeyCommand={handleKeyCommand} // 엔터 키로 답글 전송 처리
                                keyBindingFn={keyBindingFn} // 키 바인딩 처리
                                placeholder="답글을 입력하세요."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
