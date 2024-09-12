package com.hows.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {

	@GetMapping
	public ResponseEntity<String> selectAll(){
		
		System.out.println("How's Start!");

		return ResponseEntity.ok("TEst");
	}
}
