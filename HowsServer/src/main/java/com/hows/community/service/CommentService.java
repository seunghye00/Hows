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
}
