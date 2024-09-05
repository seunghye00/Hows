package com.hows.community.dto;

public class ColorDTO {
	private String color_code;
	private String color_title;

	ColorDTO(String color_code, String color_title) {
		super();
		this.color_code = color_code;
		this.color_title = color_title;
	}

	ColorDTO() {
		super();
	}

	public String getColor_code() {
		return color_code;
	}

	public void setColor_code(String color_code) {
		this.color_code = color_code;
	}

	public String getColor_title() {
		return color_title;
	}

	public void setColor_title(String color_title) {
		this.color_title = color_title;
	}

}
