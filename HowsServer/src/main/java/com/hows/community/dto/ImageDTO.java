package com.hows.community.dto;

import java.util.List;

public class ImageDTO {
	private int board_image_seq;
	private int board_seq;
	private String image_url;
	private int image_order;
	private List<TagDTO> tags;

	public ImageDTO(int board_image_seq, int board_seq, String image_url, int image_order, List<TagDTO> tags) {
		super();
		this.board_image_seq = board_image_seq;
		this.board_seq = board_seq;
		this.image_url = image_url;
		this.image_order = image_order;
		this.tags = tags;
	}
	public ImageDTO() {
		super();
	}

	public int getBoard_image_seq() {
		return board_image_seq;
	}

	public void setBoard_image_seq(int board_image_seq) {
		this.board_image_seq = board_image_seq;
	}

	public int getBoard_seq() {
		return board_seq;
	}

	public void setBoard_seq(int board_seq) {
		this.board_seq = board_seq;
	}

	public String getImage_url() {
		return image_url;
	}

	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}

	public int getImage_order() {
		return image_order;
	}

	public void setImage_order(int image_order) {
		this.image_order = image_order;
	}

	public List<TagDTO> getTags() {
		return tags;
	}

	public void setTags(List<TagDTO> tags) {
		this.tags = tags;
	}

}
