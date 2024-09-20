package com.hows.product.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.product.service.LikesService;

@RestController
@RequestMapping("/likes")
public class LikesController {
	
	
	@Autowired
	private LikesService likesServ;
	
	
	// 상품 좋아요 추가, 로그인 필요함
	@Transactional
    @PostMapping("/insert")
    public ResponseEntity<String> addLike(
    		@RequestBody Map<String, Object> requestData) 
    throws Exception{
    	
    	 int product_seq = Integer.parseInt(requestData.get("product_seq").toString());
         String member_id = (String) requestData.get("member_id");

         likesServ.addLike(product_seq, member_id);
         return ResponseEntity.ok().build();
    }
    
    
    // 상품 좋아요 취소, 로그인 필요함
	@Transactional
    @DeleteMapping("/delete")
    public ResponseEntity<String> removeLike(
    		@RequestBody Map<String, Object> requestData) 
    throws Exception{
    	
        int product_seq = Integer.parseInt(requestData.get("product_seq").toString());
        String member_id = (String) requestData.get("member_id");

        likesServ.removeLike(product_seq, member_id);
        return ResponseEntity.ok().build();
    }
    
    
    // 상품 좋아요 개수 조회
    @GetMapping("/count")
    public ResponseEntity<Integer> getLikeCount(
    		@RequestParam("product_seq") int product_seq) 
    throws Exception{
    	
        int likeCount = likesServ.getLikeCount(product_seq);
        return ResponseEntity.ok(likeCount);
    }
    
    
    // 상품 좋아요 확인, 로그인 필요함
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkLikeStatus(
    		@RequestParam("product_seq") int product_seq,
            @RequestParam("member_id") String member_id) 
    throws Exception{
    	
    	// 로그인하지 않은 상태일 때 처리
    	if (member_id == null || member_id.isEmpty()) {
    		// 좋아요 상태가 false로 전달
            return ResponseEntity.ok(false); 
        }
    	
    	// 사용자가 해당 상품에 좋아요를 눌렀는지 확인
        boolean isLiked = likesServ.isLiked(product_seq, member_id);
        return ResponseEntity.ok(isLiked);
    }
    
    
    // 리뷰 좋아요 추가, 로그인 필요함
    @Transactional
    @PostMapping("/review/insert")
    public ResponseEntity<String> addReviewLike(
    		@RequestBody Map<String, Object> requestData) 
    throws Exception {
    	
        int review_seq = Integer.parseInt(requestData.get("review_seq").toString());
        String member_id = (String) requestData.get("member_id");

        likesServ.addReviewLike(review_seq, member_id);
        return ResponseEntity.ok().build();
    }

    
    // 리뷰 좋아요 취소, 로그인 필요함
    @Transactional
    @DeleteMapping("/review/delete")
    public ResponseEntity<String> removeReviewLike(
    		@RequestBody Map<String, Object> requestData) 
    throws Exception {
    	
        int review_seq = Integer.parseInt(requestData.get("review_seq").toString());
        String member_id = (String) requestData.get("member_id");

        likesServ.removeReviewLike(review_seq, member_id);
        return ResponseEntity.ok().build();
    }

    
    // 리뷰 좋아요 개수 조회
    @GetMapping("/review/count")
    public ResponseEntity<Integer> getReviewLikeCount(
        @RequestParam("review_seq") int review_seq) 
    throws Exception {
    	
        int likeCount = likesServ.getReviewLikeCount(review_seq);
        return ResponseEntity.ok(likeCount);
    }

    
    // 리뷰 좋아요 확인, 로그인 필요함
    @GetMapping("/review/check")
    public ResponseEntity<Boolean> checkReviewLikeStatus(
        @RequestParam("review_seq") int review_seq,
        @RequestParam(value = "member_id", required = false) String member_id)
    throws Exception {
    	
    	// 초기 값으로 좋아요가 눌리지 않은 상태를 설정
        boolean isLiked = false;
        // 사용자가 로그인한 상태인 경우 사용자가 해당 리뷰에 좋아요를 눌렀는지 확인
        if (member_id != null) isLiked = likesServ.isReviewLiked(review_seq, member_id);
        return ResponseEntity.ok(isLiked);
    }
    
    
    // 예외 처리
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
	
}
