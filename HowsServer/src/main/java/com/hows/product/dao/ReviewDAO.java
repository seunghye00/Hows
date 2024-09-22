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

	
	// 특정 회원이 특정 상품을 구매 확정했는지 확인하는 메서드
    public int countCompletedOrders(String memberId, int productSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("memberId", memberId);
        params.put("productSeq", productSeq);
        return myBatis.selectOne("Product.countCompletedOrders", params);
    }
    
    
    // 특정 사용자의 특정 상품에 대한 리뷰 작성 여부 확인 (리뷰 작성 여부를 카운트)
    public int countUserReviews(String memberId, int productSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("memberId", memberId);
        params.put("productSeq", productSeq);
        return myBatis.selectOne("Product.countUserReviews", params);
    }

    
	// 리뷰 저장
	public void insertReview(ReviewDTO review) {
		myBatis.insert("Product.insertReview", review);
	}

	
	// 리뷰 이미지 저장
	public void insertReviewImage(ImageDTO imageDTO) {
		myBatis.insert("Product.insertReviewImage", imageDTO);
	}

	
	// 리뷰 목록 출력 (페이징)
	public List<Map<String, Object>> getReviewList(int product_seq, int startRow, int endRow) {

		Map<String, Object> params = new HashMap<>();
		params.put("product_seq", product_seq);
		params.put("startRow", startRow);
		params.put("endRow", endRow);

		return myBatis.selectList("Product.getReviewList", params);
	}
	
	
	public List<Map<String, Object>> getReviewListByBest(int product_seq, int startRow, int endRow) {

		Map<String, Object> params = new HashMap<>();
		params.put("product_seq", product_seq);
		params.put("startRow", startRow);
		params.put("endRow", endRow);

		return myBatis.selectList("Product.getReviewListByBest", params);
	}
	
	
	// 리뷰 seq 가져오기
	public int selectLastReviewSeq() throws Exception {
		return myBatis.selectOne("Product.selectLastReviewSeq");
	}
	
	
	// 리뷰 이미지 삭제
	public void delReviewImages(int review_seq) {
	    myBatis.delete("Product.delReviewImages", review_seq);  
	}
	
	
	public void delReviewImage(String image_url) {
		myBatis.delete("Product.delReviewImage", image_url);
	}

	
	// 리뷰 삭제
	public void delReview(int review_seq) {
	    myBatis.delete("Product.delReview", review_seq); 
	}
	
	
	// 리뷰 신고 
    public void sendReviewReport(int review_seq, String report_code, String member_id) {
        Map<String, Object> params = new HashMap<>();
        params.put("review_seq", review_seq);
        params.put("report_code", report_code);
        params.put("member_id", member_id);
        myBatis.insert("Product.sendReviewReport", params);
    }
    
    
	// 리뷰 이미지 가져오기
	public List<Map<String, String>> getReviewImgList(int reviewSeq) {
		return myBatis.selectList("Product.getReviewImgList", reviewSeq);
	}

	
    public void updateReview(int review_seq, int rating, String review_contents) {
    	Map<String, Object> params = new HashMap<>();
    	params.put("review_seq", review_seq);
    	params.put("rating", rating);
    	params.put("review_contents", review_contents);
    	myBatis.update("Product.updateReview", params);
    }
    
    
    // 리뷰 전체 별점
    public List<ReviewDTO> getRatings(int product_seq) {
    	return myBatis.selectList("Product.getRatings", product_seq);
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

	// 전체 신고 리뷰 카운트 조회 (관리자)
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

}
