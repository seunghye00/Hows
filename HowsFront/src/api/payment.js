import PortOne from "@portone/browser-sdk/v2";
import axios from "axios";
import {api, host} from "../config/config";

const baseUrl = `${host}/payment`

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

  const orderSeq = await api.post(`/order`, orderInfo);
  const paymentResult = {
    ...response,
    orderName,
    totalAmount,
    orderSeq
  }
  if(orderSeq > 0) return api.post(`/payment/complete`, paymentResult);
  else return null;

}