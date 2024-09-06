package com.hows.order.dto;

import java.sql.Timestamp;

// 주문에 관련된 정보들을 보관하기 위한 DTO
public class OrderInfoListDTO {
	private int orders_seq;			// 주문 seq
	private Timestamp order_date;	// 주문 일시
	private String name;			// 주문자명
	private int order_price;		// 주문 금액
	private String order_title;		// 주문 상태
	public int getOrders_seq() {
		return orders_seq;
	}
	public void setOrders_seq(int orders_seq) {
		this.orders_seq = orders_seq;
	}
	public Timestamp getOrder_date() {
		return order_date;
	}
	public void setOrder_date(Timestamp order_date) {
		this.order_date = order_date;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getOrder_price() {
		return order_price;
	}
	public void setOrder_price(int order_price) {
		this.order_price = order_price;
	}
	public String getOrder_title() {
		return order_title;
	}
	public void setOrder_title(String order_title) {
		this.order_title = order_title;
	}
	public OrderInfoListDTO(int orders_seq, Timestamp order_date, String name, int order_price, String order_title) {
		super();
		this.orders_seq = orders_seq;
		this.order_date = order_date;
		this.name = name;
		this.order_price = order_price;
		this.order_title = order_title;
	}
	public OrderInfoListDTO() {
		super();
	}
}
