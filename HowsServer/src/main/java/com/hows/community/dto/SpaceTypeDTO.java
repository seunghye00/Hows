package com.hows.community.dto;

public class SpaceTypeDTO {
	private String space_type_code;
	private String space_type_title;

	SpaceTypeDTO(String space_type_code, String space_type_title) {
		super();
		this.space_type_code = space_type_code;
		this.space_type_title = space_type_title;
	}

	SpaceTypeDTO() {
		super();
	}

	public String getSpace_type_code() {
		return space_type_code;
	}

	public void setSpace_type_code(String space_type_code) {
		this.space_type_code = space_type_code;
	}

	public String getSpace_type_title() {
		return space_type_title;
	}

	public void setSpace_type_title(String space_type_title) {
		this.space_type_title = space_type_title;
	}

}
