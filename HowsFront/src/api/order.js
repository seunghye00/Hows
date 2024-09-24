import { api } from '../config/config'

// 주문 목록 요청 함수
export const orderList = status => {
    return api.get('/order/listByStatus', {
        params: { status }, // 쿼리 파라미터로 status를 전달
    })
}

// 반품 목록 요청 함수
export const returnList = () => {
    return api.get('order/getReturnList')
}

// 주문, 주문목록 추가
export const addOrder = async order => {
    return await api.post(`/order`, order)
}

// 주문 상태 업데이트
export const updateOrder = (order_seq, order_code) => {
    return api.put('/order/updateOrderCode', null, {
        params: { order_seq, order_code },
    })
}

// 배송 시작
export const startDelivery = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return api.put('order/startDelivery', null, { params: { seqs } })
}

// 구매 확정
export const doneOrder = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return api.put('order/doneOrder', null, { params: { seqs } })
}

// 주문 내역 삭제
export const deleteOrder = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return api.delete('/order', { params: { seqs } })
}

// 환불 처리 완료
export const doneReturn = orderSeqs => {
    const seqs = orderSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return api.put('/return/doneReturn', null, { params: { seqs } })
}
