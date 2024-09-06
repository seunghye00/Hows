package com.hows.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	// 마이페이지 회원정보 출력
	@GetMapping
	public ResponseEntity<MemberDTO> selectInfo (@AuthenticationPrincipal UserDetails user){
		
		System.out.println("요청한 사용자의 ID : " + user.getUsername());
		
		String loginId = user.getUsername();
		
//		MemberDTO result = memServ.selectInfo(loginId);
//		return ResponseEntity.ok(result);
		return ResponseEntity.ok(null);
	}
	
	// 비밀번호 변경 시 기존 비밀번호 확인
	@PostMapping("/checkPw")
	public ResponseEntity<Boolean> checkPw(
	        @AuthenticationPrincipal UserDetails user, 
	        @RequestBody Map<String, String> request){

	    // 사용자로부터 받은 평문 비밀번호
	    String pw = request.get("pw");
	    String loginId = user.getUsername();
	    
	    HashMap<String, String> map = new HashMap<>();
	    map.put("member_id", loginId);
	    String dbPw = memServ.getPasswordById(map); // 암호화된 비밀번호

	    BCryptPasswordEncoder pwEncoder = new BCryptPasswordEncoder();
	    boolean result = pwEncoder.matches(pw, dbPw);

	    return ResponseEntity.ok(result);
	}

	
	// 비밀번호 변경
	@PutMapping("/updatePw")
	public ResponseEntity<Integer> updatePw(
			@AuthenticationPrincipal UserDetails user, 
	        @RequestBody Map<String, String> request){
		
		
		String loginId = user.getUsername();
		String pw = pwEncoder.encode(request.get("pw"));
		
		HashMap<String, String> map = new HashMap<>();
	    map.put("member_id", loginId);
	    map.put("pw", pw);
	    
		int result = memServ.updatePw(map);
		
		return ResponseEntity.ok(result);
	}


	
	
}
