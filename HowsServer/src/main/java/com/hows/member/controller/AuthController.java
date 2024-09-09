package com.hows.member.controller;


import java.util.HashMap;
import java.util.Map;

import com.hows.common.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

		System.out.println("id : " + dto.getMember_id() + " / pw : " + dto.getPw());

	    // 사용자 존재 여부 확인
		CustomUserDetails existingUser = memServ.loadUserByUsername(dto.getMember_id());
	    if (existingUser == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 사용자입니다.");
	    }
	    
	    // 비밀번호 검증
	    if (!pwEncoder.matches(dto.getPw(), existingUser.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
	    }

	    // 로그인 성공 시 토큰 생성
	    String token = jwt.createToken(existingUser.getUsername(), existingUser.getMemberSeq());
		return ResponseEntity.ok(token);
	}
	
	// 아이디 찾기
	@PostMapping("/findId")
	public ResponseEntity<String> findId(@RequestParam String name, @RequestParam String email){
		
		Map<String, String> map = new HashMap<>();
		map.put("name", name);
		map.put("email", email);
		
		String foundId = memServ.findId(map);
		
		return ResponseEntity.ok(foundId);
	}
	
	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증
	@PostMapping("/verifyUser")
	public ResponseEntity<Boolean> verifyUser(@RequestParam String member_id, @RequestParam String email){
		
		Map<String, String> map = new HashMap<>();
		map.put("member_id", member_id);
		map.put("email", email);
		
		Boolean result = memServ.verifyUser(map);
		return ResponseEntity.ok(result);
	}
	
	// 비밀번호 찾기 - 비밀번호 변경
	@PostMapping("/changePw")
	public ResponseEntity<Integer> changePw(@RequestParam Map<String, String> request){
		String member_id = request.get("member_id");
		String pw = pwEncoder.encode(request.get("pw"));
	    String email = request.get("email");

	    Map<String, String> map = new HashMap<>();
	    map.put("member_id", member_id);
	    map.put("pw", pw);
	    map.put("email", email);

	    int result = memServ.changePw(map);
	    if (result > 0) {
	        return ResponseEntity.ok(result);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
	    }
	}
	
	
	
	
	
	
}
