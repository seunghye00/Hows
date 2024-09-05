package com.hows.community.dto;

public class HousingTypeDTO {
	private String housing_type_code;
	private String housing_type_title;

	public HousingTypeDTO(String housing_type_code, String housing_type_title) {
		super();
		this.housing_type_code = housing_type_code;
		this.housing_type_title = housing_type_title;
	}

	public HousingTypeDTO() {
		super();
	}

	public String getHousing_type_code() {
		return housing_type_code;
	}

	public void setHousing_type_code(String housing_type_code) {
		this.housing_type_code = housing_type_code;
	}

	public String getHousing_type_title() {
		return housing_type_title;
	}

	public void setHousing_type_title(String housing_type_title) {
		this.housing_type_title = housing_type_title;
	}

}
