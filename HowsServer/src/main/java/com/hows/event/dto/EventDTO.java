package com.hows.event.dto;

import java.sql.Timestamp;

public class EventDTO {

	private int event_seq;
	private String event_title;
	private String event_contents;
	private Timestamp event_date;
	private int view_count;
	private String notice_code;

	public EventDTO() {

	}

	public EventDTO(int event_seq, String event_title, String event_contents, Timestamp event_date, int view_count,
			String notice_code) {
		super();
		this.event_seq = event_seq;
		this.event_title = event_title;
		this.event_contents = event_contents;
		this.event_date = event_date;
		this.view_count = view_count;
		this.notice_code = notice_code;
	}

	public int getEvent_seq() {
		return event_seq;
	}

	public void setEvent_seq(int event_seq) {
		this.event_seq = event_seq;
	}

	public String getEvent_title() {
		return event_title;
	}

	public void setEvent_title(String event_title) {
		this.event_title = event_title;
	}

	public String getEvent_contents() {
		return event_contents;
	}

	public void setEvent_contents(String event_contents) {
		this.event_contents = event_contents;
	}

	public Timestamp getEvent_date() {
		return event_date;
	}

	public void setEvent_date(Timestamp event_date) {
		this.event_date = event_date;
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
