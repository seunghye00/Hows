package com.hows.notice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.notice.service.NoticeService;

@RestController
@RequestMapping("/notice")
public class NoticeController {

	@Autowired
	private NoticeService service;

	// 공지사항 등록

	// 공지사항 조회

	// 공지사항 수정

	// 공지사항 삭제

}
