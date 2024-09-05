package com.hows.community.dto;

public class AreaSizeDTO {
	private String area_size_code;
	private String area_size_title;

	public AreaSizeDTO(String area_size_code, String area_size_title) {
		super();
		this.area_size_code = area_size_code;
		this.area_size_title = area_size_title;
	}

	AreaSizeDTO() {
		super();
	}

	public String getArea_size_code() {
		return area_size_code;
	}

	public void setArea_size_code(String area_size_code) {
		this.area_size_code = area_size_code;
	}

	public String getArea_size_title() {
		return area_size_title;
	}

	public void setArea_size_title(String area_size_title) {
		this.area_size_title = area_size_title;
	}

}
