package com.hows.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hows.member.dao.MemberDAO;
import com.hows.member.dto.MemberDTO;

@Service
public class MemberService implements UserDetailsService{

	@Autowired
	private MemberDAO memDao;
	
	// 회원가입
	public void insert(MemberDTO dto) {
		memDao.insert(dto);
	}
	
	// 아이디 찾기
//	public MemberDTO findById (String id) {
//		return memDao.findById(id);
//	}
	

	// 회원정보 가져오기
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		MemberDTO dto = memDao.findById(username);
		
		User user = new User(dto.getMember_id(), dto.getPw(),AuthorityUtils.createAuthorityList(dto.getRole_code()));
		return user;
	}

	
	
	
	// 마이페이지 회원정보 출력
//	public MemberDTO selectInfo(String loginId) {
//		return memDao.selectInfo(loginId);
//	}



	
}
