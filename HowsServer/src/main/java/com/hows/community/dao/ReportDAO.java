package com.hows.community.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.community.dto.ReportDTO;
@Repository
public class ReportDAO {

	@Autowired
	private SqlSession mybatis;
	
	public List<ReportDTO> getReport() {
		return mybatis.selectList("Report.getReport");
	}
}
