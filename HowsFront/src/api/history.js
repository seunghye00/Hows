import {api} from '../config/config'

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

