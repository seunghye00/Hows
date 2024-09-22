import { api } from '../config/config'
import { addOrder } from './order'
import { SwalComp } from '../commons/commons'
import PortOne from '@portone/browser-sdk/v2'
import { deleteCart } from './cart'

/** 결제 추가 **/
export const addPayment = async payment => {
    return await api.post(`/payment/complete`, payment)
}

/** 결제 취소 & 환불 **/
export const cancelPayment = data => {
    return api.post(`/payment/cancel`, data)
}

/** 결제 실패 시 결제 취소 **/
export const paymentCancel = paymentId => {
    const data = {
        payment_id: paymentId,
        payment_text: 'payment cancel test',
    }
    return cancelPayment(data)
}

/** 결제 시스템 ( PortOne ) **/
export const requestPaymentEvent = async (payment, orderInfo) => {
    const { REACT_APP_STORE_ID, REACT_APP_CHANNEL_KEY } = process.env
    const { paymentId, orderName, totalAmount, payMethod, customer } = payment

    try {
        // 결제 요청
        const response = await PortOne.requestPayment({
            storeId: REACT_APP_STORE_ID, // Store ID 설정
            channelKey: REACT_APP_CHANNEL_KEY, // 채널 키 설정
            paymentId, // 결제 건을 구분하는 문자열 ( 결제 요청 및 조회에 필요 )
            orderName, // 주문 내용을 나타내는 문자열
            totalAmount, // 결제 금액
            currency: 'KRW', // 결제 화폐
            payMethod, // 결제 수단
            customer, // 구매자 정보
        })

        // 결제 실패
        if (response.code != null) {
            if (response.code.toString() === 'FAILURE_TYPE_PG')
                return response.message
            else return SwalComp({ type: 'error', text: response.message })
        }

        // 주문 데이터 저장
        try {
            const orderRes = await addOrder(orderInfo)
            const paymentReq = {
                ...response,
                orderName,
                totalAmount,
                orderSeq: orderRes.data,
            }

            if (orderRes.data > 0) {
                // 주문 데이터 저장 성공 시 결제 데이터 저장
                await addPayment(paymentReq)

                // 주문 완료한 목록 장바구니에서 삭제
                for (const item of orderInfo.orderProducts) {
                    await deleteCart(item.product_seq, 'saleSuccess')
                }

                // 세션 스토리지 정리
                sessionStorage.removeItem('howOrder')
                sessionStorage.removeItem('howPrice')

                return 'ok'
            } else {
                // 결제 실패
                paymentCancel(paymentId)
                return 'fail'
            }
        } catch (e) {
            console.error(e)
        }
    } catch (e) {
        console.error(e)
        return 'fail'
    }
}

/** 오늘 매출 조회 **/
export const todayPaymentPrice = () => {
    return api.get(`/payment/todayPaymentPrice`)
}
