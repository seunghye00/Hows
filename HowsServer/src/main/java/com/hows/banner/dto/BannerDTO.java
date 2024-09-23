package com.hows.banner.dto;

import java.sql.Date;

public class BannerDTO {
	private int banner_seq;
	private int file_seq;
	private String banner_url;
	private Date start_date;
	private Date end_date;
	private int banner_order;
	private String is_visible;
	private int connect_seq;
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
	public String getIs_visible() {
		return is_visible;
	}
	public void setIs_visible(String is_visible) {
		this.is_visible = is_visible;
	}
	public int getConnect_seq() {
		return connect_seq;
	}
	public void setConnect_seq(int connect_seq) {
		this.connect_seq = connect_seq;
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
	public BannerDTO(int banner_seq, int file_seq, String banner_url, Date start_date, Date end_date, int banner_order,
			String is_visible, int connect_seq) {
		super();
		this.banner_seq = banner_seq;
		this.file_seq = file_seq;
		this.banner_url = banner_url;
		this.start_date = start_date;
		this.end_date = end_date;
		this.banner_order = banner_order;
		this.is_visible = is_visible;
		this.connect_seq = connect_seq;
	}
	public BannerDTO() {
		super();
	}
}
