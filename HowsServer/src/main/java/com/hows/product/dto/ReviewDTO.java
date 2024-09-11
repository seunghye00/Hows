
package com.hows.product.dto;

import java.sql.Timestamp;

public class ReviewDTO {
	private int review_seq;
	private int rating;
//	review_contents -> 이미지,내용
	private String review_contents;
	private Timestamp review_date;
	private int product_seq;
	private String member_id;
	
	public ReviewDTO() {
		super();
	}
	public ReviewDTO(int review_seq, int rating, String review_contents, Timestamp review_date, int product_seq,
			String member_id) {
		super();
		this.review_seq = review_seq;
		this.rating = rating;
		this.review_contents = review_contents;
		this.review_date = review_date;
		this.product_seq = product_seq;
		this.member_id = member_id;
	}
	public int getReview_seq() {
		return review_seq;
	}
	public void setReview_seq(int review_seq) {
		this.review_seq = review_seq;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	public String getReview_contents() {
		return review_contents;
	}
	public void setReview_contents(String review_contents) {
		this.review_contents = review_contents;
	}
	public Timestamp getReview_date() {
		return review_date;
	}
	public void setReview_date(Timestamp review_date) {
		this.review_date = review_date;
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
