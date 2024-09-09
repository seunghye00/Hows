package com.hows.blacklistreason.dto;

public class BlacklistReasonDTO {
	private String blacklistreasoncode;
	private String blacklistreasondescription;

	public BlacklistReasonDTO() {

	}

	public BlacklistReasonDTO(String blacklistreasoncode, String blacklistreasondescription) {
		super();
		this.blacklistreasoncode = blacklistreasoncode;
		this.blacklistreasondescription = blacklistreasondescription;
	}

	public String getBlacklistreasoncode() {
		return blacklistreasoncode;
	}

	public void setBlacklistreasoncode(String blacklistreasoncode) {
		this.blacklistreasoncode = blacklistreasoncode;
	}

	public String getBlacklistreasondescription() {
		return blacklistreasondescription;
	}

	public void setBlacklistreasondescription(String blacklistreasondescription) {
		this.blacklistreasondescription = blacklistreasondescription;
	}

}
