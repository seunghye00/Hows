package com.hows.member.dto;

import java.sql.Timestamp;

public class GuestbookSubDTO {

	private int guestbook_seq;
	private String guestbook_contents;
	private Timestamp guestbook_write_date;
	private int member_seq;
	private String member_id;
	private String nickname; // member 테이블의 nickname 추가
	private String member_avatar;
	
	
	public GuestbookSubDTO() {
	}

	public GuestbookSubDTO(int guestbook_seq, String guestbook_contents, Timestamp guestbook_write_date, int member_seq,
			String member_id) {
		this.guestbook_seq = guestbook_seq;
		this.guestbook_contents = guestbook_contents;
		this.guestbook_write_date = guestbook_write_date;
		this.member_seq = member_seq;
		this.member_id = member_id;
	}
	
	public GuestbookSubDTO(int guestbook_seq, String guestbook_contents, Timestamp guestbook_write_date, int member_seq,
			String member_id, String nickname) {
		super();
		this.guestbook_seq = guestbook_seq;
		this.guestbook_contents = guestbook_contents;
		this.guestbook_write_date = guestbook_write_date;
		this.member_seq = member_seq;
		this.member_id = member_id;
		this.nickname = nickname;
	}


	public GuestbookSubDTO(int guestbook_seq, String guestbook_contents, Timestamp guestbook_write_date, int member_seq,
			String member_id, String nickname, String member_avatar) {
		super();
		this.guestbook_seq = guestbook_seq;
		this.guestbook_contents = guestbook_contents;
		this.guestbook_write_date = guestbook_write_date;
		this.member_seq = member_seq;
		this.member_id = member_id;
		this.nickname = nickname;
		this.member_avatar = member_avatar;
	}

	
	
	public String getMember_avatar() {
		return member_avatar;
	}

	public void setMember_avatar(String member_avatar) {
		this.member_avatar = member_avatar;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public int getGuestbook_seq() {
		return guestbook_seq;
	}
	public void setGuestbook_seq(int guestbook_seq) {
		this.guestbook_seq = guestbook_seq;
	}
	public String getGuestbook_contents() {
		return guestbook_contents;
	}
	public void setGuestbook_contents(String guestbook_contents) {
		this.guestbook_contents = guestbook_contents;
	}
	public Timestamp getGuestbook_write_date() {
		return guestbook_write_date;
	}
	public void setGuestbook_write_date(Timestamp guestbook_write_date) {
		this.guestbook_write_date = guestbook_write_date;
	}
	public int getMember_seq() {
		return member_seq;
	}
	public void setMember_seq(int member_seq) {
		this.member_seq = member_seq;
	}
	public String getMember_id() {
		return member_id;
	}
	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}
	
	
	
}
