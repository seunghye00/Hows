package com.hows.community.dto;

import java.sql.Timestamp;

public class BoardReportDTO {

	private int board_report_seq;
	private String report_code;
	private Timestamp board_report_date;
	private int board_seq;
	private String member_id;

	public BoardReportDTO() {

	}

	public BoardReportDTO(int board_report_seq, String report_code, Timestamp board_report_date, int board_seq,
			String member_id) {
		super();
		this.board_report_seq = board_report_seq;
		this.report_code = report_code;
		this.board_report_date = board_report_date;
		this.board_seq = board_seq;
		this.member_id = member_id;
	}

	public int getBoard_report_seq() {
		return board_report_seq;
	}

	public void setBoard_report_seq(int board_report_seq) {
		this.board_report_seq = board_report_seq;
	}

	public String getReport_code() {
		return report_code;
	}

	public void setReport_code(String report_code) {
		this.report_code = report_code;
	}

	public Timestamp getBoard_report_date() {
		return board_report_date;
	}

	public void setBoard_report_date(Timestamp board_report_date) {
		this.board_report_date = board_report_date;
	}

	public int getBoard_seq() {
		return board_seq;
	}

	public void setBoard_seq(int board_seq) {
		this.board_seq = board_seq;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

}
