package com.hows.community.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hows.community.dao.CommentDAO;
import com.hows.community.dto.CommentReportDTO;
import com.hows.community.dto.ReplyReportDTO;

@Service
public class CommentService {
	@Autowired
	private CommentDAO commentDAO;

	// 게시글 댓글 작성
	public void writeComment(int boardSeq, String memberId, String commentContents) {
		commentDAO.writeComment(boardSeq, memberId, commentContents);
	}

	// 게시글 댓글 목록 출력
//    public List<Map<String, Object>> getCommentsBoardSeq(int board_seq) {
//        return commentDAO.getCommentsBoardSeq(board_seq); // 댓글 목록을 DB에서 조회
//    }

    // 게시글 댓글 목록 출력 (페이지네이션 적용)
    public List<Map<String, Object>> getCommentsBoardSeqWithPagination(int boardSeq, int page, int itemsPerPage) {
        // startRow와 endRow 계산
        int startRow = (page - 1) * itemsPerPage + 1;
        int endRow = page * itemsPerPage;

        // DAO에 startRow와 endRow를 전달하여 댓글 목록 조회
        return commentDAO.getCommentsBoardSeqWithPagination(boardSeq, startRow, endRow);
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
		commentDAO.sendCommentReport(commentSeq, reportCode, memberId); 
	}
	
    // 전체 댓글 수 가져오기
    public int getTotalCommentsCount(int boardSeq) {
        return commentDAO.getTotalCommentsCount(boardSeq);
    }
    
    // 답글 영역
    // 답글 작성 메소드
    public void writeReply(int commentSeq, String replyContent, String memberId) {
        commentDAO.writeReply(commentSeq, replyContent, memberId);
    }
    
    // 특정 댓글에 달린 답글 목록 가져오기
    public List<Map<String, Object>> getRepliesByCommentSeq(int commentSeq) {
        return commentDAO.getRepliesByCommentSeq(commentSeq);
    }
    
    // 답글 수정 서비스 메소드 추가
    public void updateReply(int replySeq, String replyContents) {
        commentDAO.updateReply(replySeq, replyContents); // DAO 호출하여 답글 수정
    }
    
    // 사용자가 답글에 좋아요를 눌렀는지 확인
    public boolean checkIfUserLikedReply(String memberId, int replySeq) {
        return commentDAO.checkIfUserLikedReply(memberId, replySeq);
    }

    //답글에 대한 좋아요 추가
    public void addReplyLike(String memberId, int replySeq) {
        commentDAO.addReplyLike(memberId, replySeq);
    }

    // 답글에 대한 좋아요 취소
    public void removeReplyLike(String memberId, int replySeq) {
        commentDAO.removeReplyLike(memberId, replySeq);
    }

    //답글의 총 좋아요 수 조회
    public int getReplyLikeCount(int replySeq) {
        return commentDAO.getReplyLikeCount(replySeq);
    }
	// 답글 신고
	public void sendReplyReport(int replySeq, String reportCode, String memberId) {
		commentDAO.sendReplyReport(replySeq, reportCode, memberId); 
	}
	// 관리자
	// 댓글 신고조회 (관리자)
	// 신고 댓글 목록 조회 (페이징 포함)
	public List<Map<String, Object>> getReportedComments(int startRow, int endRow) {
		return commentDAO.getReportedComments(startRow, endRow);
	}

	// 전체 신고 댓글 개수 조회
	public int getReportedCommentsCount() {
		return commentDAO.getReportedCommentsCount();
	}

	// 댓글 신고 내역 조회
	public List<CommentReportDTO> getCommentReport(int comment_seq) {
		return commentDAO.getCommentReport(comment_seq);
	}

	// 신고 댓글 삭제
	@Transactional
	public int deleteCmt(int comment_seq) {
		commentDAO.deleteCommentReport(comment_seq);
		return commentDAO.deleteCmt(comment_seq);
	}

	// 대댓글 신고조회 (관리자)
	// 신고된 대댓글 목록 조회
	public List<Map<String, Object>> getReportedReplys(int startRow, int endRow) {
		return commentDAO.getReportedReplys(startRow, endRow); 
	}

	// 신고된 대댓글 총 개수 조회
	public int getReportedReplysCount() {
		return commentDAO.getReportedReplysCount();
	}

	// 대댓글 신고 내역 조회
	public List<ReplyReportDTO> getReplyReport(int reply_seq) {
		return commentDAO.getReplyReport(reply_seq);
	}

	// 신고 대댓글 삭제
	@Transactional
	public int deleteReply(int reply_seq) {
		commentDAO.deleteReplyReport(reply_seq);
		return commentDAO.deleteReply(reply_seq);
	}
}
