package com.hows.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.member.dto.GuestbookDTO;
import com.hows.member.dto.GuestbookSubDTO;
import com.hows.member.service.GuestbookService;
import com.hows.member.service.MemberService;

@RestController
@RequestMapping("/guestbook")
public class GuestbookController {
	
	@Autowired
	private MemberService memServ;
	@Autowired
	private GuestbookService guestServ;
	
	// 글 작성 위한 member_seq 뽑기 - 로그인 필요
    @GetMapping("/findMemberSeq")
    public ResponseEntity<Integer> findMemberSeq(@RequestParam String member_id) {
        int member_seq = memServ.findMemberSeq(member_id);
        return ResponseEntity.ok(member_seq); // member_seq 값을 응답으로 전달
    }
	
	// 글 작성 - 로그인 필요
    @PostMapping("/insert")
    public ResponseEntity<Integer> insert(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody GuestbookDTO dto) {

        if (dto.getGuestbook_contents() == null || dto.getGuestbook_contents().trim().equals("")) {
            return ResponseEntity.ok(null);
        } else {
            String member_id = user.getUsername();
            dto.setMember_id(member_id);

            int result = guestServ.insert(dto);
            return ResponseEntity.ok(result);
        }
    }
	
	// 전체 출력 - 로그인 필요
    @GetMapping("/list")
    public ResponseEntity<List<GuestbookSubDTO>> selectAll(@RequestParam int member_seq){
    	List<GuestbookSubDTO> list = guestServ.selectAll(member_seq);
    	return ResponseEntity.ok(list);
    }
    
    // 글 삭제 - 로그인 필요
    @DeleteMapping("/{guestbook_seq}")
    public ResponseEntity<Integer> delete(@PathVariable int guestbook_seq){
    	int result = guestServ.delete(guestbook_seq);
    	return ResponseEntity.ok(result);
    }
	
	// 마이페이지 방문글 갯수 - 로그인 필요
	@GetMapping("/countGuestbook")
	public ResponseEntity<Integer> countGuestbook(@RequestParam int member_seq){
		int result = guestServ.countGuestbook(member_seq);
		return ResponseEntity.ok(result);
	}

	@ExceptionHandler(Exception.class)
	   public ResponseEntity<String> exceptionHandler(Exception e) {
	      e.printStackTrace();
	      return ResponseEntity.badRequest().body("fail");
	   }
    

}
