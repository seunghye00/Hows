package com.hows.banner.dto;

import java.sql.Date;
import java.sql.Timestamp;

public class BannerDTO {
	private int banner_seq;
	private int file_seq;
	private String banner_url;
	private Date start_date;
	private Date end_date;
	private int banner_order;
	public int getBanner_seq() {
		return banner_seq;
	}
	public void setBanner_seq(int banner_seq) {
		this.banner_seq = banner_seq;
	}
	public int getFile_seq() {
		return file_seq;
	}
	public void setFile_seq(int file_seq) {
		this.file_seq = file_seq;
	}
	public String getBanner_url() {
		return banner_url;
	}
	public void setBanner_url(String banner_url) {
		this.banner_url = banner_url;
	}
	public Date getStart_date() {
		return start_date;
	}
	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}
	public Date getEnd_date() {
		return end_date;
	}
	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}
	public int getBanner_order() {
		return banner_order;
	}
	public void setBanner_order(int banner_order) {
		this.banner_order = banner_order;
	}
	public BannerDTO(int banner_seq, int file_seq, String banner_url, Date start_date, Date end_date,
			int banner_order) {
		super();
		this.banner_seq = banner_seq;
		this.file_seq = file_seq;
		this.banner_url = banner_url;
		this.start_date = start_date;
		this.end_date = end_date;
		this.banner_order = banner_order;
	}
	public BannerDTO() {
		super();
	}
}
