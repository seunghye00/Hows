package com.hows.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.product.dao.ReviewDAO;
import com.hows.product.dto.ReviewDTO;

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
}
