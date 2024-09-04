package com.hows.File.dao;

import com.hows.File.dto.FileDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class FileDAO {

    @Autowired
    private SqlSession mybatis;

    /** 파일 업로드 **/
    public int upload(FileDTO fileDTO) {
        return mybatis.insert("File.upload", fileDTO);
    }

    /** 파일 삭제 **/
    public int deleteFile(String sysName) {
        return mybatis.delete("File.deleteFile", sysName);
    }

}
