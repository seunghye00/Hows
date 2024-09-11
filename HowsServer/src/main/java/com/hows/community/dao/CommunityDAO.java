package com.hows.community.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.BoardReportDTO;
import com.hows.community.dto.CommunityDTO;
import com.hows.community.dto.ImageDTO;
import com.hows.community.dto.TagDTO;

@Repository
public class CommunityDAO {
	@Autowired
	private SqlSession mybatis;

	// 게시판 게시글 및 태그 입력
	public int insertWrite(CommunityDTO dto) {
		mybatis.insert("Community.insertWrite", dto);
		return dto.getBoard_seq();
	}

	// 이미지 저장 후 시퀀스 반환
	public int insertImage(ImageDTO imageDTO) {
		mybatis.insert("Community.insertImage", imageDTO);
		return imageDTO.getBoard_image_seq(); // 반환된 이미지 시퀀스 값
	}

	// 태그 저장
	public void insertTag(TagDTO tagDTO) {
		mybatis.insert("Community.insertTag", tagDTO);
	}

	// 게시글 리스트 출력
	public List<Map<String, Object>> selectAll() {
		return mybatis.selectList("Community.selectAll");
	}

	// 게시글 리스트 이미지 출력
	public List<Map<String, Object>> selectAllImg() {
		return mybatis.selectList("Community.selectAllImg");
	}

	// 게시글 리스트 게시글 정보 출력
	public Map<String, Object> selectAllSeq(int board_seq) {
		return mybatis.selectOne("Community.selectAllSeq", board_seq);
	}

	// 게시글 리스트 이미지 정보 출력
	public List<Map<String, Object>> selectImages(int board_seq) {
		return mybatis.selectList("Community.selectImages", board_seq);
	}

	// 게시글 리스트 상품태그 정보 출력
	public List<Map<String, Object>> selectTagsAndProductInfo(int board_seq) {
		return mybatis.selectList("Community.selectTagsAndProductInfo", board_seq);
	}

	// 관리자
	// 게시물 신고 조회 (관리자)
	public List<Map<String, Object>> reportedCommunity(int startRow, int endRow) throws Exception {
	    Map<String, Object> params = new HashMap<>();
	    params.put("startRow", startRow);
	    params.put("endRow", endRow);
		return mybatis.selectList("Community.reportedCommunity", params);
	}
	
	// 전체 신고된 게시물 카운트 조회 (관리자)
	public int getReportedCommunityCount() throws Exception {
	    return mybatis.selectOne("Community.getReportedCommunityCount");
	}
	
	// 게시물 내역 조회 (관리자)
	public List<BoardReportDTO> CommunityReport(int board_seq) throws Exception {
		return mybatis.selectList("Community.CommunityReport", board_seq);
	}
	
	// 신고 게시물 삭제 (관리자)
	public int deleteCommunityReport(int board_seq) throws Exception {
	    return mybatis.delete("Community.deleteCommunityReport", board_seq);
	}

	// 게시판 삭제 (관리자)
	public int deleteCommunity(int board_seq) throws Exception {
	    return mybatis.delete("Community.deleteCommunity", board_seq);
	}
}
