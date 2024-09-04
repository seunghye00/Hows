package com.hows.member.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.member.dto.MemberDTO;

@Repository
public class MemberDAO {

	@Autowired
	private SqlSession mybatis;
	
	// 회원가입
	public void insert(MemberDTO dto) {
		mybatis.insert("Member.insert", dto);
	}
	
}
