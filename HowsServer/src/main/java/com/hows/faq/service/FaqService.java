package com.hows.faq.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.faq.dao.FaqDAO;
import com.hows.faq.dto.FaqDTO;

@Service
public class FaqService {
	
	@Autowired
	private FaqDAO dao;
	
	// FAQ 등록
	public void insertFaq(FaqDTO faq) {
	    dao.insertFaq(faq);
	}
	// FAQ 조회
	public List<FaqDTO> selectAllFaq() {
	    return dao.selectAllFaq();
	}

	// FAQ 수정
	public void updateFaq(FaqDTO faq) {
	    dao.updateFaq(faq);
	}

	// FAQ 삭제
	public void deleteFaq(int faq_seq) {
	    dao.deleteFaq(faq_seq);
	}

}
