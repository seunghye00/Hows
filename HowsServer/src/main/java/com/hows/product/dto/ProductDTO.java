package com.hows.product.dto;

public class ProductDTO {
	private int product_seq;
	private String product_thumbnail;
	private String product_title;
	private String product_contents;
	private int price;
	private int quantity;
	private String product_category_code;
	private int review_count;
	private int total_sales;
	
	public ProductDTO() {
		super();
	}
	public ProductDTO(int product_seq, String product_thumbnail, String product_title, String product_contents,
			int price, int quantity, String product_category_code) {
		super();
		this.product_seq = product_seq;
		this.product_thumbnail = product_thumbnail;
		this.product_title = product_title;
		this.product_contents = product_contents;
		this.price = price;
		this.quantity = quantity;
		this.product_category_code = product_category_code;
	}
	public int getProduct_seq() {
		return product_seq;
	}
	public void setProduct_seq(int product_seq) {
		this.product_seq = product_seq;
	}
	public String getProduct_thumbnail() {
		return product_thumbnail;
	}
	public void setProduct_thumbnail(String product_thumbnail) {
		this.product_thumbnail = product_thumbnail;
	}
	public String getProduct_title() {
		return product_title;
	}
	public void setProduct_title(String product_title) {
		this.product_title = product_title;
	}
	public String getProduct_contents() {
		return product_contents;
	}
	public void setProduct_contents(String product_contents) {
		this.product_contents = product_contents;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public String getProduct_category_code() {
		return product_category_code;
	}
	public void setProduct_category_code(String product_category_code) {
		this.product_category_code = product_category_code;
	}
	public int getReview_count() {
		return review_count;
	}
	public void setReview_count(int review_count) {
		this.review_count = review_count;
	}
	public int getTotal_sales() {
		return total_sales;
	}
	public void setTotal_sales(int total_sales) {
		this.total_sales = total_sales;
	}
}
