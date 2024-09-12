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
export const getComments = async board_seq => {
    try {
        const response = await api.get(`/comment/getComments`, {
            params: { board_seq },
        })
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
/************************************  [ 관리자 기능 ] /************************************/

// 신고 댓글 조회 (관리자)

// 신고 내역 조회 (관리자)

// 신고 게시판 삭제 (관리자)
