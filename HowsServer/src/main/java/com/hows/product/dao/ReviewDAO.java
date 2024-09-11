package com.hows.product.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.product.dto.ReviewDTO;
import com.hows.product.dto.ReviewReportDTO;

@Repository
public class ReviewDAO {
	@Autowired
	private SqlSession myBatis;
	
	// 리뷰 저장
    public void insertReview(ReviewDTO review) {
    	myBatis.insert("Product.insertReview", review);
    }
    
	// 관리자
	// 리뷰 신고목록 조회
    public List<Map<String, Object>> getReportedReviews() throws Exception {
        return myBatis.selectList("Product.getReportedReviews");
    }

    // 리뷰 신고 내역 조회
    public List<ReviewReportDTO> getReviewReport(int reviewSeq) throws Exception {
        return myBatis.selectList("Product.selectReviewReport", reviewSeq);
    }
}
