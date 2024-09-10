import {api} from "../config/config";
import {addOrder} from "./order";

/** 결제 추가 **/
export const addPayment = (payment) => {
  return api.post(`/payment/complete`, payment)
}

/** 결제 시스템 ( PortOne ) **/
export const requestPaymentEvent = async(payment, orderInfo) => {
  const {REACT_APP_STORE_ID, REACT_APP_CHANNEL_KEY} = process.env;
  const { paymentId, orderName, totalAmount, payMethod, customer } = payment;

  // 결제 파라미터
  // const response = await PortOne.requestPayment({
  //   storeId: REACT_APP_STORE_ID,          // Store ID 설정
  //   channelKey: REACT_APP_CHANNEL_KEY,    // 채널 키 설정
  //   paymentId,                            // 결제 건을 구분하는 문자열 ( 결제 요청 및 조회에 필요 )
  //   orderName,                            // 주문 내용을 나타내는 문자열
  //   totalAmount,                          // 결제 금액
  //   currency: "KRW",                      // 결제 화폐
  //   payMethod,                            // 결제 수단
  //   customer                              // 구매자 정보
  // });

  // if(response.code != null) {
  //   return alert(response.message);
  // }

  const response = {
    paymentId:"how-510a3dba-b0dc-4c90-aba0-867b6b810fac",
    transactionType:"PAYMENT",
    txId:"0191d583-3f51-d60d-79ee-73eb634b4911"
  }

  const paymentResult = {
    ...response,
    orderName,
    totalAmount,
    orderSeq: 14
  }

  addPayment(paymentResult).then(res => {
      console.log("res ===== ", res);
  });

  // addOrder(orderInfo).then(res => {
  //   const paymentResult = {
  //     ...response,
  //     orderName,
  //     totalAmount,
  //     orderSeq: res.data
  //   }
  //   if(res.data > 0) {
  //     return addPayment(paymentResult);
  //   }
  //   else {
  //     // 결제 실패
  //     return null;
  //   }
  // });
}

