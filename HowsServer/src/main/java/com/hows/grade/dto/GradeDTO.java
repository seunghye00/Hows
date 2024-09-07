package com.hows.grade.dto;

public class GradeDTO {
	private String gradecode;
	private String gradetitle;

	public GradeDTO() {
	}

	public GradeDTO(String gradecode, String gradetitle) {
		super();
		this.gradecode = gradecode;
		this.gradetitle = gradetitle;
	}

	public String getGradecode() {
		return gradecode;
	}

	public void setGradecode(String gradecode) {
		this.gradecode = gradecode;
	}

	public String getGradetitle() {
		return gradetitle;
	}

	public void setGradetitle(String gradetitle) {
		this.gradetitle = gradetitle;
	}

}
