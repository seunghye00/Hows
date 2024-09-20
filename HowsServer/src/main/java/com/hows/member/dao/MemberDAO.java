package com.hows.member.dao;

import java.math.BigDecimal;
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

	// 로그인 시 role_code 가져오기
	public String getRoleCode(String member_id) {
		return mybatis.selectOne("Member.getRoleCode", member_id);
	}
	
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

	// 아이디 찾기
	public String findId(Map<String, String> map) {
		return mybatis.selectOne("Member.findId", map);
	}

	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증
	public boolean verifyUser(Map<String, String> map) {
		Integer count = mybatis.selectOne("Member.verifyUser", map);
		return count != null && count > 0;
	}
	
	// [로그인] 비밀번호 찾기 - 임시 비밀번호 업데이트
	public int updateTempPassword(String member_id, String pw) {
        Map<String, Object> params = new HashMap<>();
        params.put("member_id", member_id);
        params.put("pw", pw);
        return mybatis.update("Member.updateTempPassword", params);
    }
	
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
	
	// 프로필 사진 변경
	public int updateProfileImage(Map<String, Object> map) {
	    return mybatis.update("Member.updateProfileImage", map);
	}

	// 배너 사진 변경
	public int updateBannerImage(Map<String, Object> map) {
		return mybatis.update("Member.updateBannerImage", map);
	}
	
	// 현재 프로필 사진 URL 가져오기
	public String getProfileImageUrl(int member_seq) {
		return mybatis.selectOne("Member.getProfileImageUrl",member_seq);
	}
	// 현재 배너 사진 URL 가져오기
	public String getBannerImageUrl(int member_seq) {
		return mybatis.selectOne("Member.getBannerImageUrl",member_seq);
	}
	
	// 프로필 삭제 시 member_avatar => null 
	public void updateProfileImageToNull(int member_seq) {
		mybatis.update("Member.updateProfileImageToNull", member_seq);
	}
	// 배너 삭제 시 member_banner => null 
	public void updateBannerImageToNull(int member_seq) {
		mybatis.update("Member.updateBannerImageToNull", member_seq);
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

	// [방명록] 방명록 작성 위한 member_seq 뽑기
	 public int findMemberSeq(String member_id) {
        return mybatis.selectOne("Member.findMemberSeq", member_id);
     }

    // 팔로우 상태 확인
    public boolean checkIfUserFollowing(int fromMemberSeq, int toMemberSeq) {
        return mybatis.selectOne("Member.checkIfUserFollowing", Map.of("from_member_seq", fromMemberSeq, "to_member_seq", toMemberSeq));
    }

    // 팔로우 추가
    public void addFollow(int fromMemberSeq, int toMemberSeq) {
        mybatis.insert("Member.addFollow", Map.of("from_member_seq", fromMemberSeq, "to_member_seq", toMemberSeq));
    }

    // 팔로우 취소
    public void removeFollow(int fromMemberSeq, int toMemberSeq) {
        mybatis.delete("Member.removeFollow", Map.of("from_member_seq", fromMemberSeq, "to_member_seq", toMemberSeq));
    } 

    // 팔로워 목록 가져오기
    public List<Map<String, Object>> getFollower(int member_seq) {
    	return mybatis.selectList("Member.getFollower", member_seq);
    }
    
    // 팔로잉 목록 가져오기
    public List<Map<String, Object>> getFollowing(int member_seq) {
    	return mybatis.selectList("Member.getFollowing", member_seq);
    }
    
    // 팔로워, 팔로잉 수 가져오기
    public Map<String, BigDecimal> countFollow(int member_seq){
    	Map<String, Integer> map = mybatis.selectOne("Member.countFollow", member_seq);
    	return mybatis.selectOne("Member.countFollow", member_seq);
    }
    
    // 맞팔 되어있는지
    public Boolean eachFollow(Map<String, Integer> params) {
    	Integer count = mybatis.selectOne("Member.eachFollow", params);
		return count != null && count > 0;
    }
	 
	// =======================================================[ 관리자 ]
	// 전체 회원조회 (관리자)
	public List<MemberDTO> selectAll(Map<String, Object> params) {
		System.out.println("DAO 전체회원 조회 : " + mybatis.selectList("Member.selectAll", params));
		return mybatis.selectList("Member.selectAll", params);
	}

	// 전체 회원 수 조회 (관리자)
	public int selectMemberCount(Map<String, Object> params) {
		return mybatis.selectOne("Member.selectMemberCount", params);
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
	public int updateGrade(String member_id, String grade_code) {
		HashMap<String, String> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("grade_code", grade_code);

		System.out.println("DAO등급 : " + grade_code);

		return mybatis.update("Member.updateGrade", params);
	}

	// 역할 업데이트 (관리자)
	public int updateRole(String member_id, String role_code) {
		HashMap<String, String> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("role_code", role_code);

		System.out.println("DAO역할 : " + role_code);

		return mybatis.update("Member.updateRole", params);
	}

	// 전체 블랙리스트 사유 가져오기 (관리자)
	public List<BlacklistReasonDTO> getAllBlacklistReason() {
		return mybatis.selectList("Member.getAllBlacklistReason");
	}

	// 블랙리스트 등록 (관리자)
	public int addBlacklist(String member_id, String blacklist_reason_code) {
		HashMap<String, String> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("blacklist_reason_code", blacklist_reason_code);

		return mybatis.update("Member.addBlacklist", params);
	}

	// 블랙리스트 조회 (관리자)
	public List<MemberDTO> selectBlacklist(Map<String, Object> params) {
	    return mybatis.selectList("Member.selectBlacklist", params);
	}
	
	// 블랙리스트 수 카운트 (관리자)
	public int selectBlacklistCount(Map<String, Object> params) {
	    return mybatis.selectOne("Member.selectBlacklistCount", params);
	}

	// 블랙리스트 수정 (관리자)
	public int modifyBlacklist(String member_id) {
		return mybatis.update("Member.modifyBlacklist", member_id);
	}

	// 연령대별 남녀 회원 수 조회
	public List<Map<String, Object>> getAgeGenderDistribution() {
		return mybatis.selectList("Member.getAgeGenderDistribution");
	}

}
