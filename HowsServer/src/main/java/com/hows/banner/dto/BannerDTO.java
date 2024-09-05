package com.hows.banner.dto;

import java.sql.Timestamp;

public class BannerDTO {
	private Long banner_seq;
	private String banner_url;
	private Timestamp start_date;
	private Timestamp end_date;
	private int banner_order;
	public Long getBanner_seq() {
		return banner_seq;
	}
	public void setBanner_seq(Long banner_seq) {
		this.banner_seq = banner_seq;
	}
	public String getBanner_url() {
		return banner_url;
	}
	public void setBanner_url(String banner_url) {
		this.banner_url = banner_url;
	}
	public Timestamp getStart_date() {
		return start_date;
	}
	public void setStart_date(Timestamp start_date) {
		this.start_date = start_date;
	}
	public Timestamp getEnd_date() {
		return end_date;
	}
	public void setEnd_date(Timestamp end_date) {
		this.end_date = end_date;
	}
	public int getBanner_order() {
		return banner_order;
	}
	public void setBanner_order(int banner_order) {
		this.banner_order = banner_order;
	}
	public BannerDTO(Long banner_seq, String banner_url, Timestamp start_date, Timestamp end_date, int banner_order) {
		super();
		this.banner_seq = banner_seq;
		this.banner_url = banner_url;
		this.start_date = start_date;
		this.end_date = end_date;
		this.banner_order = banner_order;
	}
	public BannerDTO() {
		super();
	}
}
