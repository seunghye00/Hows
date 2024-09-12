package com.hows.order.dto;

import java.sql.Timestamp;

// 주문에 관련된 정보들을 보관하기 위한 DTO
public class OrderInfoListDTO {
	private int order_seq;			// 주문 seq
	private Timestamp order_date;	// 주문 일시
	private Timestamp payment_date; // 결제 일시
	private String order_name;		// 주문명
	private String grade_title;		// 회원 등급
	private String name;			// 주문자명
	private int order_price;		// 주문 금액
	private int payment_price;		// 결제 금액
	private String order_title;		// 주문 상태
	public int getOrder_seq() {
		return order_seq;
	}
	public void setOrders_seq(int order_seq) {
		this.order_seq = order_seq;
	}
	public Timestamp getOrder_date() {
		return order_date;
	}
	public void setOrder_date(Timestamp order_date) {
		this.order_date = order_date;
	}
	public Timestamp getPayment_date() {
		return payment_date;
	}
	public void setPayment_date(Timestamp payment_date) {
		this.payment_date = payment_date;
	}
	public String getOrder_name() {
		return order_name;
	}
	public void setOrder_name(String order_name) {
		this.order_name = order_name;
	}
	public String getGrade_title() {
		return grade_title;
	}
	public void setGrade_title(String grade_title) {
		this.grade_title = grade_title;
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
	public int getPayment_price() {
		return payment_price;
	}
	public void setPayment_price(int payment_price) {
		this.payment_price = payment_price;
	}
	public String getOrder_title() {
		return order_title;
	}
	public void setOrder_title(String order_title) {
		this.order_title = order_title;
	}
	public OrderInfoListDTO(int order_seq, Timestamp order_date, Timestamp payment_date, String order_name,
			String grade_title, String name, int order_price, int payment_price, String order_title) {
		super();
		this.order_seq = order_seq;
		this.order_date = order_date;
		this.payment_date = payment_date;
		this.order_name = order_name;
		this.grade_title = grade_title;
		this.name = name;
		this.order_price = order_price;
		this.payment_price = payment_price;
		this.order_title = order_title;
	}
	public OrderInfoListDTO() {
		super();
	}
}
