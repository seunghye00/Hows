import {api} from '../config/config'


/** History 회원 정보 **/
export const myInfo = () => {
  return api.get(`history`);
}

/** 구매내역 **/
export const myOrders = () => {
  return api.get(`/history/order`);
}

/** 리뷰 내역 **/
export const myReviews = () => {
  return api.get(`/history/review`);
}

/** 결제 및 주문 내역 **/
export const myPayments = () => {
  return api.get(`/history/payment`);
}

/** 결제 및 주문내역 디테일 **/
export const myPaymentsDetail = (seq) => {
  return api.get(`/history/order/${seq}`);
}

/** 결제 취소 & 환불 요청 **/
export const requestPayment = (params) => {
  return api.put(`/history/payment`, params);
}

/** 보유한 쿠폰 조회 **/
export const myCoupon = () => {
  return api.get(`/coupon/owner`);
}