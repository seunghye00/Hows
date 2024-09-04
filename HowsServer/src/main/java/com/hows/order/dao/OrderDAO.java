package com.hows.order.dao;

import com.hows.order.dto.OrderDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderDAO {

    @Autowired
    private SqlSession mybatis;

    public List<OrderDTO> orderList() {
        return mybatis.selectList("Order.orderList");
    }

}
