package com.hows.order.dto;

import java.sql.Timestamp;

public class ReturnDTO {
	private int order_seq; // 주문 seq
	private int return_seq; // 반품 seq
	private int payment_seq; // 결제 seq
	private Timestamp order_date; // 주문 일시
	private Timestamp payment_date; // 결제 일시
	private Timestamp done_delivery_date;	// 배송 완료 일시
	private Timestamp return_date; // 결재 취소 or 반품 일시
	private Timestamp done_return_date; // 환불 완료 일시
	private String order_name; // 주문명
	private String grade_title; // 회원 등급
	private String name; // 주문자명
	private int order_price; // 주문 금액
	private int payment_price; // 결제 금액
	private String return_code; // 반품 코드
	private String orderer_phone; // 주문자 폰번호
	private String payment_id; // 결재 id
	private String payment_text; // 결재 취소 이유
	public int getOrder_seq() {
		return order_seq;
	}
	public void setOrder_seq(int order_seq) {
		this.order_seq = order_seq;
	}
	public int getReturn_seq() {
		return return_seq;
	}
	public void setReturn_seq(int return_seq) {
		this.return_seq = return_seq;
	}
	public int getPayment_seq() {
		return payment_seq;
	}
	public void setPayment_seq(int payment_seq) {
		this.payment_seq = payment_seq;
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
	public Timestamp getReturn_date() {
		return return_date;
	}
	public void setReturn_date(Timestamp return_date) {
		this.return_date = return_date;
	}
	public Timestamp getDone_return_date() {
		return done_return_date;
	}
	public void setDone_return_date(Timestamp done_return_date) {
		this.done_return_date = done_return_date;
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
	public String getReturn_code() {
		return return_code;
	}
	public void setReturn_code(String return_code) {
		this.return_code = return_code;
	}
	public String getOrderer_phone() {
		return orderer_phone;
	}
	public void setOrderer_phone(String orderer_phone) {
		this.orderer_phone = orderer_phone;
	}
	public String getPayment_id() {
		return payment_id;
	}
	public void setPayment_id(String payment_id) {
		this.payment_id = payment_id;
	}
	public String getPayment_text() {
		return payment_text;
	}
	public void setPayment_text(String payment_text) {
		this.payment_text = payment_text;
	}
	public ReturnDTO(int return_seq, String return_code) {
		super();
		this.return_seq = return_seq;
		this.return_code = return_code;
	}
	public ReturnDTO(int return_seq, int order_seq, int payment_seq, String return_code) {
		super();
		this.return_seq = return_seq;
		this.order_seq = order_seq;
		this.payment_seq = payment_seq;
		this.return_code = return_code;
	}
	public ReturnDTO(int order_seq, int return_seq, Timestamp order_date, Timestamp payment_date,
			Timestamp done_delivery_date, Timestamp return_date, Timestamp done_return_date, String order_name,
			String grade_title, String name, int order_price, int payment_price, String return_code,
			String orderer_phone, String payment_id, String payment_text) {
		super();
		this.order_seq = order_seq;
		this.return_seq = return_seq;
		this.order_date = order_date;
		this.payment_date = payment_date;
		this.done_delivery_date = done_delivery_date;
		this.return_date = return_date;
		this.done_return_date = done_return_date;
		this.order_name = order_name;
		this.grade_title = grade_title;
		this.name = name;
		this.order_price = order_price;
		this.payment_price = payment_price;
		this.return_code = return_code;
		this.orderer_phone = orderer_phone;
		this.payment_id = payment_id;
		this.payment_text = payment_text;
	}
	public ReturnDTO() {
		super();
	}
}