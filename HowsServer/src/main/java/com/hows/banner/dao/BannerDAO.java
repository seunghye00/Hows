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

	public List<BannerDTO> getAllBanners() {
		return mybatis.selectList("Banner.selectAll");
	}

	public boolean addBanner(BannerDTO dto) {
		return mybatis.insert("Banner.insert", dto) > 0;
	}

	public void deleteBySeq(int banner_seq) {
		mybatis.delete("Banner.delete", banner_seq);
	}
}
