package com.hows.coupon.dto;

import java.sql.Timestamp;

public class CouponDTO {

    private int coupon_seq;
    private String coupon_title;
    private String coupon_type;
    private String coupon_discount;
    private Timestamp Expired_date;

    public int getCoupon_seq() {
        return coupon_seq;
    }

    public void setCoupon_seq(int coupon_seq) {
        this.coupon_seq = coupon_seq;
    }

    public String getCoupon_title() {
        return coupon_title;
    }

    public void setCoupon_title(String coupon_title) {
        this.coupon_title = coupon_title;
    }

    public String getCoupon_type() {
        return coupon_type;
    }

    public void setCoupon_type(String coupon_type) {
        this.coupon_type = coupon_type;
    }

    public String getCoupon_discount() {
        return coupon_discount;
    }

    public void setCoupon_discount(String coupon_discount) {
        this.coupon_discount = coupon_discount;
    }

    public Timestamp getExpired_date() {
        return Expired_date;
    }

    public void setExpired_date(Timestamp expired_date) {
        Expired_date = expired_date;
    }

    public CouponDTO(){}

    public CouponDTO(int coupon_seq, String coupon_title, String coupon_type, String coupon_discount, Timestamp expired_date) {
        this.coupon_seq = coupon_seq;
        this.coupon_title = coupon_title;
        this.coupon_type = coupon_type;
        this.coupon_discount = coupon_discount;
        Expired_date = expired_date;
    }
}
