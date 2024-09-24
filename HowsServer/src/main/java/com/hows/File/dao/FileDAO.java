package com.hows.File.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hows.File.dto.FileDTO;

@Repository
public class FileDAO {

	@Autowired
	private SqlSession mybatis;

	/** 파일 업로드 **/
	@Transactional
	public int upload(FileDTO fileDTO) {
		try {
			return mybatis.insert("upload", fileDTO);
		} catch (Exception e) {
			// 예외 발생 시 실패 처리
			e.printStackTrace();
			return 0; // 실패 시 0 반환
		}
	}

	/** 파일 삭제 **/
	public int deleteFile(String sysName) {
		return mybatis.delete("File.deleteFile", sysName);
	}

	// fileCode와 parent_seq로 파일의 sysname 조회
	public List<String> getSysNames(int parentSeq, String fileCode) {
		Map<String, Object> params = new HashMap<>();
		params.put("parentSeq", parentSeq);
		params.put("fileCode", fileCode);
		return mybatis.selectList("File.getSysName", params);
	}

	// parent_seq 업데이트
	public boolean updateParentSeq(int parentSeq, int fileSeq) {
		Map<String, Integer> params = new HashMap<>();
		params.put("parentSeq", parentSeq);
		params.put("fileSeq", fileSeq);
		return mybatis.update("File.update", params) > 0;
	}

	// parent_seq가 0인 파일 목록 조회
	public List<FileDTO> getFilesByNotFound() {
		return mybatis.selectList("File.getFilesByNotFound");
	}
}
