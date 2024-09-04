package com.hows.banner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.banner.service.BannerService;

@RestController
@RequestMapping("/banner")
public class BannerController {
	
	@Autowired
	private BannerService bannServ;
}
