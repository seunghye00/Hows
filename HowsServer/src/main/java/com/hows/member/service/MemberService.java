package com.hows.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.member.dao.MemberDAO;

@Service
public class MemberService {

	@Autowired
	private MemberDAO memDao;
	
}
