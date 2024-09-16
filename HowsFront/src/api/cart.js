import { api } from '../config/config'

/** 상품 목록 **/
export const cartList = () => {
  return api.get(`/cart`);
}

/** 상품 추가 **/
export const addCart = (item) => {
  return api.post(`/cart`, item);
}

/** 상품 수량 변경 ( 수량, 가격 ) **/
export const updateCart = (item) => {
  return api.put(`/cart`, item);
}

/** 상품 삭제 **/
export const deleteCart = async (seq, type) => {
  if(!type) type = "cart";
  return await api.delete(`/cart/${seq}/${type}`);
}
