package com.hows.order.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;
import com.hows.order.dto.OrderListDTO;

@Repository
public class OrderDAO {

    @Autowired
    private SqlSession mybatis;

    /** 주문 목록 **/
    public List<OrderDTO> orderList() {
        return mybatis.selectList("Order.orderList");
    }

    /** My 주문 목록 **/
    public List<OrderDTO> myOrder(int memberSeq) {
        return mybatis.selectList("Order.myOrder", memberSeq);
    }

    /** 주문 Detail **/
    public OrderDTO orderDetail(int orderSeq) {
        return mybatis.selectOne("Order.orderDetail", orderSeq);
    }

    /** 주문 목록 조회 **/
    public List<HashMap<String, Object>> myOrderList(int orderSeq) {
        return mybatis.selectList("Order.myOrderList", orderSeq);
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

    // 주문 상태 별 주문 목록 조회
	public List<OrderInfoListDTO> getOrdersByStatus(String status) {
		return mybatis.selectList("Order.orderListByStatus", status);
	}

	// 주문 내역 삭제
	public boolean deleteOrder(int orderSeq) {
		return mybatis.delete("Order.delete", orderSeq) > 0;
	}
}
