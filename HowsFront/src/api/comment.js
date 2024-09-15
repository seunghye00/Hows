import { api } from '../config/config'

// 댓글 작성 API 호출 함수
export const sendComments = async (board_seq, member_id, comment_contents) => {
    try {
        const response = await api.post('/comment/write', {
            board_seq,
            member_id,
            comment_contents,
        })
        return response.data
    } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error)
        throw error
    }
}
// 댓글 목록 출력 API 호출 함수
// export const getComments = async (board_seq, member_id) => {
//     try {
//         console.log('보드 시퀀스:', board_seq, '멤버 아이디:', member_id) // 요청 전 파라미터 확인

//         const response = await api.get(`/comment/getComments`, {
//             params: { board_seq: board_seq, member_id: member_id },
//         })
//         console.log('응답 데이터:', response.data) // 응답 데이터 확인
//         return response.data
//     } catch (error) {
//         console.error('댓글 불러오기 중 오류 발생:', error)
//         throw error
//     }
// }

// 댓글 목록 출력 API 호출 함수 (페이지네이션 반영)
export const getComments = async (board_seq, member_id, page, itemsPerPage) => {
    try {
        const response = await api.get(`/comment/getComments`, {
            params: {
                board_seq: board_seq,
                member_id: member_id,
                page: page,
                itemsPerPage: itemsPerPage,
            },
        })
        console.log('응답 데이터:', response.data) // 응답 데이터 확인
        return response.data
    } catch (error) {
        console.error('댓글 불러오기 중 오류 발생:', error)
        throw error
    }
}
// 댓글 수정 API 호출 함수
export const updateComment = async (comment_seq, updatedContent) => {
    try {
        const response = await api.put(`/comment/update`, {
            comment_seq, // 수정할 댓글의 ID
            comment_contents: updatedContent, // 수정된 내용
        })
        return response.data
    } catch (error) {
        console.error('댓글 수정 중 오류 발생:', error)
        throw error
    }
}

// 댓글 삭제 API 호출 함수
export const deleteComment = async comment_seq => {
    try {
        const response = await api.delete(`/comment/delete/${comment_seq}`)
        return response.data
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error)
        throw error
    }
}

// 댓글 좋아요 API 호출 함수
export const toggleLikeAPI = async (comment_seq, member_id) => {
    try {
        const response = await api.post(`/comment/${comment_seq}/like`, {
            member_id,
        })
        return response
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error)
        throw error
    }
}

// 댓글 신고 처리 API 호출 함수
export const sendCommentReport = async (commentSeq, reportCode, memberId) => {
    try {
        const response = await api.post('/comment/report', {
            comment_seq: commentSeq,
            report_code: reportCode,
            member_id: memberId,
        })
        return response.data
    } catch (error) {
        console.error('신고 요청 중 오류 발생:', error)
        throw error
    }
}

// 답글 작성 처리 API
export const sendReply = async (commentSeq, replyContent, member_id) => {
    try {
        const response = await api.post('/comment/reply', {
            comment_seq: commentSeq, // 해당 댓글의 시퀀스
            reply_content: replyContent, // 작성한 답글 내용
            member_id: member_id, // 답글 작성자의 ID
        })
        return response.data // 서버 응답 데이터 반환
    } catch (error) {
        console.error('답글 작성 중 오류 발생:', error)
        throw error
    }
}

// 답글 목록 불러오는 API
export const getReplies = async (commentSeq, member_id) => {
    try {
        const response = await api.get('/comment/repliesList', {
            params: {
                comment_seq: commentSeq,
                member_id: member_id, // 로그인된 유저 ID를 통해 좋아요 여부 확인
            },
        })
        return response.data // 서버에서 받은 답글 목록 반환
    } catch (error) {
        console.error('답글 목록 불러오기 중 오류 발생:', error)
        throw error
    }
}
// 답글 수정하는 API
export const updateReplyAPI = async (replySeq, content) => {
    try {
        const response = await api.put(`/comment/update/reply`, {
            reply_seq: replySeq,
            reply_contents: content, // 수정된 답글 내용
        })
        return response.data // 서버에서 수정된 답글 결과 반환
    } catch (error) {
        console.error('답글 수정 중 오류 발생:', error)
        throw error
    }
}

// 답글 삭제하는 API
export const deleteReplyAPI = async replySeq => {
    try {
        const response = await api.delete(
            `/comment/deleteReply/reply/${replySeq}`
        )
        return response.data
    } catch (error) {
        console.error('답글 삭제 중 오류 발생:', error)
        throw error
    }
}

// 답글 좋아요 API 호출 함수
export const toggleLikeReply = async (reply_seq, member_id) => {
    try {
        const response = await api.post(`/comment/reply/${reply_seq}/like`, {
            member_id,
        })
        console.log(response)
        return response
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error)
        throw error
    }
}

// 답글 신고 처리 API 호출 함수
export const sendReplyReport = async (replySeq, reportCode, memberId) => {
    try {
        const response = await api.post('/comment/report/reply', {
            reply_seq: replySeq,
            report_code: reportCode,
            member_id: memberId,
        })
        return response.data
    } catch (error) {
        console.error('신고 요청 중 오류 발생:', error)
        throw error
    }
}
/************************************  [ 관리자 기능 ] /************************************/

// 신고 댓글 조회 (관리자)
export const getReportedComments = async (startRow, endRow) => {
    try {
        const response = await api.get('/comment/reportedComments', {
            params: { startRow, endRow },
        })
        return response.data
    } catch (error) {
        console.error('신고 댓글 목록 조회 중 오류 발생:', error)
        throw error
    }
}

// 신고 내역 조회 (관리자)
export const getCommentReport = async comment_seq => {
    try {
        const response = await api.get(`/comment/commentReport/${comment_seq}`)
        return response.data
    } catch (error) {
        console.error('댓글 신고 내역 조회 중 오류 발생:', error)
        throw error
    }
}

// 신고 댓글 삭제 (관리자)
export const deleteCmt = async comment_seq => {
    try {
        const response = await api.delete(`/comment/deleteCmt/${comment_seq}`)
        return response.data
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error)
        throw error
    }
}

// 대댓글
// 신고 대댓글 조회 (관리자)
export const getReportedReplys = async (startRow, endRow) => {
    try {
        const response = await api.get('/comment/reportedReplys', {
            params: {
                startRow,
                endRow,
            },
        })
        return response.data
    } catch (error) {
        console.error('대댓글 조회 중 오류 발생:', error)
        throw error
    }
}

// 신고 내역 조회 (관리자)
export const getReplyReport = async reply_seq => {
    try {
        const response = await api.get(`/comment/replyReport/${reply_seq}`)
        return response.data
    } catch (error) {
        console.error('대댓글 신고 내역 조회 중 오류 발생:', error)
        throw error
    }
}

// 신고 대댓글 삭제 (관리자)
export const deleteReply = async reply_seq => {
    try {
        const response = await api.delete(`/comment/deleteReply/${reply_seq}`)
        return response.data
    } catch (error) {
        console.error('대댓글 삭제 중 오류 발생:', error)
        throw error
    }
}
