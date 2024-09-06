package com.hows.order.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;

@Repository
public class OrderDAO {

    @Autowired
    private SqlSession mybatis;

    public List<OrderDTO> orderList() {
        return mybatis.selectList("Order.orderList");
    }

	public List<OrderInfoListDTO> getOrdersByStatus(String status) {
		return mybatis.selectList("Order.orderListByStatus", status);
	}

}
