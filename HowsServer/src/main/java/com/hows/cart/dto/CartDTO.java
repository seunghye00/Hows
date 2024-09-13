package com.hows.cart.dto;

import java.sql.Timestamp;

public class CartDTO {

    private int cart_seq;
    private int member_seq;
    private int product_seq;
    private int cart_quantity;
    private int cart_price;
    private Timestamp cart_date;

    public int getCart_seq() {
        return cart_seq;
    }

    public void setCart_seq(int cart_seq) {
        this.cart_seq = cart_seq;
    }

    public int getMember_seq() {
        return member_seq;
    }

    public void setMember_seq(int member_seq) {
        this.member_seq = member_seq;
    }

    public int getProduct_seq() {
        return product_seq;
    }

    public void setProduct_seq(int product_seq) {
        this.product_seq = product_seq;
    }

    public int getCart_quantity() {
        return cart_quantity;
    }

    public void setCart_quantity(int cart_quantity) {
        this.cart_quantity = cart_quantity;
    }

    public int getCart_price() {
        return cart_price;
    }

    public void setCart_price(int cart_price) {
        this.cart_price = cart_price;
    }

    public Timestamp getCart_date() {
        return cart_date;
    }

    public void setCart_date(Timestamp cart_date) {
        this.cart_date = cart_date;
    }

    public CartDTO(){}

    public CartDTO(int product_seq, int member_seq) {
        this.member_seq = member_seq;
        this.product_seq = product_seq;
    }

    public CartDTO(int cart_seq, int member_seq, int product_seq, int cart_quantity, int cart_price, Timestamp cart_date) {
        this.cart_seq = cart_seq;
        this.member_seq = member_seq;
        this.product_seq = product_seq;
        this.cart_quantity = cart_quantity;
        this.cart_price = cart_price;
        this.cart_date = cart_date;
    }
}