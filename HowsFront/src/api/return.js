import { api } from '../config/config'

// 반품 상태 업데이트
export const updateReturn = (return_seq, return_code) => {
    return api.put('return/updateReturnCode', null, {
        params: { return_seq, return_code },
    })
}

// 환불 완료 요청
export const doneReturn = datas => {
    return api.put('/return/doneReturn', datas) // 데이터는 본문으로 전송
}
