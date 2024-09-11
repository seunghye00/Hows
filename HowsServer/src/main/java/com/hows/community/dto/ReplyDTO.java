package com.hows.community.dto;

import java.sql.Timestamp;

public class ReplyDTO {
	private int reply_seq;
	private String reply_contents;
	private Timestamp reply_date;
	private int comment_seq;
	private String member_id;

	public ReplyDTO(int reply_seq, String reply_contents, Timestamp reply_date, int comment_seq, String member_id) {
		super();
		this.reply_seq = reply_seq;
		this.reply_contents = reply_contents;
		this.reply_date = reply_date;
		this.comment_seq = comment_seq;
		this.member_id = member_id;
	}

	public ReplyDTO() {
		super();
	}

	public int getReply_seq() {
		return reply_seq;
	}

	public void setReply_seq(int reply_seq) {
		this.reply_seq = reply_seq;
	}

	public String getReply_contents() {
		return reply_contents;
	}

	public void setReply_contents(String reply_contents) {
		this.reply_contents = reply_contents;
	}

	public Timestamp getReply_date() {
		return reply_date;
	}

	public void setReply_date(Timestamp reply_date) {
		this.reply_date = reply_date;
	}

	public int getComment_seq() {
		return comment_seq;
	}

	public void setComment_seq(int comment_seq) {
		this.comment_seq = comment_seq;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

}
