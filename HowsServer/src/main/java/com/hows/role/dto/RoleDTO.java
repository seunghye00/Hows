package com.hows.role.dto;

public class RoleDTO {

	private String rolecode;
	private String roletitle;

	public RoleDTO() {
	}

	public RoleDTO(String rolecode, String roletitle) {
		super();
		this.rolecode = rolecode;
		this.roletitle = roletitle;
	}

	public String getRolecode() {
		return rolecode;
	}

	public void setRolecode(String rolecode) {
		this.rolecode = rolecode;
	}

	public String getRoletitle() {
		return roletitle;
	}

	public void setRoletitle(String roletitle) {
		this.roletitle = roletitle;
	}

}
