import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orderProductsDefault: [{
    product_seq: 0,
    product_title: "",
    product_image: "",
    product_quantity: 0,
    product_total_price: 0,
  }],

  orderProducts: [],
  setOrderProducts : data => set({ orderProducts : data }),

  orderPrice: 0,
  setOrderPrice: price => set({ orderPrice : price }),

  paymentInfoDefault: {
    orderName: "",
    totalAmount: 0,
  },

  paymentInfo: {},
  setPaymentInfo: param => set({ paymentInfo: param }),

  resetPaymentInfo: {

  }

}));