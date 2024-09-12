package com.hows.community.dto;

public class ReportDTO {
	private String report_code;
	private String report_description;
	public ReportDTO(String report_code, String report_description) {
		super();
		this.report_code = report_code;
		this.report_description = report_description;
	}
	public ReportDTO() {
		super();
	}
	public String getReport_code() {
		return report_code;
	}
	public void setReport_code(String report_code) {
		this.report_code = report_code;
	}
	public String getReport_description() {
		return report_description;
	}
	public void setReport_description(String report_description) {
		this.report_description = report_description;
	}
	
	
}
