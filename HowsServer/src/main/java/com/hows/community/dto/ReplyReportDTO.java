package com.hows.community.dto;

import java.sql.Timestamp;

public class ReplyReportDTO {

	private int reply_report_seq;
	private String report_code;
	private Timestamp reply_report_date;
	private String member_id;
	private int reply_seq;

	public ReplyReportDTO() {

	}

	public ReplyReportDTO(int reply_report_seq, String report_code, Timestamp reply_report_date, String member_id,
			int reply_seq) {
		super();
		this.reply_report_seq = reply_report_seq;
		this.report_code = report_code;
		this.reply_report_date = reply_report_date;
		this.member_id = member_id;
		this.reply_seq = reply_seq;
	}

	public int getReply_report_seq() {
		return reply_report_seq;
	}

	public void setReply_report_seq(int reply_report_seq) {
		this.reply_report_seq = reply_report_seq;
	}

	public String getReport_code() {
		return report_code;
	}

	public void setReport_code(String report_code) {
		this.report_code = report_code;
	}

	public Timestamp getReply_report_date() {
		return reply_report_date;
	}

	public void setReply_report_date(Timestamp reply_report_date) {
		this.reply_report_date = reply_report_date;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

	public int getReply_seq() {
		return reply_seq;
	}

	public void setReply_seq(int reply_seq) {
		this.reply_seq = reply_seq;
	}

}
