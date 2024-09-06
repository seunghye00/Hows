package com.hows.order.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.order.dao.OrderDAO;
import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;

@Service
public class OrderService {

    @Autowired
    private OrderDAO orderDAO;

    /** 주문 목록 **/
    public List<OrderDTO> orderList() throws Exception {
        return orderDAO.orderList();
    }

    // 필터링된 주문 목록
	public List<OrderInfoListDTO> getOrdersByStatus(String status) {
		return orderDAO.getOrdersByStatus(status);
	}
}
