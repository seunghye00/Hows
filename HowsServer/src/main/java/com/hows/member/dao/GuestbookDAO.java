package com.hows.member.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.member.dto.GuestbookDTO;
import com.hows.member.dto.GuestbookSubDTO;

@Repository
public class GuestbookDAO {
	
	@Autowired
	private SqlSession mybatis;
	 
	// 글 작성
	public int insert(GuestbookDTO dto) {
		return mybatis.insert("Guestbook.insert", dto);
	}

	// 전체 출력
	public List<GuestbookSubDTO> selectAll(int member_seq){
		return mybatis.selectList("Guestbook.selectAll", member_seq);
	}
	
	// 글 삭제
	public int delete(int guestbook_seq) {
		return mybatis.delete("Guestbook.delete", guestbook_seq);
	}
	
    
	// [마이페이지] 방문글 갯수
    public int countGuestbook(int member_seq){
    	return mybatis.selectOne("Guestbook.countGuestbook", member_seq);
    }
	

    

}
