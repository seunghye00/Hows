package com.hows.order.dto;

import java.sql.Timestamp;

public class OrderDTO {
    private int order_seq;
    private int member_seq;
    private String order_code;
    private Timestamp order_date;
    private int order_price;

    public int getOrder_seq() {
        return order_seq;
    }

    public void setOrder_seq(int order_seq) {
        this.order_seq = order_seq;
    }

    public int getMember_seq() {
        return member_seq;
    }

    public void setMember_seq(int member_seq) {
        this.member_seq = member_seq;
    }

    public String getOrder_code() {
        return order_code;
    }

    public void setOrder_code(String order_code) {
        this.order_code = order_code;
    }

    public Timestamp getOrder_date() {
        return order_date;
    }

    public void setOrder_date(Timestamp order_date) {
        this.order_date = order_date;
    }

    public int getOrder_price() {
        return order_price;
    }

    public void setOrder_price(int order_price) {
        this.order_price = order_price;
    }

    public OrderDTO() {}

    public OrderDTO(int member_seq, int order_price) {
        this.member_seq = member_seq;
        this.order_price = order_price;
        this.order_code = "O1";
    }

    public OrderDTO(int order_seq, int member_seq, String order_code, Timestamp order_date, int order_price) {
        this.order_seq = order_seq;
        this.member_seq = member_seq;
        this.order_code = order_code;
        this.order_date = order_date;
        this.order_price = order_price;
    }
}
