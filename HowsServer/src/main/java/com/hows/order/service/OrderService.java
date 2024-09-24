package com.hows.order.service;

import java.util.List;
import java.util.Map;

import com.hows.coupon.dao.CouponDAO;
import com.hows.coupon.dto.CouponOwnerDTO;
import com.hows.order.dto.OrderListDTO;
import com.hows.order.dto.ReturnDTO;

import com.hows.product.dao.ProductDAO;
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

    @Autowired
    private CouponDAO couponDAO;
    
    @Autowired
    private ProductDAO productDAO;

    /** 주문 등록 **/
    @Transactional
    public int addOrder(Map<String, Object> map, int memberSeq) {
        int orderSeq = 0;
        try {
            int totalAmount = (int) map.get("totalAmount");
            String orderName = (String) map.get("orderName");
            String name = (String) map.get("name");
            String phone = (String) map.get("phone");
            String zipCode = (String) map.get("zipCode");
            String address = (String) map.get("address");
            String detailAddress = (String) map.get("detailAddress");
            int couponOwnerSeq = Integer.parseInt(map.get("couponOwnerSeq").toString());

            orderSeq = orderDAO.addOrder(new OrderDTO(memberSeq, orderName, totalAmount, name, phone, zipCode, address, detailAddress));

            /** 쿠폰 사용 시 쿠폰 차감 **/
            if(couponOwnerSeq > 0) {
                couponDAO.useMyCoupon(new CouponOwnerDTO(orderSeq, couponOwnerSeq));
            }

            /** 주문 목록 등록 **/
            List<Map<String, ?>> param = (List<Map<String, ?>>) map.get("orderProducts");
            if(param.size() > 0) {
                for(Map<String, ?> dto : param) {
                    int productSeq = Integer.parseInt(dto.get("product_seq").toString());
                    int orderListCount = Integer.parseInt(dto.get("product_quantity").toString());
                    int orderListPrice = Integer.parseInt(dto.get("product_total_price").toString());
                    OrderListDTO orderListDTO = new OrderListDTO(0, orderSeq, productSeq, orderListCount, orderListPrice);
                    orderDAO.addOrderList(orderListDTO);
                    productDAO.updateQuantity(orderListDTO);
                }
                return orderSeq;
            }
            return -1;

        } catch (Exception e) {
            e.printStackTrace();
            orderDAO.deleteOrder(orderSeq);
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
	
    // 반품 목록
    public List<ReturnDTO> getReturnList() throws Exception {
        return orderDAO.getReturnList();
    }

	// 주문 내역 삭제
	public boolean deleteOrder(int orderSeq) {
		return orderDAO.deleteOrder(orderSeq);
	}
	
	// 주문 상태 조회
	public String getOrderCode(int orderSeq) {
		return orderDAO.getOrderCode(orderSeq);
	}
}
