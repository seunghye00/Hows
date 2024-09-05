package com.hows.banner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.banner.dto.BannerDTO;
import com.hows.banner.service.BannerService;

@RestController
@RequestMapping("/banner")
public class BannerController {
	
	@Autowired
	private BannerService bannServ;
	
	@GetMapping
	public ResponseEntity<List<BannerDTO>> getAllBanners() {
		List<BannerDTO> list = bannServ.getAllBanners();
		return ResponseEntity.ok(list);
	}
}
