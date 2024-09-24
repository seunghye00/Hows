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
import com.hows.community.dto.CommentReportDTO;
import com.hows.community.dto.ReplyReportDTO;
import com.hows.community.service.CommentService;

@RestController
@RequestMapping("/comment")
public class CommentController {
	@Autowired
	private CommentService commentServ;

	// 게시글 댓글 작성 로그인 필요
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

	// 게시글 댓글 목록 불러오기 (페이지네이션 적용) 로그인 필요없음
	@GetMapping("/getComments")
	public ResponseEntity<Map<String, Object>> getComments(@RequestParam("board_seq") int boardSeq,
			@RequestParam(value = "member_id", required = false) String memberId,
			@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int itemsPerPage) {

		// 페이지네이션을 위한 offset과 limit 계산
		int offset = (page - 1) * itemsPerPage;

		// 댓글 목록 조회 (페이지네이션 적용)
		List<Map<String, Object>> comments = commentServ.getCommentsBoardSeqWithPagination(boardSeq, page,
				itemsPerPage);

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

		// 전체 댓글 개수 조회
		int totalCommentsCount = commentServ.getTotalCommentsCount(boardSeq);

		// 응답 데이터 구조 설정
		Map<String, Object> response = new HashMap<>();
		response.put("comments", comments); // 현재 페이지의 댓글 목록
		response.put("totalCount", totalCommentsCount); // 전체 댓글 수

		return ResponseEntity.ok(response); // 댓글 목록과 전체 댓글 수를 JSON 형식으로 반환
	}

	// 게시글 댓글 수정 로그인 필요
	@PutMapping("/update")
	public ResponseEntity<Void> updateComment(@RequestBody CommentDTO dto) {

		int commentSeq = dto.getComment_seq();
		String commentContents = dto.getComment_contents();
		commentServ.updateComment(commentSeq, commentContents); // 댓글 수정 서비스 호출
		return ResponseEntity.ok().build();
	}

	// 게시글 댓글 삭제 로그인 필요
	@DeleteMapping("/delete/{comment_seq}")
	public ResponseEntity<Void> deleteComment(@PathVariable int comment_seq) {
		commentServ.deleteLike(comment_seq); // 댓글 삭제 시 연결 된 좋아요 삭제
		commentServ.deleteComment(comment_seq); // 댓글 삭제
		return ResponseEntity.ok().build();
	}

