package com.hows.member.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hows.File.service.FileService;
import com.hows.blacklistreason.dto.BlacklistReasonDTO;
import com.hows.common.CustomUserDetails;
import com.hows.grade.dto.GradeDTO;
import com.hows.member.dto.MemberDTO;
import com.hows.member.service.MemberService;
import com.hows.role.dto.RoleDTO;

@RestController
@RequestMapping("/member")
public class MemberController {

	@Autowired
	private MemberService memServ;

	@Autowired
    private FileService fileServ;  

	@Autowired
	private PasswordEncoder pwEncoder;

	// 로그인 시 role_code 확인 - 로그인 필요
	@GetMapping("/getRoleCode")
	public ResponseEntity<String> getRoleCode(@AuthenticationPrincipal CustomUserDetails user){
		String member_id = user.getUsername();
		String result = memServ.getRoleCode(member_id);
		
		return ResponseEntity.ok(result);
	}
	
	// 암호화 회원가입 로그인 필요없음
	@PostMapping
	public ResponseEntity<Void> insert(@RequestBody MemberDTO dto) {
		String pw = pwEncoder.encode(dto.getPw());
		dto.setPw(pw);
		memServ.insert(dto);
		return ResponseEntity.ok().build();
	}

	// 중복확인 - ID 로그인 필요없음
	@PostMapping("/checkId")
	public ResponseEntity<Boolean> checkId(@RequestBody Map<String, String> request) {
		String member_id = request.get("member_id");
		boolean result = memServ.checkId(member_id);
		return ResponseEntity.ok(result);
	}

	// 중복확인 - 닉네임 로그인 필요없음
	@PostMapping("/checkNickname")
	public ResponseEntity<Boolean> checkNickname(@RequestBody Map<String, String> request) {
		String nickname = request.get("nickname");
		boolean result = memServ.checkNickname(nickname);
		return ResponseEntity.ok(result);
	}

	// 중복확인 - 이메일 로그인 필요없음
	@PostMapping("/checkEmail")
	public ResponseEntity<Boolean> checkEmail(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		boolean result = memServ.checkEmail(email);
		return ResponseEntity.ok(result);
	}

	// 마이페이지 회원정보 출력 - 로그인 필요
	@GetMapping("/selectInfo")
	public ResponseEntity<MemberDTO> selectInfo(
			 @RequestParam(required = false) String member_id,
			@AuthenticationPrincipal CustomUserDetails user) {
		if (member_id == null || member_id.isEmpty()) {
	        member_id = user.getUsername(); // member_id가 없을 경우 JWT에서 ID 가져오기
	    }

		MemberDTO result = memServ.selectInfo(member_id);
	    result.setPw(null); // pw 값을 null로 설정
		return ResponseEntity.ok(result);
	}

	// 회원정보 수정 - 로그인 필요
	@PutMapping("/updateInfo")
	public ResponseEntity<Integer> updateInfo(@RequestBody MemberDTO dto) {
		int result = memServ.updateInfo(dto);
		return ResponseEntity.ok(result);
	}

