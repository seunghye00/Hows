package com.hows.community.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.community.dao.CommentDAO;
import com.hows.community.dto.TagDTO;

@Service
public class CommentService {
	@Autowired
	private CommentDAO commentDAO;
	
	// 게시글 댓글 작성
	public void writeComment(int boardSeq, String memberId, String commentContents) {
		commentDAO.writeComment(boardSeq, memberId, commentContents );
	}
	
	// 게시글 댓글 목록 출력
    public List<Map<String, Object>> getCommentsBoardSeq(int board_seq) {
        return commentDAO.getCommentsBoardSeq(board_seq); // 댓글 목록을 DB에서 조회
    }
    
	// 게시글 댓글 수정 
    public void updateComment(int commentSeq, String commentContents) {
        commentDAO.updateComment(commentSeq, commentContents);
    }
	
	// 게시글 댓글 삭제 
    public void deleteComment(int comment_seq) {
        commentDAO.deleteComment(comment_seq);
    }
    
	// 게시글 댓글 삭제 시 좋아요 연결 테이블 삭제 
    public void deleteLike(int comment_seq) {
        commentDAO.deleteLike(comment_seq);
    }
    // 사용자가 이미 좋아요를 눌렀는지 확인
 	public boolean checkIfUserLikedBoard(String memberId, int comment_seq) {
 		return commentDAO.checkIfUserLikedBoard(memberId, comment_seq);
 	}

 	// 좋아요 추가
 	public void addLike(String memberId, int comment_seq) {
 		commentDAO.addLike(memberId, comment_seq);
 	}

 	// 좋아요 취소
 	public void removeLike(String memberId, int comment_seq) {
 		commentDAO.removeLike(memberId, comment_seq);
 	}
 	
	// 댓글 총 좋아요 수 가져오기
	public int getLikeCount(int comment_seq) {
		return commentDAO.getLikeCount(comment_seq);
	}
	
	// 댓글 신고
	public void sendCommentReport(int commentSeq, String reportCode, String memberId) {
		commentDAO.sendCommentReport(commentSeq, reportCode, memberId); // 현재 조회수 반환
	}
}
