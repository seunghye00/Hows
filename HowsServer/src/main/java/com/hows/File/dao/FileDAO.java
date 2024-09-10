package com.hows.File.dao;

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

	// 배너 SEQ로 파일 sysname 조회
	public String getSysName(int bannerSeq) {
		return mybatis.selectOne("File.getSysName", bannerSeq);
	}
}
