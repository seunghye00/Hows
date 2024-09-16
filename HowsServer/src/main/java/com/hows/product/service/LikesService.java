package com.hows.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.product.dao.LikesDAO;

@Service
public class LikesService { 
	@Autowired
	private LikesDAO likesDAO;
	
    // 좋아요 추가 메서드
    public void addLike(int product_seq, String member_id) throws Exception{
        likesDAO.addLike(product_seq, member_id);
    }
    
    // 좋아요 삭제
    public void removeLike(int product_seq, String member_id) throws Exception{
        likesDAO.removeLike(product_seq, member_id);
    }
    
    // 좋아요 개수 조회
    public int getLikeCount(int product_seq) throws Exception{
        return likesDAO.getLikeCount(product_seq);
    }
    
    // 좋아요 확인
    public boolean isLiked(int product_seq, String member_id) throws Exception{
        return likesDAO.checkLikeStatus(product_seq, member_id);
    }
    
    // 리뷰 좋아요 추가
    public void addReviewLike(int reviewSeq, String memberId) throws Exception {
        likesDAO.addReviewLike(reviewSeq, memberId);
    }

    // 리뷰 좋아요 취소
    public void removeReviewLike(int reviewSeq, String memberId) throws Exception {
        likesDAO.removeReviewLike(reviewSeq, memberId);
    }

    // 리뷰 좋아요 개수 조회
    public int getReviewLikeCount(int reviewSeq) throws Exception{
        return likesDAO.getReviewLikeCount(reviewSeq);
    }

    // 리뷰 좋아요 상태 확인
    public boolean isReviewLiked(int reviewSeq, String memberId) throws Exception{
        return likesDAO.checkReviewLikeStatus(reviewSeq, memberId);
    }
    
}
