package com.hows.community.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hows.community.dao.CommunityDAO;
import com.hows.community.dto.BoardReportDTO;
import com.hows.community.dto.CommunityDTO;
import com.hows.community.dto.ImageDTO;
import com.hows.community.dto.TagDTO;

@Service
public class CommunityService {
	@Autowired
	private CommunityDAO communityDAO;

	// 이미지 저장 후 시퀀스 반환
	public int insertImage(ImageDTO imageDTO) {
		return communityDAO.insertImage(imageDTO); // 이미지 저장 후 시퀀스 값 반환
	}

	// 태그 저장
	public void insertTag(TagDTO tagDTO) {
		communityDAO.insertTag(tagDTO);
	}

	// 게시글 리스트 출력
	public List<Map<String, Object>> selectAll() {
		return communityDAO.selectAll();
	}
	
    // 필터링 조건을 처리하여 DAO에 넘기는 메서드
    public List<Map<String, Object>> selectCommunityPosts(int page, int limit, String keyword, String sort, String housingType, String spaceType, String areaSize, String color) {
    	System.out.println(sort);
        // 필터링 조건을 저장할 Map 생성
        Map<String, Object> params = new HashMap<>();
        params.put("keyword", keyword);
        params.put("sort", sort);
        params.put("housingType", housingType);
        params.put("spaceType", spaceType);
        params.put("areaSize", areaSize);
        params.put("color", color);
       
        // DAO에서 필터링된 게시글 리스트 가져오기
        return communityDAO.selectCommunityPosts(params);
    }
    
	// 게시글 리스트 이미지 출력
	public List<Map<String, Object>> selectAllImg() {
		return communityDAO.selectAllImg();
	}

	// 게시글 디테일
	public Map<String, Object> selectAllSeq(int board_seq) {
		return communityDAO.selectAllSeq(board_seq);
	}

	// 게시글 디테일 이미지
	public List<Map<String, Object>> selectImages(int board_seq) {
		return communityDAO.selectImages(board_seq);
	}

	// 게시글 디테일 상품태그
	public List<Map<String, Object>> selectTagsAndProductInfo(int board_seq) {
		return communityDAO.selectTagsAndProductInfo(board_seq);
	}
	
    // 게시글 업데이트 (내용 수정 등)
    public void updateWrite(CommunityDTO dto) throws Exception {
        communityDAO.updateWrite(dto); // DAO를 통해 게시글 업데이트 실행
    }

    // 이미지 순서 업데이트
    public void updateImageOrder(String imageUrl, int imageOrder) throws Exception {
        communityDAO.updateImageOrder(imageUrl, imageOrder); // DAO를 통해 이미지 순서 업데이트
    }
    
    // 게시글 수정 이미지 주소
	public List<String> selectImagesUrls(int board_seq) {
		return communityDAO.selectImagesUrls(board_seq);
	}
    
    // 이미지 수정 시 삭제 
    public void deleteImage(String imageUrl) {
    	System.out.println("들어오는지 확인");
        communityDAO.deleteImage(imageUrl);
    }
    
    // DB에서 imageUrl로 board_image_seq를 조회하는 로직
    public int selectBoardImageSeqByUrl(String imageUrl) {
        return communityDAO.selectBoardImageSeqByUrl(imageUrl); 
    }
    
    // 수정 시 태그정보 가져오는 로직     
    public List<TagDTO> selectTagsByImageSeq(int boardImageSeq) {
        return communityDAO.selectTagsByImageSeq(boardImageSeq);
    }
    
    // 수정 시 태그정보 삭제
    public void deleteTag(int tagSeq) {
        communityDAO.deleteTag(tagSeq);
    }
    
	// 사용자가 이미 좋아요를 눌렀는지 확인
	public boolean checkIfUserLikedBoard(String memberId, int boardSeq) {
		return communityDAO.checkIfUserLikedBoard(memberId, boardSeq);
	}

