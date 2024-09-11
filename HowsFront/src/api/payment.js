import {api} from "../config/config";
import {addOrder} from "./order";
import {SwalComp} from "../commons/commons";
import PortOne from "@portone/browser-sdk/v2";

/** 결제 추가 **/
export const addPayment = (payment) => {
  return api.post(`/payment/complete`, payment)
}

/** 결제 시스템 ( PortOne ) **/
export const requestPaymentEvent = async(payment, orderInfo) => {
  const {REACT_APP_STORE_ID, REACT_APP_CHANNEL_KEY} = process.env;
  const { paymentId, orderName, totalAmount, payMethod, customer } = payment;

  // 결제 파라미터
  const response = await PortOne.requestPayment({
    storeId: REACT_APP_STORE_ID,          // Store ID 설정
    channelKey: REACT_APP_CHANNEL_KEY,    // 채널 키 설정
    paymentId,                            // 결제 건을 구분하는 문자열 ( 결제 요청 및 조회에 필요 )
    orderName,                            // 주문 내용을 나타내는 문자열
    totalAmount,                          // 결제 금액
    currency: "KRW",                      // 결제 화폐
    payMethod,                            // 결제 수단
    customer                              // 구매자 정보
  });

  // 결제 실패
  if(response.code != null) {
    if(response.code.toString() === "FAILURE_TYPE_PG") {
      return SwalComp({ type:"error", text: "결제를 취소하였습니다" });
    }
    return SwalComp({ type:"error", text: response.message });
  }

  // 주문 데이터 저장
  addOrder(orderInfo).then(res => {
    const paymentResult = {
      ...response,
      orderName,
      totalAmount,
      orderSeq: res.data
    }
    
    if(res.data > 0) {
      // 주문 데이터 저장 성공 시 결제 데이터 저장
      addPayment(paymentResult).then(resp => {

        // 결제 성공 로직
        console.log("resp.data ==== ", resp.data);

        // 세션 스토리지 정리
        sessionStorage.removeItem("howOrder");
        sessionStorage.removeItem("howPrice");

        return "ok";
      });
    } else {
      // 결제 실패
      return "fail";
    }
  });

  // 9월 11일 카카오 페이 테스트
  // const response = {
  //   paymentId: "how-6ea31167-a941-453e-b1cb-900e170961e9",
  //   transactionType: "PAYMENT",
  //   txId: "0191dfa8-6bca-c4e5-343a-f61d5874cc4d"
  // }


  // 9월 10일 삼성 앱카드 테스트
  // const response = {
  //   paymentId:"how-510a3dba-b0dc-4c90-aba0-867b6b810fac",
  //   transactionType:"PAYMENT",
  //   txId:"0191d583-3f51-d60d-79ee-73eb634b4911"
  // }
  //
  // const paymentResult = {
  //   ...response,
  //   orderName,
  //   totalAmount,
  //   orderSeq: 14
  // }
  //
  // addPayment(paymentResult).then(res => {
  //     console.log("res ===== ", res);
  // });
  //
  // return "ok";


}

