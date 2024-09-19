package com.hows.coupon.dto;

import java.sql.Timestamp;

public class CouponOwnerDTO {

    private int coupon_owner_seq;
    private int member_seq;
    private int coupon_seq;
    private int order_seq;
    private Timestamp get_date;
    private Timestamp use_date;

    public int getCoupon_owner_seq() {
        return coupon_owner_seq;
    }

    public void setCoupon_owner_seq(int coupon_owner_seq) {
        this.coupon_owner_seq = coupon_owner_seq;
    }

    public int getMember_seq() {
        return member_seq;
    }

    public void setMember_seq(int member_seq) {
        this.member_seq = member_seq;
    }

    public int getCoupon_seq() {
        return coupon_seq;
    }

    public void setCoupon_seq(int coupon_seq) {
        this.coupon_seq = coupon_seq;
    }

    public int getOrder_seq() {
        return order_seq;
    }

    public void setOrder_seq(int order_seq) {
        this.order_seq = order_seq;
    }

    public Timestamp getGet_date() {
        return get_date;
    }

    public void setGet_date(Timestamp get_date) {
        this.get_date = get_date;
    }

    public Timestamp getUse_date() {
        return use_date;
    }

    public void setUse_date(Timestamp use_date) {
        this.use_date = use_date;
    }

    public CouponOwnerDTO() {}

    public CouponOwnerDTO(int order_seq, int coupon_owner_seq) {
        this.order_seq = order_seq;
        this.coupon_owner_seq = coupon_owner_seq;

    }

    public CouponOwnerDTO(int coupon_owner_seq, int member_seq, int coupon_seq, int order_seq, Timestamp get_date, Timestamp use_date) {
        this.coupon_owner_seq = coupon_owner_seq;
        this.member_seq = member_seq;
        this.coupon_seq = coupon_seq;
        this.order_seq = order_seq;
        this.get_date = get_date;
        this.use_date = use_date;
    }
}
