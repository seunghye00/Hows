package com.hows.banner.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.banner.dao.BannerDAO;
import com.hows.banner.dto.BannerDTO;

@Service
public class BannerService {

	@Autowired
	private BannerDAO bannDAO;

	// 사이트 메인에서 노출할 배너 목록 조회
	public List<BannerDTO> getAllBanners() {
		return bannDAO.getAllBanners();
	}
	
	// 관리자가 조회하는 배너 전체 목록 조회
	public List<BannerDTO> getAllBannersByAdmin() {
		return bannDAO.getAllBannersByAdmin();
	}

	// 배너 추가
	public int addBanner(BannerDTO dto) {
		return bannDAO.addBanner(dto);
	}

	// 배너 삭제
	public boolean deleteBanner(int bannerSeq) {
		return bannDAO.deleteBySeq(bannerSeq);
	}

	// 배너 순서 변경
	public void updateOrder(int bannerSeq, int bannerOrder) {
		bannDAO.updateOrder(bannerSeq, bannerOrder);
	}

	// 배너와 이벤트 연결
	public boolean connectEvent(int bannerSeq, int eventSeq) {
		return bannDAO.connectEvent(bannerSeq, eventSeq);
	}
}
