package com.hows.faq.dto;

public class FaqDTO {

	private int faq_seq;
	private String faq_title;
	private String faq_contents;
	private String notice_code;

	public FaqDTO() {

	}

	public FaqDTO(int faq_seq, String faq_title, String faq_contents, String notice_code) {
		super();
		this.faq_seq = faq_seq;
		this.faq_title = faq_title;
		this.faq_contents = faq_contents;
		this.notice_code = notice_code;
	}

	public int getFaq_seq() {
		return faq_seq;
	}

	public void setFaq_seq(int faq_seq) {
		this.faq_seq = faq_seq;
	}

	public String getFaq_title() {
		return faq_title;
	}

	public void setFaq_title(String faq_title) {
		this.faq_title = faq_title;
	}

	public String getFaq_contents() {
		return faq_contents;
	}

	public void setFaq_contents(String faq_contents) {
		this.faq_contents = faq_contents;
	}

	public String getNotice_code() {
		return notice_code;
	}

	public void setNotice_code(String notice_code) {
		this.notice_code = notice_code;
	}

}
