import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/return`

// 반품 상태 업데이트
export const updateReturn = (return_seq, return_code) => {
    return axios.put(`${baseUrl}/updateReturnCode`, null, {
        params: { return_seq, return_code },
    })
}

// 환불 완료
export const doneReturn = returnSeqs => {
    const seqs = returnSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.put(`${baseUrl}/doneReturn`, null, { params: { seqs } })
}
