import { api } from '../config/config'

// 공지사항 등록
export const insertNtc = formData => {
    return api.post('/notice/insert', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

// 공지사항 조회
export const selectNtc = (startRow, endRow) => {
    return api.get('/notice/list', {
        params: {
            startRow: startRow,
            endRow: endRow,
        },
    })
}

// 공지사항 상세조회
export const detailNtc = notice_seq => {
    return api.get(`/notice/detail/${notice_seq}`)
}

// 공지사항 수정
export const modifyNtc = (notice_seq, formData) => {
    return api.put(`/notice/modify/${notice_seq}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

// 공지사항 삭제
export const deleteNtc = notice_seq => {
    return api.delete(`/notice/delete/${notice_seq}`)
}
