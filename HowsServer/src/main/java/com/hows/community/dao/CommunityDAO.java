package com.hows.community.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
}
