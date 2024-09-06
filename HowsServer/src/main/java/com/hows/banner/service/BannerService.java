package com.hows.banner.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.banner.domain.entity.Banner;
import com.hows.banner.domain.mapper.BannerMapper;
import com.hows.banner.domain.repository.BannerRepository;
import com.hows.banner.dto.BannerDTO;

@Service
public class BannerService {
	
	@Autowired
	private BannerRepository bannRepo;
	
	@Autowired
	private BannerMapper bannMap;

	public List<BannerDTO> getAllBanners() {
		List<Banner> list = bannRepo.findAll();
		return bannMap.toDTOList(list);
	}

	public void insert(BannerDTO dto) {
		Banner banner = bannMap.toEntity(dto);
		bannRepo.save(banner);
	}
}
