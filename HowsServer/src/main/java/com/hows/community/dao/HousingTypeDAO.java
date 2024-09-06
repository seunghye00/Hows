package com.hows.community.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.HousingTypeDTO;

@Repository

public class HousingTypeDAO {
	
	@Autowired
	private SqlSession mybatis;
	public List<HousingTypeDTO> getHousingTypes() {
		return mybatis.selectList("Housing.getHousingTypes");
	}
}
