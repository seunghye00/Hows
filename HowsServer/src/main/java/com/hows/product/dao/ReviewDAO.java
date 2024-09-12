package com.hows.product.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.product.dto.ImageDTO;
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
	
	// 리뷰 이미지 저장
	public void insertReviewImage(ImageDTO imageDTO) {
		myBatis.insert("Product.insertReviewImage", imageDTO);
	}
	
	// 리뷰 목록 출력
	public List<Map<String, Object>>  getReviewList (int product_seq) throws Exception{
		System.out.println("getReviewList dao");
		
		return myBatis.selectList("Product.getReviewList",product_seq);
	}

	
	
	
	
	
	
	
	
	// 관리자
	// 리뷰 신고목록 조회 (관리자)
	public List<Map<String, Object>> getReportedReviews(int startRow, int endRow) throws Exception {
	    Map<String, Object> params = new HashMap<>();
	    params.put("startRow", startRow);
	    params.put("endRow", endRow);
	    
	    // 페이징된 신고 리뷰 목록을 MyBatis 쿼리를 통해 조회
	    return myBatis.selectList("Product.getReportedReviews", params);
	}
	
	// 전체 신고 리뷰 카운트 조회
	public int getReportedReviewsCount() throws Exception {
	    return myBatis.selectOne("Product.getReportedReviewsCount");
	}

	// 리뷰 신고 내역 조회 (관리자)
	public List<ReviewReportDTO> getReviewReport(int review_seq) throws Exception {
		System.out.println("DAO : " + myBatis.selectList("Product.selectReviewReport", review_seq));
		return myBatis.selectList("Product.selectReviewReport", review_seq);
	}

	// 리뷰 신고 삭제 (관리자)
	public int deleteReviewReport(int review_seq) throws Exception {
	    return myBatis.delete("Product.deleteReviewReport", review_seq);
	}

	// 리뷰 삭제
	public int deleteReview(int review_seq) throws Exception {
	    return myBatis.delete("Product.deleteReview", review_seq);
	}
	
	public int selectLastReviewSeq() throws Exception {
		return myBatis.selectOne("Product.selectLastReviewSeq");
	}
}
