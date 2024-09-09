package com.hows.member.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.blacklistreason.dto.BlacklistReasonDTO;
import com.hows.grade.dto.GradeDTO;
import com.hows.member.dto.MemberDTO;
import com.hows.role.dto.RoleDTO;

@Repository
public class MemberDAO {

	@Autowired
	private SqlSession mybatis;

	// 회원가입
	public void insert(MemberDTO dto) {
		mybatis.insert("Member.insert", dto);
	}
	
	// 중복확인 - ID
	public boolean checkId(String member_id) {
		Integer count = mybatis.selectOne("Member.checkId", member_id);
		return count != null && count > 0;
	}
	
	// 중복확인 - 닉네임
	public boolean checkNickname(String nickname) {
		Integer count = mybatis.selectOne("Member.checkNickname", nickname);
		return count != null && count > 0;
	}

	// 중복확인 - 이메일
	public boolean checkEmail(String email) {
		Integer count = mybatis.selectOne("Member.checkEmail", email);
		return count != null && count > 0;
	}
	
	// [로그인]비밀번호 찾기 - 비밀번호 변경
	public int changePw(Map<String, String> map) {
		return mybatis.update("Member.changePw", map);
	}
	
	
	
	// 아이디 찾기
	public String findId(Map<String, String> map) {
		return mybatis.selectOne("Member.findId", map);
	}
	
	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증
	public boolean verifyUser(Map<String, String> map) {
		Integer count =  mybatis.selectOne("Member.verifyUser", map);
		return count != null && count > 0;
	}
	
	
	// 아이디로 회원 불러오기

	// 회원정보 가져오기
	public MemberDTO findById(String id) {
		return mybatis.selectOne("Member.findById", id);
	}

	// 마이페이지 회원정보 출력
	public MemberDTO selectInfo(String member_id) {
		return mybatis.selectOne("Member.selectInfo", member_id);
	}
	
	// 회원정보 수정
	public int updateInfo(MemberDTO dto) {
		return mybatis.update("Member.updateInfo", dto);
	}

	// 비밀번호 변경시 기존 비밀번호 확인
	public String getPasswordById(HashMap<String, String> map) {
		return mybatis.selectOne("Member.getPasswordById", map);
	}

	// 비밀번호 변경
	public int updatePw(HashMap<String, String> map) {
		return mybatis.update("Member.updatePw", map);
	}
	
	// 회원탈퇴
	public int deleteUser(String member_id) {
		return mybatis.delete("Member.deleteUser", member_id);
	}

	
	//=======================================================[ 관리자 ]
	// 전체 회원조회 (관리자)
	public List<MemberDTO> selectAll() {
		return mybatis.selectList("Member.selectAll");
	}

	// 회원 상세조회 (관리자)
	public MemberDTO detailmember(String member_id) {
		return mybatis.selectOne("Member.detailmember", member_id);
	}

	// 전체 등급 정보 가져오기
	public List<GradeDTO> getAllGrades() {
		return mybatis.selectList("Member.AllGrades");
	}

	// 전체 역할 정보 가져오기
	public List<RoleDTO> getAllRoles() {
		return mybatis.selectList("Member.AllRoles");
	}

	// 등급 업데이트 (관리자)
	public int updateGrade(HashMap<String, String> map) {
		return mybatis.update("Member.updateGrade", map);
	}

	// 역할 업데이트 (관리자)
	public int updateRole(HashMap<String, String> map) {
		return mybatis.update("Member.updateRole", map);
	}

	// 전체 블랙리스트 사유 가져오기 (관리자)
	public List<BlacklistReasonDTO> getAllBlacklistReason() {
		return mybatis.selectList("Member.getAllBlacklistReason");
	}

	// 블랙리스트 등록 (관리자)
	public int addBlacklist(HashMap<String, String> map) {
		return mybatis.update("Member.addBlacklist", map);
	}

	// 블랙리스트 조회 (관리자)
	public List<MemberDTO> selectBlacklist() {
		return mybatis.selectList("Member.selectBlacklist");
	}

	// 블랙리스트 수정 (관리자)
	public int modifyBlacklist(String member_id) {
		return mybatis.update("Member.modifyBlacklist", member_id);
	}

}
