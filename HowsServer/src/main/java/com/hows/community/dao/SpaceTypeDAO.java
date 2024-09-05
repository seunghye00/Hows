package com.hows.community.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.SpaceTypeDTO;

@Repository

public class SpaceTypeDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	public List<SpaceTypeDTO> getSpaceTypes() {
		return mybatis.selectList("Space.getSpaceTypes");
	}
}
