package com.hows.community.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.community.dao.CommunityDAO;
import com.hows.community.dto.CommunityDTO;
import com.hows.community.dto.ImageDTO;
import com.hows.community.dto.TagDTO;

@Service
public class CommunityService {
    @Autowired
    private CommunityDAO communityDAO;
    
    // 게시글 입력 및 현재 시퀀스 값 반환
    public int insertWrite(CommunityDTO dto) {
    	return communityDAO.insertWrite(dto);
    }

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
   
   // 게시글 리스트 이미지 출력
   public List<Map<String, Object>> selectAllImg() {
	   return communityDAO.selectAllImg();
   }
   	
   // 게시글 디테일 
   public Map<String, Object> selectAllSeq(int board_seq) {
	   return communityDAO.selectAllSeq(board_seq);
   }
   // 게시글 디테일 이미지 
   public List<Map<String, Object>> selectImages(int board_seq){
	   return communityDAO.selectImages(board_seq);
   }
   // 게시글 디테일 상품태그
   public List<Map<String, Object>> selectTagsAndProductInfo(int board_seq){
	   return communityDAO.selectTagsAndProductInfo(board_seq);
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
}
