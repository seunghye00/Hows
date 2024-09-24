package com.hows.File.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hows.File.service.FileService;

@RestController
@RequestMapping("/file")
public class FileController {

	@Autowired
	private FileService fileServ;
	
	// 관리자 기능
	@PostMapping
	public ResponseEntity<String> getUrl(@RequestParam("file") MultipartFile file) throws Exception {
		// 파일을 서버와 DB에 저장하고 반환받은 파일 경로 저장
		String result = fileServ.upload(file, 0, "F6");
		return ResponseEntity.ok(result);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
