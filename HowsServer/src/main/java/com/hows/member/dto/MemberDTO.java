package com.hows.member.dto;

import java.sql.Timestamp;

public class MemberDTO {

	private int member_seq;
	private String member_id;
	private String pw;
	private String name;
	private String nickname;
	private String birth;
	private String gender;
	private String phone;
	private String email;
	private String zip_code;
	private String address;
	private String detail_address;
	private String grade_code;
	private String role_code;
	private String blacklist_reason_code;
	private Timestamp blacklist_date;
	private Timestamp signup_date;
	private Timestamp withdrawal_date;
	private String withdrawal_yn;
	private String member_banner;
	private int point;
	private String member_avatar;

	public MemberDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MemberDTO(int member_seq, String member_id, String pw, String name, String nickname, String birth,
			String gender, String phone, String email, String zip_code, String address, String detail_address,
			String grade_code, String role_code, String blacklist_reason_code, Timestamp blacklist_date,
			Timestamp signup_date, Timestamp withdrawal_date, String withdrawal_yn, String member_banner, int point,
			String member_avatar) {
		super();
		this.member_seq = member_seq;
		this.member_id = member_id;
		this.pw = pw;
		this.name = name;
		this.nickname = nickname;
		this.birth = birth;
		this.gender = gender;
		this.phone = phone;
		this.email = email;
		this.zip_code = zip_code;
		this.address = address;
		this.detail_address = detail_address;
		this.grade_code = grade_code;
		this.role_code = role_code;
		this.blacklist_reason_code = blacklist_reason_code;
		this.blacklist_date = blacklist_date;
		this.signup_date = signup_date;
		this.withdrawal_date = withdrawal_date;
		this.withdrawal_yn = withdrawal_yn;
		this.member_banner = member_banner;
		this.point = point;
		this.member_avatar = member_avatar;
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

	public String getPw() {
		return pw;
	}

	public void setPw(String pw) {
		this.pw = pw;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getBirth() {
		return birth;
	}

	public void setBirth(String birth) {
		this.birth = birth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getZip_code() {
		return zip_code;
	}

	public void setZip_code(String zip_code) {
		this.zip_code = zip_code;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDetail_address() {
		return detail_address;
	}

	public void setDetail_address(String detail_address) {
		this.detail_address = detail_address;
	}

	public String getGrade_code() {
		return grade_code;
	}

	public void setGrade_code(String grade_code) {
		this.grade_code = grade_code;
	}

	public String getRole_code() {
		return role_code;
	}

	public void setRole_code(String role_code) {
		this.role_code = role_code;
	}

	public String getBlacklist_reason_code() {
		return blacklist_reason_code;
	}

	public void setBlacklist_reason_code(String blacklist_reason_code) {
		this.blacklist_reason_code = blacklist_reason_code;
	}

	public Timestamp getBlacklist_date() {
		return blacklist_date;
	}

	public void setBlacklist_date(Timestamp blacklist_date) {
		this.blacklist_date = blacklist_date;
	}

	public Timestamp getSignup_date() {
		return signup_date;
	}

	public void setSignup_date(Timestamp signup_date) {
		this.signup_date = signup_date;
	}

	public Timestamp getWithdrawal_date() {
		return withdrawal_date;
	}

	public void setWithdrawal_date(Timestamp withdrawal_date) {
		this.withdrawal_date = withdrawal_date;
	}

	public String getWithdrawal_yn() {
		return withdrawal_yn;
	}

	public void setWithdrawal_yn(String withdrawal_yn) {
		this.withdrawal_yn = withdrawal_yn;
	}

	public String getMember_banner() {
		return member_banner;
	}

	public void setMember_banner(String member_banner) {
		this.member_banner = member_banner;
	}

	public int getPoint() {
		return point;
	}

	public void setPoint(int point) {
		this.point = point;
	}

	public String getMember_avatar() {
		return member_avatar;
	}

	public void setMember_avatar(String member_avatar) {
		this.member_avatar = member_avatar;
	}

}
