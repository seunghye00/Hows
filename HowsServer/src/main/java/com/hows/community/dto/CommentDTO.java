package com.hows.community.dto;

import java.sql.Timestamp;

public class CommentDTO {
	private int comment_seq;
	private String comment_contents;
	private Timestamp comment_write_date;
	private int board_seq;
	private String member_id;

	public CommentDTO(int comment_seq, String comment_contents, Timestamp comment_write_date, int board_seq,
			String member_id) {
		super();
		this.comment_seq = comment_seq;
		this.comment_contents = comment_contents;
		this.comment_write_date = comment_write_date;
		this.board_seq = board_seq;
		this.member_id = member_id;
	}

	public CommentDTO() {
		super();
	}

	public int getComment_seq() {
		return comment_seq;
	}

	public void setComment_seq(int comment_seq) {
		this.comment_seq = comment_seq;
	}

	public String getComment_contents() {
		return comment_contents;
	}

	public void setComment_contents(String comment_contents) {
		this.comment_contents = comment_contents;
	}

	public Timestamp getComment_write_date() {
		return comment_write_date;
	}

	public void setComment_write_date(Timestamp comment_write_date) {
		this.comment_write_date = comment_write_date;
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
