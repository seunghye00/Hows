package com.hows.role.dto;

public class RoleDTO {

	private String role_code;
	private String role_title;

	public RoleDTO() {
	}

	public RoleDTO(String role_code, String role_title) {
		super();
		this.role_code = role_code;
		this.role_title = role_title;
	}

	public String getRole_code() {
		return role_code;
	}

	public void setRole_code(String role_code) {
		this.role_code = role_code;
	}

	public String getRole_title() {
		return role_title;
	}

	public void setRole_title(String role_title) {
		this.role_title = role_title;
	}

}
