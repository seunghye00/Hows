import PortOne from "@portone/browser-sdk";
import axios from "axios";
import {host} from "../config/config";

const baseUrl = `${host}/payment`

/** 결제 시스템 ( PortOne ) **/
const requestPayment = async(param) => {

  const {REACT_APP_STORE_ID, REACT_APP_CHANNEL_KEY} = process.env;

  const { paymentId, orderName, totalAmount, payMethod } = param;

  // 결제 파라미터
  const response = await PortOne.requestPayment({

    // Store ID 설정
    storeId: REACT_APP_STORE_ID,

    // 채널 키 설정
    channelKey: REACT_APP_CHANNEL_KEY,

    // 결제 건을 구분하는 문자열
    // 결제 요청 및 조회에 필요
    // paymentId에 대해 여러번의 결제 시도가 간능하나, 최종적으로 결제에 성공한느 것은 단 한번 가능 ( 중복 결제 방지 )
    paymentId: `payment-${crypto.randomUUID()}`,

    // 주문 내용을 나타내는 문자열
    // 형식은 없지만, 결제 처리에 필요하므로 필수적으로 전달
    orderName: "나이키 와플 트레이너 2 SD",

    // 결제 금액
    totalAmount: totalAmount,

    // 결제 화폐
    currency: "CURRENCY_KRW",

    // 결제 수단
    payMethod: "CARD",
  });

  console.log("response ==== ", JSON.stringify(response))

  // 오류 발생 시 code와 message가 생김
  if(response.code != null) {
    return alert(response.message);
  }

  const orderInfo = {
    paymentId,
    // DB에 들어갈 주문 정보
  }

  // payment/complet 엔드포인트 구현 필요
  axios(`${baseUrl}/complete`, orderInfo).then(res => {
    console.log("res ==== ", res);
  });
}