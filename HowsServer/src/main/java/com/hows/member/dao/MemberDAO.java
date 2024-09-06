package com.hows.member.dao;

import java.util.HashMap;

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
	
	// 비밀번호 변경시 기존 비밀번호 확인
	public String getPasswordById(HashMap<String, String> map) {
	    return mybatis.selectOne("Member.getPasswordById", map);
	}

	// 비밀번호 변경
	public int updatePw(HashMap<String, String> map) {
		return mybatis.update("Member.updatePw", map);
	}
	
	
}
