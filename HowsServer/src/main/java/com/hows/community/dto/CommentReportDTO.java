package com.hows.community.dto;

import java.sql.Timestamp;

public class CommentReportDTO {

	private int comment_report_seq;
	private String report_code;
	private Timestamp comment_report_date;
	private String member_id;
	private int comment_seq;

	public CommentReportDTO() {

	}

	public CommentReportDTO(int comment_report_seq, String report_code, Timestamp comment_report_date, String member_id,
			int comment_seq) {
		super();
		this.comment_report_seq = comment_report_seq;
		this.report_code = report_code;
		this.comment_report_date = comment_report_date;
		this.member_id = member_id;
		this.comment_seq = comment_seq;
	}

	public int getComment_report_seq() {
		return comment_report_seq;
	}

	public void setComment_report_seq(int comment_report_seq) {
		this.comment_report_seq = comment_report_seq;
	}

	public String getReport_code() {
		return report_code;
	}

	public void setReport_code(String report_code) {
		this.report_code = report_code;
	}

	public Timestamp getComment_report_date() {
		return comment_report_date;
	}

	public void setComment_report_date(Timestamp comment_report_date) {
		this.comment_report_date = comment_report_date;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

	public int getComment_seq() {
		return comment_seq;
	}

	public void setComment_seq(int comment_seq) {
		this.comment_seq = comment_seq;
	}

}
