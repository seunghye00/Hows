package com.hows.blacklistreason.dto;

public class BlacklistReasonDTO {
	private String blacklist_reason_code;
	private String blacklist_reason_description;

	public BlacklistReasonDTO() {

	}

	public BlacklistReasonDTO(String blacklist_reason_code, String blacklist_reason_description) {
		super();
		this.blacklist_reason_code = blacklist_reason_code;
		this.blacklist_reason_description = blacklist_reason_description;
	}

	public String getBlacklist_reason_code() {
		return blacklist_reason_code;
	}

	public void setBlacklist_reason_code(String blacklist_reason_code) {
		this.blacklist_reason_code = blacklist_reason_code;
	}

	public String getBlacklist_reason_description() {
		return blacklist_reason_description;
	}

	public void setBlacklist_reason_description(String blacklist_reason_description) {
		this.blacklist_reason_description = blacklist_reason_description;
	}

}
