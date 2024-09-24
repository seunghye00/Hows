package com.hows.member.dto;

public class SignInResponseDTO {
	private String token;
	private String member_id;
	private int member_seq;
    private String nickname;
    private String member_avatar;
    private String member_roleCode;

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getMember_avatar() {
		return member_avatar;
	}

	public void setMember_avatar(String member_avatar) {
		this.member_avatar = member_avatar;
	}

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

	public String getMember_roleCode() {
		return member_roleCode;
	}

	public void setMember_roleCode(String member_roleCode) {
		this.member_roleCode = member_roleCode;
	}

	public SignInResponseDTO() {}

	public SignInResponseDTO(String token, String member_id, int member_seq, String nickname, String member_avatar,
			String member_roleCode) {
		super();
		this.token = token;
		this.member_id = member_id;
		this.member_seq = member_seq;
		this.nickname = nickname;
		this.member_avatar = member_avatar;
		this.member_roleCode = member_roleCode;
	}
}
