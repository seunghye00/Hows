import { api } from '../config/config'

// 이벤트 등록
export const insertEvt = formData => {
    return api.post('/event/insert', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

// 이벤트 조회
export const selectEvt = (startRow, endRow) => {
    return api.get('/event/list', {
        params: {
            startRow: startRow,
            endRow: endRow,
        },
    })
}

// 이벤트 상세조회
export const detailEvt = event_seq => {
    return api.get(`/event/detail/${event_seq}`)
}

// 이벤트 수정
export const modifyEvt = (event_seq, formData) => {
    return api.put(`/event/modify/${event_seq}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

// 이벤트 삭제
export const deleteEvt = event_seq => {
    return api.delete(`/event/delete/${event_seq}`)
}
