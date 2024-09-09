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

	public List<BannerDTO> getAllBanners() {
		return bannDAO.getAllBanners();
	}

	public boolean addBanner(BannerDTO dto) {
		return bannDAO.addBanner(dto);
	}

	public void deleteBanner(int banner_seq) {
		bannDAO.deleteBySeq(banner_seq);
	}
}
