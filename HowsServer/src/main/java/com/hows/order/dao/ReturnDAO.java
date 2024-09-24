package com.hows.order.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.order.dto.ReturnDTO;

@Repository
public class ReturnDAO {
	
    @Autowired
    private SqlSession mybatis;

    // 반품 상태 업데이트
	public int updateReturn(ReturnDTO dto) {
		return mybatis.update("Return.updateStatus", dto);
	}

	// 반품 내역 생성
	public int insert(ReturnDTO dto) {
		return mybatis.insert("Return.insert", dto);
	}
}
