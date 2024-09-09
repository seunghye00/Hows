package com.hows.banner.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.banner.dto.BannerDTO;

@Repository
public class BannerDAO {
	
	@Autowired
	private SqlSession mybatis;

	public void deleteBySysName(String sysName) {
		mybatis.delete("Banner.delete", sysName);
	}

	public List<BannerDTO> getAllBanners() {
		return mybatis.selectList("Banner.selectAll");
	}

}
