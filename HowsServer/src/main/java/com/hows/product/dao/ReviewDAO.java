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
	// 리뷰 신고목록 조회 (관리자)
	public List<Map<String, Object>> getReportedReviews() throws Exception {
		return myBatis.selectList("Product.getReportedReviews");
	}

	// 리뷰 신고 내역 조회 (관리자)
	public List<ReviewReportDTO> getReviewReport(int review_seq) throws Exception {
		System.out.println("DAO : " + myBatis.selectList("Product.selectReviewReport", review_seq));
		return myBatis.selectList("Product.selectReviewReport", review_seq);
	}

	// 리뷰 삭제 (관리자)
	public int deleteReviewReport(int review_seq) throws Exception {
	    return myBatis.delete("Product.deleteReviewReport", review_seq);
	}

	public int deleteReview(int review_seq) throws Exception {
	    return myBatis.delete("Product.deleteReview", review_seq);
	}
}