	// 댓글 좋아요 로그인 필요
	@PostMapping("{comment_seq}/like")
	public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable int comment_seq,
			@RequestBody Map<String, Object> requestBody // member_id를 body에서 받음
	) {
		Map<String, Object> response = new HashMap<>();
		try {
			String userId = (String) requestBody.get("member_id"); // member_id 가져오기

			// 1. 사용자가 이미 좋아요를 눌렀는지 확인
			boolean isLiked = commentServ.checkIfUserLikedBoard(userId, comment_seq);
			if (isLiked) {
				// 2. 이미 좋아요를 눌렀다면 좋아요 취소
				commentServ.removeLike(userId, comment_seq);
				response.put("isLiked", false); // 좋아요가 취소되었으므로 false
				response.put("message", "좋아요가 취소되었습니다.");
			} else {
				// 3. 좋아요 추가
				commentServ.addLike(userId, comment_seq);
				response.put("isLiked", true); // 좋아요가 추가되었으므로 true
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

	// 댓글 신고처리 로그인 필요
	@PostMapping("/report")
	public ResponseEntity<Void> sendCommentReport(@RequestBody Map<String, Object> reportData) {
		int commentSeq = (Integer) reportData.get("comment_seq");
		String reportCode = (String) reportData.get("report_code");
		String memberId = (String) reportData.get("member_id");

		commentServ.sendCommentReport(commentSeq, reportCode, memberId);
		return ResponseEntity.ok().build();
	}

	// 답글 작성 로그인 필요
	@PostMapping("/reply")
	public ResponseEntity<Void> writeReply(@RequestBody Map<String, Object> requestData) {
		System.out.println(requestData + " 전체 요청 데이터");
		int commentSeq = (int) requestData.get("comment_seq");
		String replyContent = (String) requestData.get("reply_content");
		String memberId = (String) requestData.get("member_id");

		// 서비스 호출하여 답글 작성 처리
		commentServ.writeReply(commentSeq, replyContent, memberId);

		return ResponseEntity.ok().build();

	}

	// 답글 목록 불러오기 로그인 필요없음
	@GetMapping("/repliesList")
	public ResponseEntity<Map<String, Object>> getReplies(@RequestParam("comment_seq") int commentSeq,
			@RequestParam(value = "member_id", required = false) String memberId) {

		// 답글 목록 조회
		List<Map<String, Object>> replies = commentServ.getRepliesByCommentSeq(commentSeq);

		// 각 답글에 대해 사용자가 좋아요를 눌렀는지 확인하여 isLiked 필드 추가
		for (Map<String, Object> reply : replies) {
			BigDecimal replySeqDecimal = (BigDecimal) reply.get("REPLY_SEQ");
			int replySeq = replySeqDecimal.intValue(); // BigDecimal을 int로 변환

			// 회원일 경우에만 좋아요 여부 확인
			if (memberId != null) {
				boolean isLiked = commentServ.checkIfUserLikedReply(memberId, replySeq);
				reply.put("isLiked", isLiked);
			} else {
				// 비회원일 경우 기본값으로 좋아요를 누르지 않은 상태
				reply.put("isLiked", false);
			}
		}

		// 응답 데이터 구조 설정
		Map<String, Object> response = new HashMap<>();
		response.put("replies", replies); // 해당 댓글의 답글 목록

		return ResponseEntity.ok(response); // 답글 목록을 JSON 형식으로 반환
	}

	// 게시글 답글 수정 로그인 필요
	@PutMapping("/update/reply")
	public ResponseEntity<Void> updateReply(@RequestBody Map<String, Object> requestData) {
		int replySeq = (int) requestData.get("reply_seq");
		String replyContents = (String) requestData.get("reply_contents");
		// 서비스 호출하여 답글 수정 처리
		commentServ.updateReply(replySeq, replyContents);

		return ResponseEntity.ok().build();
	}

	// 답글 좋아요 로그인 필요
	@PostMapping("reply/{reply_seq}/like")
	public ResponseEntity<Map<String, Object>> toggleReplyLike(@PathVariable int reply_seq, // reply_seq로 변경
			@RequestBody Map<String, Object> requestBody // member_id를 body에서 받음
	) {
		Map<String, Object> response = new HashMap<>();
		try {
			String userId = (String) requestBody.get("member_id"); // member_id 가져오기

			// 1. 사용자가 해당 답글에 이미 좋아요를 눌렀는지 확인
			boolean isLiked = commentServ.checkIfUserLikedReply(userId, reply_seq); // 댓글용 메서드를 답글용으로 변경
			if (isLiked) {
				// 2. 이미 좋아요를 눌렀다면 좋아요 취소
				commentServ.removeReplyLike(userId, reply_seq); // 답글 좋아요 취소 메서드로 변경
				response.put("isLiked", false); // 좋아요가 취소되었으므로 false
				response.put("message", "좋아요가 취소되었습니다.");
			} else {
				// 3. 좋아요 추가
				commentServ.addReplyLike(userId, reply_seq); // 답글 좋아요 추가 메서드로 변경
				response.put("isLiked", true); // 좋아요가 추가되었으므로 true
				response.put("message", "좋아요가 추가되었습니다.");
			}

			// 4. 좋아요 수 업데이트 후 반환
			int likeCount = commentServ.getReplyLikeCount(reply_seq); // 댓글 좋아요 수 가져오는 메서드를 답글용으로 변경
			response.put("like_count", likeCount);
			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("error", "좋아요 처리 중 오류 발생: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	// 답글 신고 로그인 필요
	@PostMapping("/report/reply")
	public ResponseEntity<Void> sendReplyReport(@RequestBody Map<String, Object> reportData) {
		int replySeq = (Integer) reportData.get("reply_seq");
		String reportCode = (String) reportData.get("report_code");
		String memberId = (String) reportData.get("member_id");

		commentServ.sendReplyReport(replySeq, reportCode, memberId);
		return ResponseEntity.ok().build();
	}

	// 관리자
	// 댓글 신고조회 (관리자)
	@GetMapping("/reportedComments")
	public ResponseEntity<Map<String, Object>> getReportedComments(@RequestParam int startRow,
			@RequestParam int endRow) {

		// 전체 신고 댓글 개수
		int totalCount = commentServ.getReportedCommentsCount();
		System.out.println(totalCount);

		// 페이징 처리된 신고 댓글 목록
		List<Map<String, Object>> reportedComments = commentServ.getReportedComments(startRow, endRow);
		System.out.println(reportedComments);

		Map<String, Object> response = new HashMap<>();
		response.put("totalCount", totalCount);
		response.put("comments", reportedComments);

		return ResponseEntity.ok(response);
	}

	// 댓글 신고 내역 조회 (관리자)
	@GetMapping("/commentReport/{comment_seq}")
	public ResponseEntity<List<CommentReportDTO>> getCommentReport(@PathVariable int comment_seq) {
		List<CommentReportDTO> commentReports = commentServ.getCommentReport(comment_seq);
		return ResponseEntity.ok(commentReports);
	}

	// 신고 댓글 삭제 (관리자)
	@DeleteMapping("/deleteCmt/{comment_seq}")
	public ResponseEntity<Integer> deleteCmt(@PathVariable int comment_seq) {
		int result = commentServ.deleteCmt(comment_seq);
		if (result > 0) {
			return ResponseEntity.ok(result); // 성공 시 200 OK
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(0); // 실패 시 404 NOT FOUND
		}
	}

	// 대댓글 신고조회 (관리자)
	@GetMapping("/reportedReplys")
	public ResponseEntity<Map<String, Object>> getReportedReplys(@RequestParam("startRow") int startRow,
			@RequestParam("endRow") int endRow) {
		try {
			int totalCount = commentServ.getReportedReplysCount();
			List<Map<String, Object>> replys = commentServ.getReportedReplys(startRow, endRow);
			return ResponseEntity.ok(Map.of("replys", replys, "totalCount", totalCount));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 대댓글 신고 내역 조회 (관리자)
	@GetMapping("/replyReport/{reply_seq}")
	public ResponseEntity<List<ReplyReportDTO>> getReplyReport(@PathVariable int reply_seq) {
		try {
			List<ReplyReportDTO> reportList = commentServ.getReplyReport(reply_seq);
			return ResponseEntity.ok(reportList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 대댓글 삭제 (관리자)
	@DeleteMapping("/deleteReply/{reply_seq}")
	public ResponseEntity<Integer> deleteReply(@PathVariable int reply_seq) {

		int result = commentServ.deleteReply(reply_seq); // 대댓글 삭제
		if (result > 0) {
			return ResponseEntity.ok().build();

		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(0); // 실패 시 404 NOT FOUND
		}
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
