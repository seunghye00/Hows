package com.hows.community.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.AreaSizeDTO;

@Repository

public class AreaSizeDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	public List<AreaSizeDTO> getAreaSize() {
		return mybatis.selectList("Area.getAreaSize");
	}
}
