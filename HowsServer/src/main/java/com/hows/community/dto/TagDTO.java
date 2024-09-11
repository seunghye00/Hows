package com.hows.community.dto;

public class TagDTO {
	private int board_tag_seq;
	private int board_image_seq;
	private int product_seq;
	private int left_position;
	private int top_position;

	public TagDTO(int board_tag_seq, int board_image_seq, int product_seq, int left_position, int top_position) {
		super();
		this.board_tag_seq = board_tag_seq;
		this.board_image_seq = board_image_seq;
		this.product_seq = product_seq;
		this.left_position = left_position;
		this.top_position = top_position;
	}

	public TagDTO() {
		super();
	}

	public int getBoard_tag_seq() {
		return board_tag_seq;
	}

	public void setBoard_tag_seq(int board_tag_seq) {
		this.board_tag_seq = board_tag_seq;
	}

	public int getBoard_image_seq() {
		return board_image_seq;
	}

	public void setBoard_image_seq(int board_image_seq) {
		this.board_image_seq = board_image_seq;
	}

	public int getProduct_seq() {
		return product_seq;
	}

	public void setProduct_seq(int product_seq) {
		this.product_seq = product_seq;
	}

	public int getLeft_position() {
		return left_position;
	}

	public void setLeft_position(int left_position) {
		this.left_position = left_position;
	}

	public int getTop_position() {
		return top_position;
	}

	public void setTop_position(int top_position) {
		this.top_position = top_position;
	}

}
