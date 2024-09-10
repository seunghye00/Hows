package com.hows.product.dto;

public class LikesDTO {
	private int product_like_seq;
	private int product_seq;
	private String member_id;
	
	public LikesDTO() {
		super();
	}
	public LikesDTO(int product_like_seq, int product_seq, String member_id) {
		super();
		this.product_like_seq = product_like_seq;
		this.product_seq = product_seq;
		this.member_id = member_id;
	}
	public int getProduct_like_seq() {
		return product_like_seq;
	}
	public void setProduct_like_seq(int product_like_seq) {
		this.product_like_seq = product_like_seq;
	}
	public int getProduct_seq() {
		return product_seq;
	}
	public void setProduct_seq(int product_seq) {
		this.product_seq = product_seq;
	}
	public String getMember_id() {
		return member_id;
	}
	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}
}
