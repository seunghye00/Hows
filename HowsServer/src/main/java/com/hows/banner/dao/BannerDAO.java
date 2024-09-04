package com.hows.banner.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class BannerDAO {
	
	@Autowired
	private SqlSession mybatis;

}
