package com.hows.member.controller;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.common.CustomUserDetails;
import com.hows.common.util.JwtUtil;
import com.hows.member.dto.MemberDTO;
import com.hows.member.dto.SignInResponseDTO;
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
	public ResponseEntity<SignInResponseDTO> login(@RequestBody MemberDTO dto) {
	    // 사용자 존재 여부 확인
	    CustomUserDetails existingUser = memServ.loadUserByUsername(dto.getMember_id());
	    if (existingUser == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	    }

	    // 비밀번호 검증
	    if (!pwEncoder.matches(dto.getPw(), existingUser.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	    }

	    String member_roleCode = existingUser.getMemberRoleCode();
	    String member_id = existingUser.getUsername();
	    int member_seq = existingUser.getMemberSeq();
	    String nickname = existingUser.getNickname();
	    String member_avatar = existingUser.getMemberAvatar();

	    // 사용자 role_code 확인 (블랙리스트 여부 확인)
	    String role_code = memServ.getRoleCode(member_id); // member_seq를 사용하여 role_code 가져오기

	    if ("R3".equals(role_code)) {
	        // role_code가 R3인 경우, 블랙리스트로 처리하여 로그인 차단
	        return ResponseEntity.status(HttpStatus.LOCKED)
	                .body(new SignInResponseDTO("계정이 블랙리스트로 처리되어 로그인이 불가능합니다.", null, 0, null, null, null));
	    }

	    // 로그인 성공 시 토큰 생성
	    String token = jwt.createToken(member_id, member_seq, nickname, member_avatar);
	    return ResponseEntity.ok(new SignInResponseDTO(token, member_id, member_seq, nickname, member_avatar, member_roleCode));
	}


	// 아이디 찾기
	@PostMapping("/findId")
	public ResponseEntity<String> findId(@RequestBody Map<String, String> request){
		
		String name = request.get("name");
		String email = request.get("email");
		
		Map<String, String> map = new HashMap<>();
		map.put("name", name);
		map.put("email", email);
		
		String foundId = memServ.findId(map);
		
		if(foundId == null) {
			return ResponseEntity.ok("false");
		}
		
		return ResponseEntity.ok(foundId);
	}
	
	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증 및 임시 비밀번호 발급
	@PostMapping("/sendTempPw")
    public ResponseEntity<Boolean> sendTemporaryPassword(@RequestBody Map<String,String> request) {
		String member_id = request.get("member_id");
	    String email = request.get("email");
        Boolean result = memServ.sendTempPw(member_id, email);
        return ResponseEntity.ok(result);
    }

	
	@ExceptionHandler(Exception.class)
	   public ResponseEntity<String> exceptionHandler(Exception e) {
	      e.printStackTrace();
	      return ResponseEntity.badRequest().body("fail");
	   }
	
	
	
	
}
