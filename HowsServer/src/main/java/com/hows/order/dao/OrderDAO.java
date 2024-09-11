package com.hows.order.dao;

import java.util.List;

import com.hows.order.dto.OrderListDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;

@Repository
public class OrderDAO {

    @Autowired
    private SqlSession mybatis;

    /** 주문 목록 **/
    public List<OrderDTO> orderList() {
        return mybatis.selectList("Order.orderList");
    }

    /** 주문 등록 **/
    public int addOrder(OrderDTO orderDTO) {
        mybatis.insert("Order.addOrder", orderDTO);
        return orderDTO.getOrder_seq();
    }

    /** 주문 목록 등록 **/
    public int addOrderList(OrderListDTO orderListDTO){
        return mybatis.insert("Order.addOrderList", orderListDTO);
    }

    /** 주문 수정 **/
    public int updateOrder(OrderDTO orderDTO) {
        return mybatis.update("Order.updateOrder", orderDTO);
    }


	public List<OrderInfoListDTO> getOrdersByStatus(String status) {
		return mybatis.selectList("Order.orderListByStatus", status);
	}

}
