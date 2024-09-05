package com.hows.member.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
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

		System.out.println(dto.getMember_id() + " : " + dto.getPw());

	    // 사용자 존재 여부 확인
		UserDetails existingUser = memServ.loadUserByUsername(dto.getMember_id());
	    
	    if (existingUser == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 사용자입니다.");
	    }
	    
	    // 비밀번호 검증
	    if (!pwEncoder.matches(dto.getPw(), existingUser.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
	    }

	    // 로그인 성공 시 토큰 생성
	    String token = jwt.createToken(existingUser.getUsername());
	    System.out.println("생성된 토큰 : " + jwt.getSubject(token));
	    
	    
		return ResponseEntity.ok(token);

	}
	
	
	
	
	
	
}
