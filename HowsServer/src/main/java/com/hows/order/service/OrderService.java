package com.hows.order.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.order.dao.OrderDAO;
import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderDAO orderDAO;

    /** 주문 목록 **/
    public List<OrderDTO> orderList() throws Exception {
        return orderDAO.orderList();
    }

    /** 주문 등록 **/
    @Transactional
    public String addOrder(OrderDTO orderDTO) throws Exception {
        int seq = orderDAO.addOrder(orderDTO);
        
        /** 주문 목록 등록 **/
        
        return "";
    }

    /** 주문 수정 **/
    public String updateOrder(OrderDTO orderDTO) throws Exception {
        int result = orderDAO.updateOrder(orderDTO);
        return result > 0 ? "ok" : "fail";
    }

    // 필터링된 주문 목록
	public List<OrderInfoListDTO> getOrdersByStatus(String status) {
		return orderDAO.getOrdersByStatus(status);
	}
}
