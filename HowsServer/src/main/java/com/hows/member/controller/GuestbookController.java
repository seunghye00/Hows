package com.hows.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.member.dto.GuestbookDTO;
import com.hows.member.service.GuestbookService;
import com.hows.member.service.MemberService;

@RestController
@RequestMapping("/guestbook")
public class GuestbookController {
	
	@Autowired
	private MemberService memServ;
	@Autowired
	private GuestbookService guestServ;
	
	// 글 작성 위한 member_seq 뽑기
    @GetMapping("/findMemberSeq")
    public ResponseEntity<Integer> findMemberSeq(@RequestParam String member_id) {
    	
        int member_seq = memServ.findMemberSeq(member_id);
        return ResponseEntity.ok(member_seq); // member_seq 값을 응답으로 전달
    }
	
	// 글 작성
	@PostMapping("/insert")
	public ResponseEntity<GuestbookDTO> insert(
			@AuthenticationPrincipal UserDetails user,
			@RequestBody GuestbookDTO dto){
		
		if (dto.getGuestbook_contents() == null || dto.getGuestbook_contents().trim().equals("")) {
			return ResponseEntity.ok(null);
		}
		else {
			String member_id = user.getUsername();
			dto.setMember_id(member_id);
			
			System.out.println("아이디 뭐니 : " + member_id);
			System.out.println("guestseq : " + dto.getGuestbook_seq());
			System.out.println("contents : " + dto.getGuestbook_contents());
			System.out.println("date : " + dto.getGuestbook_write_date());
			System.out.println("memberSeq : " + dto.getMember_seq());
			System.out.println("memberId : " + dto.getMember_id());
			
			return ResponseEntity.ok(guestServ.insert(dto));
			
		}
	}
	
	
	
	
	

}
