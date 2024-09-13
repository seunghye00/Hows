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

	// 리뷰 목록 출력 (페이징)
	public List<Map<String, Object>> getReviewList(int product_seq, int startRow, int endRow) throws Exception {
		System.out.println("getReviewList dao");

		// 파라미터를 하나의 맵에 묶어서 전달
		Map<String, Object> params = new HashMap<>();
		params.put("product_seq", product_seq);
		params.put("startRow", startRow);
		params.put("endRow", endRow);

		// 파라미터를 맵으로 전달
		return myBatis.selectList("Product.getReviewList", params);
	}

	// My 리뷰 목록
	public List<Map<String, Object>> myReview(String memberId) {
		return myBatis.selectList("Product.myReview", memberId);
	}

	// My 리뷰 이미지 목록
	public List<ImageDTO> myReviewImage(int reviewSeq) {
		return myBatis.selectList("Product.myReviewImage", reviewSeq);
	}

	// 관리자
	// 리뷰 신고목록 조회 (관리자)
	public List<Map<String, Object>> getReportedReviews(int startRow, int endRow) {
		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		return myBatis.selectList("Product.getReportedReviews", params);
	}

	// 전체 신고 리뷰 카운트 조회
	public int getReportedReviewsCount() {
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
