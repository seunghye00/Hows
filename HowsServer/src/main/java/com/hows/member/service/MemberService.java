package com.hows.member.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

	// 아이디 찾기
//	public MemberDTO findById (String id) {
//		return memDao.findById(id);
//	}

	// 회원정보 가져오기
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		MemberDTO dto = memDao.findById(username);

		User user = new User(dto.getMember_id(), dto.getPw(), AuthorityUtils.createAuthorityList(dto.getRole_code()));
		return user;
	}

	// 마이페이지 회원정보 출력
//	public MemberDTO selectInfo(String loginId) {
//		return memDao.selectInfo(loginId);
//	}

	// 비밀번호 변경시 기존 비밀번호 확인
	public String getPasswordById(HashMap<String, String> map) {
		return memDao.getPasswordById(map);
	}

	// 비밀번호 변경
	public int updatePw(HashMap<String, String> map) {
		return memDao.updatePw(map);
	}

	// 전체 회원조회 (관리자)
	public List<MemberDTO> selectAll() {
		return memDao.selectAll();
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
	public int updateGrade(String memberId, String newGradeCode) {
		HashMap<String, String> map = new HashMap<>();
		map.put("member_id", memberId);
		map.put("grade_code", newGradeCode);

		return memDao.updateGrade(map);
	}

	// 역할 업데이트 (관리자)
	public int updateRole(String memberId, String newRoleCode) {
		HashMap<String, String> map = new HashMap<>();
		map.put("member_id", memberId);
		map.put("role_code", newRoleCode);

		return memDao.updateRole(map);
	}

	// 전체 블랙리스트 사유 가져오기 (관리자)
	public List<BlacklistReasonDTO> getAllBlacklistReason() {
		return memDao.getAllBlacklistReason();
	}

	// 블랙리스트 등록 (관리자)
	public int addBlacklist(String memberId, String reasonCode) {
		HashMap<String, String> map = new HashMap<>();
		map.put("member_id", memberId);
		map.put("blacklist_reason_code", reasonCode);

		return memDao.addBlacklist(map);
	}

}
