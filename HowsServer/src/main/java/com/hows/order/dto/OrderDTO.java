package com.hows.order.dto;

import java.sql.Timestamp;

public class OrderDTO {
    private int order_seq;
    private int member_seq;
    private String order_code;
    private Timestamp order_date;
    private int order_price;
    private String orderer_name;
    private String orderer_phone;
    private String orderer_zip_code;
    private String orderer_address;
    private String orderer_detail_address;

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

    public String getOrderer_name() {
        return orderer_name;
    }

    public void setOrderer_name(String orderer_name) {
        this.orderer_name = orderer_name;
    }

    public String getOrderer_phone() {
        return orderer_phone;
    }

    public void setOrderer_phone(String orderer_phone) {
        this.orderer_phone = orderer_phone;
    }

    public String getOrderer_zip_code() {
        return orderer_zip_code;
    }

    public void setOrderer_zip_code(String orderer_zip_code) {
        this.orderer_zip_code = orderer_zip_code;
    }

    public String getOrderer_address() {
        return orderer_address;
    }

    public void setOrderer_address(String orderer_address) {
        this.orderer_address = orderer_address;
    }

    public String getOrderer_detail_address() {
        return orderer_detail_address;
    }

    public void setOrderer_detail_address(String orderer_detail_address) {
        this.orderer_detail_address = orderer_detail_address;
    }

    public OrderDTO() {}

    public OrderDTO(int member_seq, int order_price, String orderer_name, String orderer_phone, String orderer_zip_code, String orderer_address, String orderer_detail_address) {
        this.member_seq = member_seq;
        this.order_code = "O1";
        this.order_price = order_price;
        this.orderer_name = orderer_name;
        this.orderer_phone = orderer_phone;
        this.orderer_zip_code = orderer_zip_code;
        this.orderer_address = orderer_address;
        this.orderer_detail_address = orderer_detail_address;
    }

    public OrderDTO(int order_seq, int member_seq, String order_code, Timestamp order_date, int order_price, String orderer_name, String orderer_phone, String orderer_zip_code, String orderer_address, String orderer_detail_address) {
        this.order_seq = order_seq;
        this.member_seq = member_seq;
        this.order_code = order_code;
        this.order_date = order_date;
        this.order_price = order_price;
        this.orderer_name = orderer_name;
        this.orderer_phone = orderer_phone;
        this.orderer_zip_code = orderer_zip_code;
        this.orderer_address = orderer_address;
        this.orderer_detail_address = orderer_detail_address;
    }
}
