package com.hows.product.dto;

public class ImageDTO {
	private int review_image_seq;
	private int review_seq;
	private String image_url;
	private int image_order;
	
	public ImageDTO() {
		super();
	}
	public ImageDTO(int review_image_seq, int review_seq, String image_url, int image_order) {
		super();
		this.review_image_seq = review_image_seq;
		this.review_seq = review_seq;
		this.image_url = image_url;
		this.image_order = image_order;
	}
	
	public int getReview_image_seq() {
		return review_image_seq;
	}
	public void setReview_image_seq(int review_image_seq) {
		this.review_image_seq = review_image_seq;
	}
	public int getReview_seq() {
		return review_seq;
	}
	public void setReview_seq(int review_seq) {
		this.review_seq = review_seq;
	}
	public String getImage_url() {
		return image_url;
	}
	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}
	public int getImage_order() {
		return image_order;
	}
	public void setImage_order(int image_order) {
		this.image_order = image_order;
	}
	
	
	
}
