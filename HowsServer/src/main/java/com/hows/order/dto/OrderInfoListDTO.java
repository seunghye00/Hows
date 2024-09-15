package com.hows.order.dto;

import java.sql.Timestamp;

// 주문에 관련된 정보들을 보관하기 위한 DTO
public class OrderInfoListDTO {
	private int order_seq; // 주문 seq
	private Timestamp order_date; // 주문 일시
	private Timestamp payment_date; // 결제 일시
	private Timestamp done_delivery_date;	// 배송 완료 일시
	private String order_name; // 주문명
	private String grade_title; // 회원 등급
	private String name; // 주문자명
	private int order_price; // 주문 금액
	private int payment_price; // 결제 금액
	private String order_code; // 주문 코드
	private String orderer_phone; // 주문자 폰번호
	private String orderer_zip_code; // 주문자 우편 번호
	private String orderer_address; // 주문자 집 주소
	private String orderer_detail_address; // 주문자 집 상세 주소

	public int getOrder_seq() {
		return order_seq;
	}

	public void setOrder_seq(int order_seq) {
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

	public Timestamp getDone_delivery_date() {
		return done_delivery_date;
	}

	public void setDone_delivery_date(Timestamp done_delivery_date) {
		this.done_delivery_date = done_delivery_date;
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

	public String getOrder_code() {
		return order_code;
	}

	public void setOrder_code(String order_code) {
		this.order_code = order_code;
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

	public OrderInfoListDTO(int order_seq, Timestamp order_date, Timestamp payment_date, Timestamp done_delivery_date,
			String order_name, String grade_title, String name, int order_price, int payment_price, String order_code,
			String orderer_phone, String orderer_zip_code, String orderer_address, String orderer_detail_address) {
		super();
		this.order_seq = order_seq;
		this.order_date = order_date;
		this.payment_date = payment_date;
		this.done_delivery_date = done_delivery_date;
		this.order_name = order_name;
		this.grade_title = grade_title;
		this.name = name;
		this.order_price = order_price;
		this.payment_price = payment_price;
		this.order_code = order_code;
		this.orderer_phone = orderer_phone;
		this.orderer_zip_code = orderer_zip_code;
		this.orderer_address = orderer_address;
		this.orderer_detail_address = orderer_detail_address;
	}

	public OrderInfoListDTO() {
		super();
	}
}
