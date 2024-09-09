package com.hows.community.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.CommunityDTO;

@Repository
public class CommunityDAO {
	@Autowired
	private SqlSession mybatis;
	
	public void insertWrite(CommunityDTO dto) {
		mybatis.insert("Community.insertWrite", dto);
	}
	
	public int selectBoardSeq() {
		return mybatis.selectOne("Community.selectBoardSeq");
	}
}
