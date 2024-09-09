package com.hows.payment.dto;

public class PaymentRequestDTO {
    private String paymentId;
    private int totalPrice;

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public PaymentRequestDTO() {}

    public PaymentRequestDTO(String paymentId, int totalPrice) {
        this.paymentId = paymentId;
        this.totalPrice = totalPrice;
    }
}
