package com.hows.community.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.community.dto.CommentDTO;
import com.hows.community.service.CommentService;

@RestController
@RequestMapping("/comment")
public class CommentController {
	@Autowired
	private CommentService commentServ;

	// 게시글 댓글 작성
	@PostMapping("/write")
	public ResponseEntity<Void> writeComment(@RequestBody CommentDTO dto) {

		// 값 가져오기
		String commentContents = dto.getComment_contents();
		String memberId = dto.getMember_id();
		int boardSeq = dto.getBoard_seq();


		// 댓글 저장 로직
		commentServ.writeComment(boardSeq, memberId, commentContents);

		return ResponseEntity.ok().build();
	}

	// 게시글 댓글 목록 불러오기
	@GetMapping("/getComments")
	public ResponseEntity<List<Map<String, Object>>> getComments(
	        @RequestParam("board_seq") int boardSeq, 
	        @RequestParam(value = "member_id", required = false) String memberId) {
	    
	    List<Map<String, Object>> comments = commentServ.getCommentsBoardSeq(boardSeq); // 댓글 목록 조회 로직

	    // 각 댓글에 대해 사용자가 좋아요를 눌렀는지 확인하여 isLiked 필드 추가
	    for (Map<String, Object> comment : comments) {
	        BigDecimal commentSeqDecimal = (BigDecimal) comment.get("COMMENT_SEQ");
	        int commentSeq = commentSeqDecimal.intValue(); // BigDecimal을 int로 변환

	        // 회원일 경우에만 좋아요 여부 확인
	        if (memberId != null) {
	            boolean isLiked = commentServ.checkIfUserLikedBoard(memberId, commentSeq);
	            comment.put("isLiked", isLiked);
	        } else {
	            // 비회원일 경우 기본값으로 좋아요를 누르지 않은 상태
	            comment.put("isLiked", false);
	        }
	    }

	    return ResponseEntity.ok(comments); // 댓글 목록을 JSON 형식으로 반환
	}
	
	// 게시글 댓글 수정 
	@PutMapping("/update")
    public ResponseEntity<Void> updateComment(
    		@RequestBody CommentDTO dto) {

        int commentSeq = dto.getComment_seq();
        String commentContents = dto.getComment_contents();
        commentServ.updateComment(commentSeq, commentContents); // 댓글 수정 서비스 호출
        return ResponseEntity.ok().build();
    }
	
	// 게시글 댓글 삭제 
	@DeleteMapping("/delete/{comment_seq}")
    public ResponseEntity<Void> deleteComment(@PathVariable int comment_seq) {
		commentServ.deleteLike(comment_seq); // 댓글 삭제 시 연결 된 좋아요 삭제
		commentServ.deleteComment(comment_seq); // 댓글 삭제
		return ResponseEntity.ok().build();
	}
	
	// 댓글 좋아요 
	@PostMapping("{comment_seq}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable int comment_seq,
            @RequestBody Map<String, Object> requestBody // member_id를 body에서 받음
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) requestBody.get("member_id"); // member_id 가져오기
            System.out.println(userId + " 진입 확인");
            
            // 1. 사용자가 이미 좋아요를 눌렀는지 확인
            boolean isLiked = commentServ.checkIfUserLikedBoard(userId, comment_seq);

            if (isLiked) {
                // 2. 이미 좋아요를 눌렀다면 좋아요 취소
            	commentServ.removeLike(userId, comment_seq);
                response.put("isLiked", false);  // 좋아요가 취소되었으므로 false
                response.put("message", "좋아요가 취소되었습니다.");
            } else {
                // 3. 좋아요 추가
            	commentServ.addLike(userId, comment_seq);
                response.put("isLiked", true);  // 좋아요가 추가되었으므로 true
                response.put("message", "좋아요가 추가되었습니다.");
            }

            // 4. 좋아요 수 업데이트 후 반환
            int likeCount = commentServ.getLikeCount(comment_seq);
            response.put("like_count", likeCount);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "좋아요 처리 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
	
	// 댓글 신고처리
	@PostMapping("/report")
	public ResponseEntity<Void> sendCommentReport(@RequestBody Map<String, Object> reportData) {
	    int commentSeq = (Integer) reportData.get("comment_seq");
	    String reportCode = (String) reportData.get("report_code");
	    String memberId = (String) reportData.get("member_id");
	    
 	    commentServ.sendCommentReport(commentSeq, reportCode, memberId);
	    return ResponseEntity.ok().build();
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}

}
