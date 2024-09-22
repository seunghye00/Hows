package com.hows.event.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.event.dto.EventDTO;

@Repository
public class EventDAO {

	@Autowired
	private SqlSession mybatis;

	// 공지사항 등록
	public void insertEvt(EventDTO dto) {
		mybatis.insert("Event.insertEvt", dto);
	}

	// 공지사항 목록 조회
	public List<EventDTO> selectEvt(int startRow, int endRow) {
		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		return mybatis.selectList("Event.selectEvt", params);
	}

	// 공지사항 전체 개수 조회
	public int EvtCount() {
		return mybatis.selectOne("Event.EvtCount");
	}

	// 공지사항 상세 조회
	public EventDTO detailEvt(int event_seq) {
		return mybatis.selectOne("Event.detailEvt", event_seq);
	}

	// 공지사항 수정
	public void modifyEvt(int event_seq, EventDTO dto) {
		dto.setEvent_seq(event_seq);
		mybatis.update("Event.updateEvt", dto);
	}

	// 공지사항 삭제
	public void deleteEvt(int event_seq) {
		mybatis.delete("Event.deleteEvt", event_seq);
	}

	// 조회수 증가
	public void viewCount(int event_seq) {
		mybatis.update("Event.viewCount", event_seq);
	}

}
