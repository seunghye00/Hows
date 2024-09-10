package com.hows.community.dao;

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
    
    // 게시글 리스트 이미지 출력
    public Map<String, Object> selectAllSeq(int board_seq) {
    	return mybatis.selectOne("Community.selectAllSeq", board_seq);
    }
}
