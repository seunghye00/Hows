package com.hows.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/web")
public class WebController {

	@GetMapping
	public ResponseEntity<String> selectAll(){
		
		System.out.println("aaa");
		
		
		return ResponseEntity.ok("TEst");
	}
}
