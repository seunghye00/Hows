package com.hows.member.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.common.util.JwtUtil;
import com.hows.member.dto.MemberDTO;
import com.hows.member.service.MemberService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private MemberService memServ;
	@Autowired
	private PasswordEncoder pwEncoder;
	@Autowired
	private JwtUtil jwt;
	
	// 로그인
	@PostMapping
	public ResponseEntity<String> login(@RequestBody MemberDTO dto){
		String pw = pwEncoder.encode(dto.getPw());
		dto.setPw(pw);
		
		System.out.println(dto.getMember_id() + " : " + dto.getPw());
		
		// 로그인
		String token = jwt.createToken(dto.getMember_id());
		System.out.println("생성된 토큰 : " + jwt.getSubject(token));
		
		return ResponseEntity.ok(token);
	}
	
	
	
	
	
	
}
