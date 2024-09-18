package com.hows.order.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.order.dto.ReturnDTO;

@Repository
public class ReturnDAO {
	
    @Autowired
    private SqlSession mybatis;


}
