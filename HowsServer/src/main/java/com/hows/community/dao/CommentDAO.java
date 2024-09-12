package com.hows.community.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
    
    public List<Map<String, Object>> getCommentsBoardSeq(int boardSeq) {
       return mybatis.selectList("Comment.getCommentsBoardSeq",boardSeq);
    }
}
