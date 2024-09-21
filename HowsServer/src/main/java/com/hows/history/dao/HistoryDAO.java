package com.hows.history.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class HistoryDAO {

    @Autowired
    private SqlSession mybatis;

    public Map<String, Object> myInfo(int memberSeq) {
        return mybatis.selectOne("History.myInfo", memberSeq);
    }

}
