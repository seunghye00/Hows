package com.hows.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.member.dto.MemberDTO;
import com.hows.member.service.MemberService;

@RestController
@RequestMapping("/member")
public class MemberController {

	@Autowired
	private MemberService memServ;
	@Autowired
	private PasswordEncoder pwEncoder;
	
	// 암호화 회원가입
	@PostMapping
	public ResponseEntity<Void> insert(@RequestBody MemberDTO dto){
		String pw = pwEncoder.encode(dto.getPw());
		dto.setPw(pw);
		
		memServ.insert(dto);
		
		return ResponseEntity.ok().build();
	}
	
}
