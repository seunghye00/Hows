package com.hows.product.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.product.dao.ReviewDAO;
import com.hows.product.dto.ReviewDTO;
import com.hows.product.dto.ReviewReportDTO;

@Service
public class ReviewService {
	
	@Autowired
	private ReviewDAO reviewDAO;
	
	// 리뷰 저장
    public int saveReview(int rating, String reviewContents, int productSeq, String memberId) {
        ReviewDTO review = new ReviewDTO();
        review.setRating(rating);
        review.setReview_contents(reviewContents);
        review.setProduct_seq(productSeq);
        review.setMember_id(memberId);

        reviewDAO.insertReview(review);
        return review.getReview_seq();
    }
    
	// 관리자
	// 리뷰 신고 목록 조회
    public List<Map<String, Object>> getReportedReviews() throws Exception {
        return reviewDAO.getReportedReviews();
    }
	
    // 리뷰 신고 내역 조회
    public List<ReviewReportDTO> getReviewReport(int reviewSeq) throws Exception {
        return reviewDAO.getReviewReport(reviewSeq);
    }
}
