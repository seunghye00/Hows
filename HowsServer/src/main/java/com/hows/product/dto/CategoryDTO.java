package com.hows.product.dto;

public class CategoryDTO {
	private String product_category_code;
	private String product_category_title;
	
	public CategoryDTO() {
		super();
	}
	public CategoryDTO(String product_category_code, String product_category_title) {
		super();
		this.product_category_code = product_category_code;
		this.product_category_title = product_category_title;
	}
	
	public String getProduct_category_code() {
		return product_category_code;
	}
	public void setProduct_category_code(String product_category_code) {
		this.product_category_code = product_category_code;
	}
	public String getProduct_category_title() {
		return product_category_title;
	}
	public void setProduct_category_title(String product_category_title) {
		this.product_category_title = product_category_title;
	}
}
