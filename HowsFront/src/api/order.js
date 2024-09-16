import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/order`

// 주문 목록 요청 함수
export const orderList = status => {
    return axios.get(`${baseUrl}/listByStatus`, {
        params: { status }, // 쿼리 파라미터로 status를 전달
    })
}

// 주문, 주문목록 추가
export const addOrder = order => {
    return api.post(`/order`, order)
}

// 주문 상태 업데이트
export const updateOrder = (order_seq, order_code) => {
    return axios.put(`${baseUrl}/updateOrderCode`, null, {
        params: { order_seq, order_code },
    })
}

// 배송 시작
export const startDelivery = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.put(`${baseUrl}/startDelivery`, null, { params: { seqs } })
}

// 구매 확정 시작
export const doneOrder = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.put(`${baseUrl}/doneOrder`, null, { params: { seqs } })
}

// 주문 내역 삭제
export const deleteOrder = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.delete(`${baseUrl}`, { params: { seqs } })
}
