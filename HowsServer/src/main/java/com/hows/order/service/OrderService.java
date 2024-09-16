package com.hows.order.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hows.order.dto.OrderListDTO;
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
    public int addOrder(Map<String, Object> map, int memberSeq) {
        try {
            int totalAmount = (int) map.get("totalAmount");
            String orderName = (String) map.get("orderName");
            String name = (String) map.get("name");
            String phone = (String) map.get("phone");
            String zipCode = (String) map.get("zipCode");
            String address = (String) map.get("address");
            String detailAddress = (String) map.get("detailAddress");

            int orderSeq = orderDAO.addOrder(new OrderDTO(memberSeq, orderName, totalAmount, name, phone, zipCode, address, detailAddress));

            /** 주문 목록 등록 **/
            List<Map<String, ?>> param = (List<Map<String, ?>>) map.get("orderProducts");
            if(param.size() > 0) {
                for(Map<String, ?> dto : param) {
                    int productSeq = (int) dto.get("product_seq");
                    int orderListCount = (int) dto.get("product_quantity");
                    int orderListPrice = (int) dto.get("product_total_price");

                    orderDAO.addOrderList(new OrderListDTO(0, orderSeq, productSeq, orderListCount, orderListPrice));
                }
                return orderSeq;
            }
            return -1;

        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
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

	// 주문 내역 삭제
	public boolean deleteOrder(int orderSeq) {
		return orderDAO.deleteOrder(orderSeq);
	}
}