	// 비밀번호 변경 시 기존 비밀번호 확인 - 로그인 필요
	@PostMapping("/checkPw")
	public ResponseEntity<Boolean> checkPw(@AuthenticationPrincipal CustomUserDetails user,
			@RequestBody Map<String, String> request) {

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

	// [로그인]비밀번호 찾기 / [마이페이지]비밀번호 변경 - 로그인 필요
	@PutMapping("/updatePw")
	public ResponseEntity<Integer> updatePw(
			@AuthenticationPrincipal CustomUserDetails user,
			@RequestBody Map<String, String> request) {

		String member_id = user.getUsername();
		String pw = pwEncoder.encode(request.get("pw"));
		int result = memServ.updatePw(member_id, pw);

		return ResponseEntity.ok(result);
	}
	
	// 프로필 사진 및 배너 사진 변경 - 로그인 필요
	@PostMapping("/uploadImage")
	public ResponseEntity<String> uploadProfileImage(
		     @RequestPart("file") MultipartFile file,  // FormData에서 이미지 파일을 받음
		     @RequestParam("member_seq") int member_seq,
		     @RequestParam("type") String type
		) {
		    try {
		    	// 1. fileService를 통해 GCS에 이미지 업로드
		    	String code = type.equals("profile") ? "F1" : "F7"; // 타입에 따라 코드 지정		    	
		        String uploadResult = fileServ.upload(file, member_seq, code);

		        // 2. 이미지가 성공적으로 업로드되었는지 확인
		        if (!uploadResult.equals("fail")) {
		        	// 3. DB에 이미지 정보 저장
		        	 int updateResult = type.equals("profile")
		        		? memServ.updateProfileImage(member_seq, uploadResult)  // 프로필 이미지 업데이트
		        		:  memServ.updateBannerImage(member_seq, uploadResult); // 배너 이미지 업데이트
		        	 
		        	 if (updateResult > 0) {
		                    return ResponseEntity.ok(uploadResult); // 업로드된 이미지 URL 반환
		                } else {
		                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 정보 업데이트 실패");
		                }
		        } else {
		            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 업로드 실패");
		        }
		    } catch (Exception e) {
		        e.printStackTrace();
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
		    }
		}
	
	// 프로필 사진 삭제 - 로그인 필요
	@DeleteMapping("/deleteImage")
	public ResponseEntity<String> deleteProfileImage(
			@RequestParam("member_seq") int member_seq,
			 @RequestParam("type") String type) {
	    try {
	        // 1. member_seq로 해당 사용자의 현재 프로필 또는 배너 이미지 URL 가져오기
	    	 String sysName = type.equals("profile") 
                     ? memServ.getProfileImageUrl(member_seq)  // 프로필 이미지 URL 가져오기
                     : memServ.getBannerImageUrl(member_seq);  // 배너 이미지 URL 가져오기
	        
	        if (sysName != null) {
	        	// 1-1. URL에서 마지막 슬래시 뒤의 파일명만 추출
	            String fileName = sysName.substring(sysName.lastIndexOf("/") + 1);
	        	
	        	// 2. fileService를 통해 GCS에서 파일 삭제
	            String result = fileServ.deleteFile(fileName, type.equals("profile") ? "F1" : "F7");

	            // 3. DB에서 member 테이블의 member_avatar를 NULL로 설정
	            if (!result.equals("fail")) {
	                if (type.equals("profile")) {
	                    memServ.updateProfileImageToNull(member_seq); // member_avatar를 NULL로 설정
	                } else {
	                    memServ.updateBannerImageToNull(member_seq); // member_banner를 NULL로 설정
	                }
	                return ResponseEntity.ok("이미지가 성공적으로 삭제되었습니다.");
	            } else {
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("GCS 이미지 삭제 실패");
	            }
	        } else {
	            return ResponseEntity.badRequest().body("해당 사용자의 프로필 이미지가 없습니다.");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 삭제 실패");
	    }
	}

	// 회원탈퇴 - 로그인 필요
	@DeleteMapping("/deleteUser/{member_id}")
	public ResponseEntity<Integer> deleteUser(@PathVariable("member_id") String member_id) {
		int result = memServ.deleteUser(member_id);
		return ResponseEntity.ok(result);
	}
	
	// 팔로우 및 언팔로우 메서드 - 로그인 필요
	@PostMapping("/follow")
	public ResponseEntity<Map<String, Object>> toggleFollow(
	        @RequestBody Map<String, Object> requestBody
	) {
	    try {
	        int fromMemberSeq = (int) requestBody.get("from_member_seq");
	        int toMemberSeq = (int) requestBody.get("to_member_seq");
	        boolean checkStatus = (boolean) requestBody.get("checkStatus");  // 클라이언트에서 전달된 checkStatus 플래그

	        // 이미 팔로우한 상태인지 확인
	        boolean isFollowing = memServ.checkIfUserFollowing(fromMemberSeq, toMemberSeq);

	        Map<String, Object> response = new HashMap<>();
	        
	        if (checkStatus) {
	            // checkStatus가 true이면 상태만 반환하고 추가/취소 작업은 하지 않음
	            response.put("isFollowing", isFollowing);
	            return ResponseEntity.ok(response);
	        }

	        if (isFollowing) {
	            // 팔로우를 취소
	        	memServ.removeFollow(fromMemberSeq, toMemberSeq);
	            response.put("isFollowing", false);
	            response.put("message", "팔로우가 취소되었습니다.");
	        } else {
	            // 팔로우 추가
	        	memServ.addFollow(fromMemberSeq, toMemberSeq);
	            response.put("isFollowing", true);
	            response.put("message", "팔로우가 추가되었습니다.");
	        }
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
	
	 // 팔로워 목록 가져오기 로그인 필요없음
    @GetMapping("/getFollower")
    public ResponseEntity<List<Map<String, Object>>> getFollower(@RequestParam("member_seq") int member_seq) {
    	List<Map<String, Object>> follower = memServ.getFollower(member_seq);
        return ResponseEntity.ok(follower);
    }

    // 팔로잉 목록 가져오기 로그인 필요없음
    @GetMapping("/getFollowing")
    public ResponseEntity<List<Map<String, Object>>> getFollowing(@RequestParam("member_seq") int member_seq) {
    	List<Map<String, Object>> following = memServ.getFollowing(member_seq);
        return ResponseEntity.ok(following);
    }
    
    // 팔로워, 팔로잉 수 가져오기 로그인 필요없음
    @GetMapping("/countFollow")
    public ResponseEntity<Map<String, BigDecimal>> countFollow(@RequestParam("member_seq") int member_seq){
    	Map<String, BigDecimal> result = memServ.countFollow(member_seq);
    	return ResponseEntity.ok(result);
    }
    
    // 맞팔 되어있는지 - 로그인 필요
    @PostMapping("/eachFollow")
    public ResponseEntity<Boolean> eachFollow(@RequestBody Map<String, Integer> params){
    	Boolean result = memServ.eachFollow(params);
    	return ResponseEntity.ok(result);
    }
    
  
	// 마이페이지 게시글(이미지) 출력 로그인 필요없음
	@GetMapping("/selectPost")
	public ResponseEntity<List<Map<String, Object>> > selectPost(@RequestParam String member_id){
		List<Map<String, Object>> result = memServ.selectPostByMemberId(member_id);
		return ResponseEntity.ok(result);
	}

	// 마이페이지 게시글 갯수 로그인 필요없음
	@GetMapping("/countPost")
	public ResponseEntity<Integer> countPost(@RequestParam String member_id){
		int result = memServ.countPost(member_id);
		return ResponseEntity.ok(result);
	}
	
	// 마이페이지 북마크(이미지) 출력 로그인 필요없음
	@GetMapping("/selectBookmark")
	public ResponseEntity<List<Map<String, Object>> > selectBookmark(@RequestParam String member_id){
		List<Map<String, Object>> result = memServ.selectBookmarkByMemberId(member_id);
		return ResponseEntity.ok(result);
	}
	
	// 마이페이지 북마크 갯수 로그인 필요없음
	@GetMapping("/countBookmark")
	public ResponseEntity<Integer> countBookmark(@RequestParam String member_id){
		int result = memServ.countBookmark(member_id);
		return ResponseEntity.ok(result);
	}
	
	// ========================================================[ 관리자 ]
	// 전체 회원조회 (관리자)
	@GetMapping("/all")
	public ResponseEntity<Map<String, Object>> selectAll(@RequestParam int startRow, @RequestParam int endRow,
			@RequestParam(required = false) String chosung, @RequestParam(required = false) String searchTerm) {

		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		params.put("chosung", chosung);
		params.put("searchTerm", searchTerm);
		System.out.println("Start Row: " + startRow + ", End Row: " + endRow);

		List<MemberDTO> members = memServ.selectAll(params);
		int totalCount = memServ.selectMemberCount(params); // 전체 회원 수 조회

		Map<String, Object> response = new HashMap<>();
		response.put("members", members);
		response.put("totalCount", totalCount);

		return ResponseEntity.ok(response);
	}

	// 회원 상세조회 (관리자)
	@GetMapping("/detail")
	public ResponseEntity<MemberDTO> detailmember(@RequestParam String member_id) {
		MemberDTO member = memServ.detailmember(member_id);
		return ResponseEntity.ok(member);
	}

	// 전체 등급 정보 가져오기
	@GetMapping("/grades")
	public ResponseEntity<List<GradeDTO>> getAllGrades() {
		List<GradeDTO> grades = memServ.getAllGrades();
		return ResponseEntity.ok(grades);
	}

	// 전체 역할 정보 가져오기
	@GetMapping("/roles")
	public ResponseEntity<List<RoleDTO>> getAllRoles() {
		List<RoleDTO> roles = memServ.getAllRoles();
		return ResponseEntity.ok(roles);
	}

	// 등급 및 역할 동시에 업데이트 (블랙리스트 등록 포함)
	@PutMapping("/updateMemberStatus")
	public ResponseEntity<Integer> updateMemberStatus(@RequestBody Map<String, String> request) {
	    String memberId = request.get("member_id");
	    String newGradeCode = request.get("grade_code");
	    String newRoleCode = request.get("role_code");

	    // 새로운 역할이 블랙리스트일 경우 블랙리스트 사유 코드도 함께 처리
	    String blacklistReasonCode = request.get("blacklist_reason_code");

	    // 등급 업데이트
	    int gradeResult = memServ.updateGrade(memberId, newGradeCode);

	    // 역할 업데이트
	    int roleResult = memServ.updateRole(memberId, newRoleCode);

	    // 만약 역할이 블랙리스트로 지정되었다면, 블랙리스트 사유를 추가로 처리
	    if ("R3".equals(newRoleCode) && blacklistReasonCode != null) {
	        memServ.addBlacklist(memberId, blacklistReasonCode);
	    }

	    return ResponseEntity.ok(gradeResult + roleResult); // 결과 반환
	}

	// 전체 블랙리스트 사유 가져오기 (관리자)
	@GetMapping("/blacklistreason")
	public ResponseEntity<List<BlacklistReasonDTO>> getAllBlacklistReason() {
		List<BlacklistReasonDTO> blacklistreasons = memServ.getAllBlacklistReason();
		System.out.println("컨트롤러 사유 : " + blacklistreasons);
		return ResponseEntity.ok(blacklistreasons);
	}
	
	// 블랙리스트 조회 (관리자)
	@GetMapping("/blacklist")
	public ResponseEntity<Map<String, Object>> selectBlacklist(@RequestParam int startRow, @RequestParam int endRow,
			@RequestParam(required = false) String chosung, @RequestParam(required = false) String searchTerm) {

		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		params.put("chosung", chosung);
		params.put("searchTerm", searchTerm);

		// 블랙리스트 목록 조회
		List<MemberDTO> blacklist = memServ.selectBlacklist(params);
		System.out.println(blacklist);
		// 블랙리스트 총 수 카운트
		int totalCount = memServ.selectBlacklistCount(params);

		// 응답 데이터로 블랙리스트 목록과 총 수를 반환
		Map<String, Object> response = new HashMap<>();
		response.put("blacklist", blacklist);
		response.put("totalCount", totalCount);

		return ResponseEntity.ok(response);
	}

	// 블랙리스트 수정(해제) (관리자)
	@PutMapping("/modifyBlacklist")
	public ResponseEntity<Integer> modifyBlacklist(@RequestBody Map<String, String> request) {
		String memberId = request.get("member_id");
		int result = memServ.modifyBlacklist(memberId);
		return ResponseEntity.ok(result);
	}

	// 연령대별 남녀 회원 수 조회 (관리자)
	@GetMapping("/getAgeGenderDistribution")
	public ResponseEntity<List<Map<String, Object>>> getAgeGenderDistribution() throws Exception {
		List<Map<String, Object>> result = memServ.getAgeGenderDistribution();
		return ResponseEntity.ok(result);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}

}
