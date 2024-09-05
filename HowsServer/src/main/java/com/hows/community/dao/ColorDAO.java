package com.hows.community.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.ColorDTO;

@Repository
public class ColorDAO {
	
	@Autowired
	private SqlSession mybatis;
	public List<ColorDTO> getColors() {
		return mybatis.selectList("Color.getColors");
	}
}
