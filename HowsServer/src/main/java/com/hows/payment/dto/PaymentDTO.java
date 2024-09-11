package com.hows.payment.dto;

import java.sql.Timestamp;

public class PaymentDTO {

    private int payment_seq;
    private int member_seq;
    private int order_seq;
    private String payment_code;
    private int payment_price;
    private Timestamp payment_date;
    private String payment_id;

    public int getPayment_seq() {
        return payment_seq;
    }

    public void setPayment_seq(int payment_seq) {
        this.payment_seq = payment_seq;
    }

    public int getMember_seq() {
        return member_seq;
    }

    public void setMember_seq(int member_seq) {
        this.member_seq = member_seq;
    }

    public int getOrder_seq() {
        return order_seq;
    }

    public void setOrder_seq(int order_seq) {
        this.order_seq = order_seq;
    }

    public String getPayment_code() {
        return payment_code;
    }

    public void setPayment_code(String payment_code) {
        this.payment_code = payment_code;
    }

    public int getPayment_price() {
        return payment_price;
    }

    public void setPayment_price(int payment_price) {
        this.payment_price = payment_price;
    }

    public Timestamp getPayment_date() {
        return payment_date;
    }

    public void setPayment_date(Timestamp payment_date) {
        this.payment_date = payment_date;
    }

    public String getPayment_id() {
        return payment_id;
    }

    public void setPayment_id(String payment_id) {
        this.payment_id = payment_id;
    }

    public PaymentDTO() {}

    public PaymentDTO(int member_seq, int order_seq, String payment_code, int payment_price, String payment_id) {
        this.member_seq = member_seq;
        this.order_seq = order_seq;
        this.payment_code = payment_code;
        this.payment_price = payment_price;
        this.payment_id = payment_id;
    }

    public PaymentDTO(int payment_seq, int member_seq, int order_seq, String payment_code, int payment_price, Timestamp payment_date, String payment_id) {
        this.payment_seq = payment_seq;
        this.member_seq = member_seq;
        this.order_seq = order_seq;
        this.payment_code = payment_code;
        this.payment_price = payment_price;
        this.payment_date = payment_date;
        this.payment_id = payment_id;
    }
}
