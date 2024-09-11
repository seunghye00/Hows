package com.hows.payment.dto;

public class PaymentRequestDTO {
    private String paymentId;
    private String transactionType;
    private String txId;
    private String orderName;
    private int totalAmount;
    private int orderSeq;

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getTxId() {
        return txId;
    }

    public void setTxId(String txId) {
        this.txId = txId;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public int getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getOrderSeq() {
        return orderSeq;
    }

    public void setOrderSeq(int orderSeq) {
        this.orderSeq = orderSeq;
    }

    public PaymentRequestDTO() {
    }

    public PaymentRequestDTO(String paymentId, String transactionType, String txId, String orderName, int totalAmount, int orderSeq) {
        this.paymentId = paymentId;
        this.transactionType = transactionType;
        this.txId = txId;
        this.orderName = orderName;
        this.totalAmount = totalAmount;
        this.orderSeq = orderSeq;
    }
}
