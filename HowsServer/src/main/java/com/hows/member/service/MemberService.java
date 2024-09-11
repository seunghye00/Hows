package com.hows.member.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hows.common.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hows.blacklistreason.dto.BlacklistReasonDTO;
import com.hows.grade.dto.GradeDTO;
import com.hows.member.dao.MemberDAO;
import com.hows.member.dto.MemberDTO;
import com.hows.role.dto.RoleDTO;

@Service
public class MemberService implements UserDetailsService {

	@Autowired
	private MemberDAO memDao;

	// 회원가입
	public void insert(MemberDTO dto) {
		memDao.insert(dto);
	}

	// 중복확인 - ID
	public boolean checkId(String member_id) {
		return memDao.checkId(member_id);
	}

	// 중복확인 - 닉네임
	public boolean checkNickname(String nickname) {
		return memDao.checkNickname(nickname);
	}

	// 중복확인 - 이메일
	public boolean checkEmail(String email) {
		return memDao.checkEmail(email);
	}

	// [로그인]비밀번호 찾기 - 비밀번호 변경
	public int changePw(Map<String, String> map) {
		return memDao.changePw(map);
	}

	// 회원정보 가져오기
	@Override
	public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		MemberDTO dto = memDao.findById(username);

		if (dto == null)
			throw new UsernameNotFoundException("User not found");

		return new CustomUserDetails(dto.getMember_id(), dto.getPw(),
				AuthorityUtils.createAuthorityList(dto.getRole_code()), dto.getMember_seq());
	}

	// 아이디 찾기
	public String findId(Map<String, String> map) {
		return memDao.findId(map);
	}

	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증
	public Boolean verifyUser(Map<String, String> map) {
		return memDao.verifyUser(map);
	}

	// 마이페이지 회원정보 출력
	public MemberDTO selectInfo(String member_id) {
		return memDao.selectInfo(member_id);
	}

	// 회원정보 수정
	public int updateInfo(MemberDTO dto) {
		return memDao.updateInfo(dto);
	}
	
	// 프로필 사진 변경
	public int updateProfileImage(int memberSeq, String imageUrl) {
		Map<String, Object> map = new HashMap<>();
	    map.put("member_seq", memberSeq);
	    map.put("member_avatar", imageUrl);
		
	    return memDao.updateProfileImage(map);
	}
	
	// 현재 프로필 사진 URL 가져오기
	public String getProfileImageUrl(int member_seq) {
	    return memDao.getProfileImageUrl(member_seq); // member 테이블에서 member_avatar 가져오는 쿼리
	}

	// 프로필 삭제 시 member_avatar => null 
	 public void updateProfileImageToNull(int member_seq) {
		 memDao.updateProfileImageToNull(member_seq);
	    }


	// 비밀번호 변경시 기존 비밀번호 확인
	public String getPasswordById(HashMap<String, String> map) {
		return memDao.getPasswordById(map);
	}

	// 비밀번호 변경
	public int updatePw(HashMap<String, String> map) {
		return memDao.updatePw(map);
	}

	// 회원탈퇴
	public int deleteUser(String member_id) {
		return memDao.deleteUser(member_id);
	}

	// [방명록] 방명록 작성 위한 member_seq 뽑기
	public int findMemberSeq(String member_id) {
		return memDao.findMemberSeq(member_id);
	}
	
    // 팔로우 상태 확인
    public boolean checkIfUserFollowing(int fromMemberSeq, int toMemberSeq) {
        return memDao.checkIfUserFollowing(fromMemberSeq, toMemberSeq);
    }

    // 팔로우 추가
    public void addFollow(int fromMemberSeq, int toMemberSeq) {
    	memDao.addFollow(fromMemberSeq, toMemberSeq);
    }

    // 팔로우 취소
    public void removeFollow(int fromMemberSeq, int toMemberSeq) {
    	memDao.removeFollow(fromMemberSeq, toMemberSeq);
    }
	// ========================================[ 관리자 ]
	// 전체 회원조회 (관리자)
	public List<MemberDTO> selectAll(Map<String, Object> params) {
		return memDao.selectAll(params);
	}

	// 전체 회원 수 조회 (관리자)
	public int selectMemberCount(Map<String, Object> params) {
		return memDao.selectMemberCount(params);
	}

	// 회원 상세조회 (관리자)
	public MemberDTO detailmember(String member_id) {
		return memDao.detailmember(member_id);
	}

	// 전체 등급 정보 가져오기
	public List<GradeDTO> getAllGrades() {
		return memDao.getAllGrades();
	}

	// 전체 역할 정보 가져오기
	public List<RoleDTO> getAllRoles() {
		return memDao.getAllRoles();
	}

	// 등급 업데이트 (관리자)
	public int updateGrade(String member_id, String grade_code) {
		return memDao.updateGrade(member_id, grade_code);
	}

	// 역할 업데이트 (관리자)
	public int updateRole(String member_id, String role_code) {
		return memDao.updateRole(member_id, role_code);
	}

	// 전체 블랙리스트 사유 가져오기 (관리자)
	public List<BlacklistReasonDTO> getAllBlacklistReason() {
		return memDao.getAllBlacklistReason();
	}

	// 블랙리스트 등록 (관리자)
	public int addBlacklist(String member_id, String blacklist_reason_code) {
		return memDao.addBlacklist(member_id, blacklist_reason_code);
	}

	// 블랙리스트 조회 (관리자)
	public List<MemberDTO> selectBlacklist(Map<String, Object> params) {
		return memDao.selectBlacklist(params);
	}

	// 블랙리스트 수 카운트 (관리자)
	public int selectBlacklistCount(Map<String, Object> params) {
		return memDao.selectBlacklistCount(params);
	}

	// 블랙리스트 수정 (관리자)
	public int modifyBlacklist(String member_id) {
		return memDao.modifyBlacklist(member_id);
	}

	public int getMemberSeq() {
		// TODO Auto-generated method stub
		return 0;
	}
}
