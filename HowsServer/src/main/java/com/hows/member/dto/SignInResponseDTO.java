package com.hows.member.dto;

public class SignInResponseDTO {
	private String token;
	private String member_id;
	
	public SignInResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public SignInResponseDTO(String token, String member_id) {
		super();
		this.token = token;
		this.member_id = member_id;
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
	
	
}
