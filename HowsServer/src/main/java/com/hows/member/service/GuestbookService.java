package com.hows.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.member.dao.GuestbookDAO;
import com.hows.member.dao.MemberDAO;
import com.hows.member.dto.GuestbookDTO;

@Service
public class GuestbookService {
	
	@Autowired
	private MemberDAO memDao;
	@Autowired
	private GuestbookDAO guestDao;

	
	// 글 작성
	public GuestbookDTO insert(GuestbookDTO dto) {
		return guestDao.insert(dto);
	}


}
