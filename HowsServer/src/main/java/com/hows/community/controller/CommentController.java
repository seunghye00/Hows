package com.hows.community.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
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
	public ResponseEntity<List<Map<String, Object>>> getComments(@RequestParam("board_seq") int boardSeq) {
		List<Map<String, Object>> comments = commentServ.getCommentsBoardSeq(boardSeq); // 댓글 목록 조회 로직
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
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}

}
