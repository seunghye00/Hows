package com.hows.member.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.member.dao.GuestbookDAO;
import com.hows.member.dao.MemberDAO;
import com.hows.member.dto.GuestbookDTO;
import com.hows.member.dto.GuestbookSubDTO;

@Service
public class GuestbookService {
	
	@Autowired
	private MemberDAO memDao;
	@Autowired
	private GuestbookDAO guestDao;

	
	// 글 작성
	public int insert(GuestbookDTO dto) {		
		return guestDao.insert(dto);
	}

	// 전체 출력
	public List<GuestbookSubDTO> selectAll(int member_seq){
		return guestDao.selectAll(member_seq);
	}
	
	// 글 삭제
	public int delete(int guestbook_seq) {		
		return guestDao.delete(guestbook_seq);
	}
	
	// 마이페이지 방문글 갯수
    public int countGuestbook(int member_seq){
    	return guestDao.countGuestbook(member_seq);
    }
	
	
}
