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
	
	// 아이디로 회원 불러오기
	
	
	// 회원정보 가져오기
	public MemberDTO findById(String id) {
		return mybatis.selectOne("Member.findById", id);
	}
	
	
	// 마이페이지 회원정보 출력
	public MemberDTO selectInfo() {
		return mybatis.selectOne("Member.selectInfo");
	}
}
