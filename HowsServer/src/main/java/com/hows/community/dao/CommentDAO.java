package com.hows.community.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.CommentReportDTO;

@Repository
public class CommentDAO {
	@Autowired
	private SqlSession mybatis;

	// 게시글 댓글 작성
	public void writeComment(int boardSeq, String memberId, String commentContents) {
		Map<String, Object> params = new HashMap<>();
		params.put("board_seq", boardSeq);
		params.put("comment_contents", commentContents);
		params.put("member_id", memberId);

		mybatis.insert("Comment.writeComment", params);
	}

	// 게시글 댓글 목록 불러오기
	public List<Map<String, Object>> getCommentsBoardSeq(int boardSeq) {
		return mybatis.selectList("Comment.getCommentsBoardSeq", boardSeq);
	}

	// 게시글 댓글 수정
	public void updateComment(int commentSeq, String commentContents) {
		Map<String, Object> params = new HashMap<>();
		params.put("comment_seq", commentSeq);
		params.put("comment_contents", commentContents);
		mybatis.update("Comment.updateComment", params);
	}

	// 게시글 댓글 삭제
	public void deleteComment(int comment_seq) {
		mybatis.delete("Comment.deleteComment", comment_seq);
	}

	// 댓글 좋아요 삭제
	public void deleteLike(int comment_seq) {
		mybatis.delete("Comment.deleteLike", comment_seq);
	}

	// 사용자가 특정 게시글에 좋아요를 눌렀는지 확인
	public boolean checkIfUserLikedBoard(String member_id, int comment_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("comment_seq", comment_seq);

		Integer result = mybatis.selectOne("Comment.checkIfUserLikedBoard", params);
		return result != null && result > 0;
	}

	// 게시글에 좋아요 추가
	public void addLike(String member_id, int comment_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("comment_seq", comment_seq);

		mybatis.insert("Comment.addLike", params);
	}

	// 게시글에 좋아요 제거
	public void removeLike(String member_id, int comment_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("comment_seq", comment_seq);

		mybatis.delete("Comment.removeLike", params);
	}

	// 특정 댓글 좋아요 개수 가져오기
	public int getLikeCount(int comment_seq) {
		return mybatis.selectOne("Comment.getLikeCount", comment_seq);
	}

	// 댓글 신고하기
	public void sendCommentReport(int commentSeq, String reportCode, String memberId) {
		Map<String, Object> params = new HashMap<>();
		params.put("comment_seq", commentSeq);
		params.put("report_code", reportCode);
		params.put("member_id", memberId);
		mybatis.insert("Comment.sendCommentReport", params);
	}

	// 관리자
	// 댓글 신고조회 (관리자)
	// 신고 댓글 목록 조회 (페이징 포함)
	public List<Map<String, Object>> getReportedComments(int startRow, int endRow) {
		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		return mybatis.selectList("Comment.getReportedComments", params);
	}

	// 전체 신고 댓글 개수 조회
	public int getReportedCommentsCount() {
		return mybatis.selectOne("Comment.getReportedCommentsCount");
	}

	// 댓글 신고 내역 조회
	public List<CommentReportDTO> getCommentReport(int comment_seq) {
		return mybatis.selectList("Comment.getCommentReport", comment_seq);
	}

	// 댓글 신고 기록 삭제
	public void deleteCommentReport(int comment_seq) {
		mybatis.delete("Comment.deleteCommentReport", comment_seq);
	}

	// 댓글 삭제
	public int deleteCmt(int comment_seq) {
		return mybatis.delete("Comment.deleteCmt", comment_seq);
	}
}
