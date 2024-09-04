package com.hows.banner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.banner.domain.mapper.BannerMapper;
import com.hows.banner.domain.repository.BannerRepository;

@Service
public class BannerService {
	
	@Autowired
	private BannerRepository bannRepo;
	
	@Autowired
	private BannerMapper bannMap;
}
