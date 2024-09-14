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
export const getComments = async (board_seq, member_id) => {
    try {
        console.log('보드 시퀀스:', board_seq, '멤버 아이디:', member_id) // 요청 전 파라미터 확인

        const response = await api.get(`/comment/getComments`, {
            params: { board_seq: board_seq, member_id: member_id },
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

export const sendCommentReport = async (commentSeq, reportCode, memberId) => {
    console.log({
        commentSeq,
        reportCode,
        memberId,
    })
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
