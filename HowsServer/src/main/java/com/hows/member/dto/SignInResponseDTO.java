package com.hows.member.dto;

public class SignInResponseDTO {
	private String token;
	private String member_id;
	private int member_seq;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

	public int getMember_seq() {
		return member_seq;
	}

	public void setMember_seq(int member_seq) {
		this.member_seq = member_seq;
	}

	public SignInResponseDTO() {}

	public SignInResponseDTO(String token, String member_id, int member_seq) {
		this.token = token;
		this.member_id = member_id;
		this.member_seq = member_seq;
	}
}
