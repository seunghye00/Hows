package com.hows.product.dao;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@Repository
public class LikesDAO {
	
	@Autowired
	private SqlSession myBatis;
	
	// 좋아요 추가 메서드
    public void addLike(int product_seq, String member_id) {
    	
        Map<String, Object> params = new HashMap<>();
        params.put("product_seq", product_seq); 
        params.put("member_id", member_id); 

        myBatis.insert("Likes.addLike", params);
    }
    
    // 좋아요 삭제
    public void removeLike(int product_seq, String member_id) {
    	
        Map<String, Object> params = new HashMap<>();
        params.put("product_seq", product_seq);
        params.put("member_id", member_id);
        
        myBatis.delete("Likes.removeLike", params);
    }
    
    // 좋아요 개수 조회
    public int getLikeCount(int product_seq) {
        return myBatis.selectOne("Likes.getLikeCount", product_seq);
    }
    
    // 좋아요 확인
    public boolean checkLikeStatus(int product_seq, String member_id) {
        Map<String, Object> params = new HashMap<>();
        params.put("product_seq", product_seq);
        params.put("member_id", member_id);
        return myBatis.selectOne("Likes.checkLikeStatus", params);
    }
    
    // 리뷰 좋아요 추가
    public void addReviewLike(int reviewSeq, String memberId) {
        Map<String, Object> params = new HashMap<>();
        params.put("review_seq", reviewSeq);
        params.put("member_id", memberId);

        myBatis.insert("Likes.addReviewLike", params);
    }

    // 리뷰 좋아요 삭제
    public void removeReviewLike(int reviewSeq, String memberId) {
        Map<String, Object> params = new HashMap<>();
        params.put("review_seq", reviewSeq);
        params.put("member_id", memberId);

        myBatis.delete("Likes.removeReviewLike", params);
    }

    // 리뷰 좋아요 개수 조회
    public int getReviewLikeCount(int reviewSeq) {
        return myBatis.selectOne("Likes.getReviewLikeCount", reviewSeq);
    }

    // 리뷰 좋아요 상태 확인
    public boolean checkReviewLikeStatus(int reviewSeq, String memberId) {
        Map<String, Object> params = new HashMap<>();
        params.put("review_seq", reviewSeq);
        params.put("member_id", memberId);

        return myBatis.selectOne("Likes.checkReviewLikeStatus", params);
    }
}
