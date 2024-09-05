package com.hows.order.service;

import com.hows.order.dao.OrderDAO;
import com.hows.order.dto.OrderDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderDAO orderDAO;

    /** 주문 목록 **/
    public List<OrderDTO> orderList() throws Exception {
        return orderDAO.orderList();
    }

}
