package com.hows.banner.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.banner.dto.BannerDTO;

@Repository
public class BannerDAO {
	
	@Autowired
	private SqlSession mybatis;

	// 사이트 메인에서 노출할 배너 목록 조회
	public List<BannerDTO> getAllBanners() {
		return mybatis.selectList("Banner.selectAll");
	}
	
	// 관리자가 조회하는 배너 전체 목록 조회
	public List<BannerDTO> getAllBannersByAdmin() {
		return mybatis.selectList("Banner.selectAllByAdmin");
	}

	// 배너 추가
	public int addBanner(BannerDTO dto) {
		return mybatis.insert("Banner.insert", dto);
	}

	// 배너 삭제
	public boolean deleteBySeq(int banner_seq) {
		return mybatis.delete("Banner.delete", banner_seq) > 0;
	}

	// 배너 순서 변경
	public void updateOrder(int bannerSeq, int bannerOrder) {
		Map<String, Integer> params = new HashMap<>();
		params.put("bannerSeq", bannerSeq);
		params.put("bannerOrder", bannerOrder);
		mybatis.update("Banner.updateOrder", params);
	}

	// 배너와 이벤트 연결
	public boolean connectEvent(int bannerSeq, int eventSeq) {
		Map<String, Integer> params = new HashMap<>();
		params.put("bannerSeq", bannerSeq);
		params.put("eventSeq", eventSeq);
		return mybatis.update("Banner.connect", params) > 0;
	}
}
