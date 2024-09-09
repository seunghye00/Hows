package com.hows.payment.dto;

public class PaymentResponseDTO {

    private String paymentId;
    private String transactionType;
    private String txId;
    private String code;
    private String messgae;
    private Object body;

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessgae() {
        return messgae;
    }

    public void setMessgae(String messgae) {
        this.messgae = messgae;
    }

    public Object getBody() {
        return body;
    }

    public void setBody(Object body) {
        this.body = body;
    }

    public PaymentResponseDTO() {}

    public PaymentResponseDTO(String paymentId, String transactionType, String txId, String code, String messgae, Object body) {
        this.paymentId = paymentId;
        this.transactionType = transactionType;
        this.txId = txId;
        this.code = code;
        this.messgae = messgae;
        this.body = body;
    }
}
