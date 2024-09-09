package com.hows.grade.dto;

public class GradeDTO {
	private String grade_code;
	private String grade_title;

	public GradeDTO() {
	}

	public GradeDTO(String grade_code, String grade_title) {
		super();
		this.grade_code = grade_code;
		this.grade_title = grade_title;
	}

	public String getGrade_code() {
		return grade_code;
	}

	public void setGrade_code(String grade_code) {
		this.grade_code = grade_code;
	}

	public String getGrade_title() {
		return grade_title;
	}

	public void setGrade_title(String grade_title) {
		this.grade_title = grade_title;
	}

}