	// 좋아요 추가
	public void addLike(String memberId, int boardSeq) {
		communityDAO.addLike(memberId, boardSeq);
	}

	// 좋아요 취소
	public void removeLike(String memberId, int boardSeq) {
		communityDAO.removeLike(memberId, boardSeq);
	}

	// 게시글의 총 좋아요 수 가져오기
	public int getLikeCount(int boardSeq) {
		return communityDAO.getLikeCount(boardSeq);
	}

	// 사용자가 이미 북마크를 눌렀는지 확인
	public boolean checkIfUserBookmarkedBoard(String memberId, int boardSeq) {
		return communityDAO.checkIfUserBookmarkedBoard(memberId, boardSeq);
	}

	// 북마크 추가
	public void addBookmark(String memberId, int boardSeq) {
		communityDAO.addBookmark(memberId, boardSeq);
	}

	// 북마크 취소
	public void removeBookmark(String memberId, int boardSeq) {
		communityDAO.removeBookmark(memberId, boardSeq);
	}

	// 게시글의 총 북마크 수 가져오기
	public int getBookmarkCount(int boardSeq) {
		return communityDAO.getBookmarkCount(boardSeq);
	}

	// 게시글 입력 및 현재 시퀀스 값 반환
	public int insertWrite(CommunityDTO dto) {
		return communityDAO.insertWrite(dto);
	}

	// 조회수 증가 메서드
	public void incrementViewCount(int board_seq) {
		// 조회수 증가 쿼리 실행
		communityDAO.updateViewCount(board_seq);
	}

	// 조회수 가져오기 서비스 메서드
	public int getViewCount(int board_seq) {
		return communityDAO.getViewCount(board_seq); // 현재 조회수 반환
	}

	// 게시물 신고
	public void sendReport(int boardSeq, String reportCode, String memberId) {
		communityDAO.sendReport(boardSeq, reportCode, memberId); // 현재 조회수 반환
	}

	// 게시글 이미지 조회 
	public List<String> getFileURLsForBoard(int board_seq) throws Exception {
	    return communityDAO.getFileURLsByBoardSeq(board_seq); // board_seq로 URL 목록 가져오는 DAO 호출
	}
	
	// 사용자 구매내역 
	public List<Map<String, Object>> purchaseHistory(int member_seq) throws Exception {
	    return communityDAO.purchaseHistory(member_seq); 
	}
	// 관리자
	// 게시물 신고 조회 (관리자)
	public List<Map<String, Object>> reportedCommunity(Map<String, Object> params) throws Exception {
		return communityDAO.reportedCommunity(params);
	}

	// 전체 신고된 게시물 카운트 조회 (관리자)
	public int getReportedCommunityCount(Map<String, Object> params) throws Exception {
		return communityDAO.getReportedCommunityCount(params);
	}

	// 게시물 내역 조회 (관리자)
	public List<BoardReportDTO> CommunityReport(int board_seq) throws Exception {
		return communityDAO.CommunityReport(board_seq);
	}

	// 신고 게시물 삭제 (관리자)
	@Transactional
	public int deleteCommunity(int board_seq) throws Exception {
		// 신고 기록 삭제
		communityDAO.deleteCommunityReport(board_seq);
		// 게시물 삭제
		return communityDAO.deleteCommunity(board_seq);
	}

	// 카테고리별 게시글 수 조회
	public Map<String, Object> getBoardNumByCategory() {
		Map<String, Object> result = new HashMap<>();
		result.put("postCountByHousingType", communityDAO.getPostCountByHousingType());
		result.put("postCountBySpaceType", communityDAO.getPostCountBySpaceType());
		result.put("postCountByAreaType", communityDAO.getPostCountByAreaSize());
		result.put("postCountByColor", communityDAO.getPostCountByColor());
		return result;
	}

	// 오늘 작성된 게시글 수 조회
	public int todayBoardNum() {
		return communityDAO.todayBoardNum();
	}
}
