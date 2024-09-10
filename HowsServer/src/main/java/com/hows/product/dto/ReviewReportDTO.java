package com.hows.product.dto;

import java.sql.Timestamp;

public class ReviewReportDTO {

	private int review_report_seq;
	private String report_code;
	private Timestamp review_report_date;
	private int review_seq;
	private String member_id;

	public ReviewReportDTO() {

	}

	public ReviewReportDTO(int review_report_seq, String report_code, Timestamp review_report_date, int review_seq,
			String member_id) {
		super();
		this.review_report_seq = review_report_seq;
		this.report_code = report_code;
		this.review_report_date = review_report_date;
		this.review_seq = review_seq;
		this.member_id = member_id;
	}

	public int getReview_report_seq() {
		return review_report_seq;
	}

	public void setReview_report_seq(int review_report_seq) {
		this.review_report_seq = review_report_seq;
	}

	public String getReport_code() {
		return report_code;
	}

	public void setReport_code(String report_code) {
		this.report_code = report_code;
	}

	public Timestamp getReview_report_date() {
		return review_report_date;
	}

	public void setReview_report_date(Timestamp review_report_date) {
		this.review_report_date = review_report_date;
	}

	public int getReview_seq() {
		return review_seq;
	}

	public void setReview_seq(int review_seq) {
		this.review_seq = review_seq;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

}
