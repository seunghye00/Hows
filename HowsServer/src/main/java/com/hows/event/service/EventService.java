package com.hows.event.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.event.dao.EventDAO;
import com.hows.event.dto.EventDTO;

@Service
public class EventService {

	@Autowired
	private EventDAO dao;

	// 공지사항 등록
	public void insertEvt(EventDTO dto) {
		dao.insertEvt(dto);
	}

	// 공지사항 목록 조회 서비스
	public List<EventDTO> selectEvt(int startRow, int endRow) {
		return dao.selectEvt(startRow, endRow);
	}

	// 공지사항 전체 개수 조회 서비스
	public int EvtCount() {
		return dao.EvtCount();
	}

	// 공지사항 상세 조회
	public EventDTO detailEvt(int event_seq) {
		return dao.detailEvt(event_seq);
	}

	// 공지사항 수정
	public void modifyEvt(int event_seq, EventDTO dto) {
		dao.modifyEvt(event_seq, dto);
	}

	// 공지사항 삭제
	public void deleteEvt(int event_seq) {
		dao.deleteEvt(event_seq);
	}

	// 조회수
	public void viewCount(int event_seq) {
		dao.viewCount(event_seq);
	}

}
