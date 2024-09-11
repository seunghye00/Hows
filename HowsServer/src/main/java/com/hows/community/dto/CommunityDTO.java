package com.hows.community.dto;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class CommunityDTO {
	private int board_seq;
	private String board_title;
	private String board_contents;
	private Timestamp board_wirte_date;
	private int view_count;
	private String housing_type_code;
	private String space_type_code;
	private String Area_size_code;
	private String color_code;
	private String member_id;
	private List<ImageDTO> images;

	public CommunityDTO(int board_seq, String board_title, String board_contents, Timestamp board_wirte_date, int view_count,
			String housing_type_code, String space_type_code, String area_size_code, String color_code,
			String member_id, List<ImageDTO> images) {
		super();
		this.board_seq = board_seq;
		this.board_title = board_title;
		this.board_contents = board_contents;
		this.board_wirte_date = board_wirte_date;
		this.view_count = view_count;
		this.housing_type_code = housing_type_code;
		this.space_type_code = space_type_code;
		Area_size_code = area_size_code;
		this.color_code = color_code;
		this.member_id = member_id;
		this.images = images;
	}

	public CommunityDTO() {
		super();
	}

	public int getBoard_seq() {
		return board_seq;
	}

	public void setBoard_seq(int board_seq) {
		this.board_seq = board_seq;
	}

	public String getBoard_title() {
		return board_title;
	}

	public void setBoard_title(String board_title) {
		this.board_title = board_title;
	}

	public String getBoard_contents() {
		return board_contents;
	}

	public void setBoard_contents(String board_contents) {
		this.board_contents = board_contents;
	}

	public Timestamp getBoard_wirte_date() {
		return board_wirte_date;
	}

	public void setBoard_wirte_date(Timestamp board_wirte_date) {
		this.board_wirte_date = board_wirte_date;
	}

	public int getView_count() {
		return view_count;
	}

	public void setView_count(int view_count) {
		this.view_count = view_count;
	}

	public String getHousing_type_code() {
		return housing_type_code;
	}

	public void setHousing_type_code(String housing_type_code) {
		this.housing_type_code = housing_type_code;
	}

	public String getSpace_type_code() {
		return space_type_code;
	}

	public void setSpace_type_code(String space_type_code) {
		this.space_type_code = space_type_code;
	}

	public String getArea_size_code() {
		return Area_size_code;
	}

	public void setArea_size_code(String area_size_code) {
		Area_size_code = area_size_code;
	}

	public String getColor_code() {
		return color_code;
	}

	public void setColor_code(String color_code) {
		this.color_code = color_code;
	}

	public String getMember_id() {
		return member_id;
	}

	public void setMember_id(String member_id) {
		this.member_id = member_id;
	}

	public List<ImageDTO> getImages() {
		return images;
	}

	public void setImages(List<ImageDTO> images) {
		this.images = images;
	}

}
