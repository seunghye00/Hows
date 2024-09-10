package com.hows.product.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.product.dto.ReviewDTO;

@Repository
public class ReviewDAO {
	@Autowired
	private SqlSession myBatis;
	
	// 리뷰 저장
    public void insertReview(ReviewDTO review) {
    	myBatis.insert("Product.insertReview", review);
    }
}
