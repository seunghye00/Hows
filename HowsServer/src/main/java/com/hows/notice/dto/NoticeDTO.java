package com.hows.notice.dto;

import java.sql.Timestamp;

public class NoticeDTO {

	private int notice_seq;
	private String notice_title;
	private String notice_contents;
	private Timestamp notice_date;
	private int view_count;
	private String notice_code;

	public NoticeDTO() {

	}

	public NoticeDTO(int notice_seq, String notice_title, String notice_contents, Timestamp notice_date, int view_count,
			String notice_code) {
		super();
		this.notice_seq = notice_seq;
		this.notice_title = notice_title;
		this.notice_contents = notice_contents;
		this.notice_date = notice_date;
		this.view_count = view_count;
		this.notice_code = notice_code;
	}

	public int getNotice_seq() {
		return notice_seq;
	}

	public void setNotice_seq(int notice_seq) {
		this.notice_seq = notice_seq;
	}

	public String getNotice_title() {
		return notice_title;
	}

	public void setNotice_title(String notice_title) {
		this.notice_title = notice_title;
	}

	public String getNotice_contents() {
		return notice_contents;
	}

	public void setNotice_contents(String notice_contents) {
		this.notice_contents = notice_contents;
	}

	public Timestamp getNotice_date() {
		return notice_date;
	}

	public void setNotice_date(Timestamp notice_date) {
		this.notice_date = notice_date;
	}

	public int getView_count() {
		return view_count;
	}

	public void setView_count(int view_count) {
		this.view_count = view_count;
	}

	public String getNotice_code() {
		return notice_code;
	}

	public void setNotice_code(String notice_code) {
		this.notice_code = notice_code;
	}

}
