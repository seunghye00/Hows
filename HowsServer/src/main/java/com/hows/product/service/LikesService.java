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
    public int getLikeCount(int product_seq) {
        return likesDAO.getLikeCount(product_seq);
    }
    
    // 좋아요 확인
    public boolean isLiked(int product_seq, String member_id) {
        return likesDAO.checkLikeStatus(product_seq, member_id);
    }
}
