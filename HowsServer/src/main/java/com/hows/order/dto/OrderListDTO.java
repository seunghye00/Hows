package com.hows.order.dto;

public class OrderListDTO {

    private int order_list_seq;
    private int order_seq;
    private int product_seq;
    private int order_list_count;
    private int order_list_price;

    public int getOrder_list_seq() {
        return order_list_seq;
    }

    public void setOrder_list_seq(int order_list_seq) {
        this.order_list_seq = order_list_seq;
    }

    public int getOrder_seq() {
        return order_seq;
    }

    public void setOrder_seq(int order_seq) {
        this.order_seq = order_seq;
    }

    public int getProduct_seq() {
        return product_seq;
    }

    public void setProduct_seq(int product_seq) {
        this.product_seq = product_seq;
    }

    public int getOrder_list_count() {
        return order_list_count;
    }

    public void setOrder_list_count(int order_list_count) {
        this.order_list_count = order_list_count;
    }

    public int getOrder_list_price() {
        return order_list_price;
    }

    public void setOrder_list_price(int order_list_price) {
        this.order_list_price = order_list_price;
    }

    public OrderListDTO() {}

    public OrderListDTO(int order_list_seq, int order_seq, int product_seq, int order_list_count, int order_list_price) {
        this.order_list_seq = order_list_seq;
        this.order_seq = order_seq;
        this.product_seq = product_seq;
        this.order_list_count = order_list_count;
        this.order_list_price = order_list_price;
    }
}
