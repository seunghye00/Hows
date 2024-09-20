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

	// selectCommunityPosts를 호출하여 게시글 리스트를 가져오는 메서드
	public List<Map<String, Object>> selectCommunityPosts(Map<String, Object> params) {
		return mybatis.selectList("Community.selectCommunityPosts", params);
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

	// 게시글 업데이트
	public void updateWrite(CommunityDTO dto) throws Exception {
		mybatis.update("Community.updateWrite", dto); // 게시글 업데이트 SQL 실행
	}

	// 이미지 수정 시 삭제
	public void deleteImage(String imageUrl) {
		mybatis.delete("Community.deleteImage", imageUrl);
	}

	// 이미지 순서 업데이트
	public void updateImageOrder(String imageUrl, int imageOrder) throws Exception {
		Map<String, Object> params = new HashMap<>();
		params.put("image_url", imageUrl);
		params.put("image_order", imageOrder);
		mybatis.update("Community.updateImageOrder", params); // 이미지 순서 업데이트 SQL 실행
	}

	// 게시글 수정 이미지 주소
	public List<String> selectImagesUrls(int board_seq) {
		return mybatis.selectList("Community.selectImagesUrls", board_seq);
	}

	// DB에서 imageUrl로 board_image_seq를 조회하는 로직
	public int selectBoardImageSeqByUrl(String imageUrl) {
		return mybatis.selectOne("Community.selectBoardImageSeqByUrl", imageUrl);
	}

	// 수정 시 태그정보 가져오는 로직
	public List<TagDTO> selectTagsByImageSeq(int boardImageSeq) {
		return mybatis.selectList("Community.selectTagsByImageSeq", boardImageSeq);
	}

	// 수정 시 태그정보 삭제
	public void deleteTag(int tagSeq) {
		mybatis.delete("Community.deleteTag", tagSeq);
	}

	// 사용자가 특정 게시글에 좋아요를 눌렀는지 확인
	public boolean checkIfUserLikedBoard(String member_id, int board_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("board_seq", board_seq);

		Integer result = mybatis.selectOne("Community.checkIfUserLikedBoard", params);
		return result != null && result > 0;
	}

	// 게시글에 좋아요 추가
	public void addLike(String member_id, int board_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("board_seq", board_seq);

		mybatis.insert("Community.addLike", params);
	}

	// 게시글에 좋아요 제거
	public void removeLike(String member_id, int board_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("board_seq", board_seq);

		mybatis.delete("Community.removeLike", params);
	}

	// 특정 게시글의 좋아요 개수 가져오기
	public int getLikeCount(int board_seq) {
		return mybatis.selectOne("Community.getLikeCount", board_seq);
	}

	// 사용자가 특정 게시글에 북마크를 했는지 확인
	public boolean checkIfUserBookmarkedBoard(String member_id, int board_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("board_seq", board_seq);

		Integer result = mybatis.selectOne("Community.checkIfUserBookmarkedBoard", params);
		return result != null && result > 0;
	}

	// 게시글에 북마크 추가
	public void addBookmark(String member_id, int board_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("board_seq", board_seq);

		mybatis.insert("Community.addBookmark", params);
	}

	// 게시글에 북마크 제거
	public void removeBookmark(String member_id, int board_seq) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_id", member_id);
		params.put("board_seq", board_seq);

		mybatis.delete("Community.removeBookmark", params);
	}

	// 특정 게시글의 북마크 개수 가져오기
	public int getBookmarkCount(int board_seq) {
		return mybatis.selectOne("Community.getBookmarkCount", board_seq);
	}

	// 특정 게시글의 북마크 개수 가져오기
	public void updateViewCount(int board_seq) {
		mybatis.update("Community.updateViewCount", board_seq);
	}

	// 조회수 가져오기 서비스 메서드
	public int getViewCount(int board_seq) {
		return mybatis.selectOne("Community.getViewCount", board_seq);
	}

	// 게시글 신고하기
	public void sendReport(int board_seq, String reportCode, String memberId) {
		Map<String, Object> params = new HashMap<>();
		params.put("board_seq", board_seq);
		params.put("report_code", reportCode);
		params.put("member_id", memberId);
		mybatis.insert("Community.sendReport", params);
	}

	// [마이페이지] 게시글(이미지) 출력
	public List<Map<String, Object>> selectPostByMemberId(String member_id) {
		return mybatis.selectList("Community.selectPostByMemberId", member_id);
	}

	// [마이페이지] 게시글 갯수
	public int countPost(String member_id) {
		return mybatis.selectOne("Community.countPost", member_id);
	}

    // [마이페이지] 북마크(이미지) 출력
    public List<Map<String, Object>> selectBookmarkByMemberId(String member_id){
    	return mybatis.selectList("Community.selectBookmarkByMemberId", member_id);
    }
 
    // [마이페이지] 사용자의 게시글 북마크 갯수
    public int countBookmark(String member_id) {
    	return mybatis.selectOne("Community.countBookmark", member_id);
    }
    
	// 게시글 이미지 조회 
    public List<String> getFileURLsByBoardSeq(int board_seq) {
        return mybatis.selectList("Community.getFileURLsByBoardSeq",board_seq);
    }
    
    // 사용자 구매내역 
 	public List<Map<String, Object>> purchaseHistory(int member_seq) {
 	    return mybatis.selectList("Community.purchaseHistory", member_seq); 
 	}
 	
	// 관리자
	// 신고된 게시물 조회 DAO
	public List<Map<String, Object>> reportedCommunity(Map<String, Object> params) {
		return mybatis.selectList("Community.reportedCommunity", params);
	}

	// 전체 신고된 게시물 수 조회 DAO
	public int getReportedCommunityCount(Map<String, Object> params) {
		return mybatis.selectOne("Community.getReportedCommunityCount", params);
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

	// 주거 형태별 게시글 수 조회
	public List<Map<String, Object>> getPostCountByHousingType() {
		return mybatis.selectList("Community.getPostCountByHousingType");
	}

	// 주거 형태별 게시글 수 조회
	public List<Map<String, Object>> getPostCountBySpaceType() {
		return mybatis.selectList("Community.getPostCountBySpaceType");
	}

	// 주거 형태별 게시글 수 조회
	public List<Map<String, Object>> getPostCountByAreaSize() {
		return mybatis.selectList("Community.getPostCountByAreaSize");
	}

	// 주거 형태별 게시글 수 조회
	public List<Map<String, Object>> getPostCountByColor() {
		return mybatis.selectList("Community.getPostCountByColor");
	}

	// 오늘 작성된 게시글 수 조회
	public int todayBoardNum() {
		return mybatis.selectOne("Community.todayBoardNum");
	}

}
