package com.hows.faq.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.faq.dto.FaqDTO;

@Repository
public class FaqDAO {

	@Autowired
	private SqlSession mybatis;

	// FAQ 등록
	public void insertFaq(FaqDTO faq) {
		mybatis.insert("Faq.insertFaq", faq);
	}

	// FAQ 조회
	public List<FaqDTO> selectAllFaq() {
		return mybatis.selectList("Faq.selectAll");
	}

	// FAQ 수정
	public void updateFaq(FaqDTO faq) {
		mybatis.update("Faq.updateFaq", faq);
	}

	// FAQ 삭제
	public void deleteFaq(int faq_seq) {
		mybatis.delete("Faq.deleteFaq", faq_seq);
	}

}
