package com.hows.member.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.member.dto.GuestbookDTO;

@Repository
public class GuestbookDAO {
	
	@Autowired
	private SqlSession mybatis;
	 
	// 글 작성
	public GuestbookDTO insert(GuestbookDTO dto) {
		return mybatis.selectOne("Guestbook.insert", dto);
	}
	

}
