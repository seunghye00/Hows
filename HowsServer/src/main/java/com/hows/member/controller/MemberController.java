package com.hows.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
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
		
		System.out.println(
				dto.getMember_id() + " : " + 
						dto.getPw() + " : " + 
						dto.getNickname() + " : " + 
						dto.getEmail() + " : " + 
						dto.getGender() + " : " + dto.getBirth());
		
		memServ.insert(dto);
		
		return ResponseEntity.ok().build();
	}
	
	// 마이페이지 회원정보 출력
	@GetMapping
	public ResponseEntity<MemberDTO> selectInfo (@AuthenticationPrincipal UserDetails user){
		
		System.out.println("요청한 사용자의 ID : " + user.getUsername());
		
		String loginId = user.getUsername();
		
//		MemberDTO result = memServ.selectInfo(loginId);
//		return ResponseEntity.ok(result);
		return ResponseEntity.ok(null);
	}
	
	
	
}
