package com.hows.notice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.notice.dao.NoticeDAO;
import com.hows.notice.dto.NoticeDTO;

@Service
public class NoticeService {

	@Autowired
	private NoticeDAO dao;

	// 공지사항 등록
	public void insertNtc(NoticeDTO dto) {
		System.out.println("서비스 : " + dto);
		dao.insertNtc(dto);
	}

	// 공지사항 목록 조회 서비스
	public List<NoticeDTO> selectNtc(int startRow, int endRow) {
		return dao.selectNtc(startRow, endRow);
	}

	// 공지사항 전체 개수 조회 서비스
	public int NtcCount() {
		return dao.NtcCount();
	}

	// 공지사항 상세 조회
	public NoticeDTO detailNtc(int notice_seq) {
		return dao.detailNtc(notice_seq);
	}

	// 공지사항 수정
	public void modifyNtc(int notice_seq, NoticeDTO dto) {
		dao.modifyNtc(notice_seq, dto);
	}

	// 공지사항 삭제
	public void deleteNtc(int notice_seq) {
		dao.deleteNtc(notice_seq);
	}

	// 조회수
	public void viewCount(int notice_seq) {
		dao.viewCount(notice_seq);
	}

}
