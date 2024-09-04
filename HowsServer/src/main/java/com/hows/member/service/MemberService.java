package com.hows.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.member.dao.MemberDAO;
import com.hows.member.dto.MemberDTO;

@Service
public class MemberService {

	@Autowired
	private MemberDAO memDao;
	
	// 회원가입
	public void insert(MemberDTO dto) {
		memDao.insert(dto);
	}
	
	
}
