package com.hows.history.service;

import com.hows.history.dao.HistoryDAO;
import com.hows.member.dao.MemberDAO;
import com.hows.member.dto.MemberDTO;
import com.hows.order.dao.OrderDAO;
import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderListDTO;
import com.hows.payment.dao.PaymentDAO;
import com.hows.product.dao.ReviewDAO;
import com.hows.product.dto.ImageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HistoryService {

    @Autowired
    private OrderDAO orderDAO;

    @Autowired
    private ReviewDAO reviewDAO;

    @Autowired
    private PaymentDAO paymentDAO;

    @Autowired
    private HistoryDAO historyDAO;

    /** My History info **/
    public Map<String, Object> myInfo(int memberSeq) {
        // 회원 등급 및 포인트
        Map<String, Object> map = historyDAO.myInfo(memberSeq);
        System.out.println("map ==== " + map);
        // 결제 총 금액
        int totalPrice = orderDAO.getTotalPrice(memberSeq);
        System.out.println("totalPrice ==== " + totalPrice);
        map.put("totalPrice", totalPrice);

        return map;
    }

    /** My 주문 목록 **/
    public List<?> myOrder (int memberSeq) {
        List<OrderDTO> list = orderDAO.myOrder(memberSeq);
        List<Map<String, ?>> mapList = new ArrayList<>();
        for(OrderDTO dto : list) {
            int orderSeq = dto.getOrder_seq();
            List<HashMap<String, Object>> myOrderList = orderDAO.myOrderList(orderSeq);
            Map<String, Object> map = new HashMap<>();
            map.put("myOrder", dto);
            map.put("myOrderList", myOrderList);
            mapList.add(map);
        }

        return mapList;
    }

    /** 주문 디테일 **/
    public Map<String, Object> orderDetail(int orderSeq) {
        OrderDTO detail = orderDAO.orderDetail((orderSeq));
        List<HashMap<String, Object>> orderList = orderDAO.myOrderList(orderSeq);
        Map<String, Object> map = new HashMap<>();
        map.put("orderDetail", detail);
        map.put("orderList", orderList);
        return map;
    }

    /** Review 목록 **/
    public List<?> myReview (String memberId) {
        List<Map<String, Object>> list = reviewDAO.myReview(memberId);
        List<Map<String, ?>> mapList = new ArrayList<>();
        for(Map<String, Object> dto : list) {
            BigDecimal reviewSeqDecimal = (BigDecimal) dto.get("review_seq");
            int reviewSeq = reviewSeqDecimal.intValue();
            List<ImageDTO> reviewImage = reviewDAO.myReviewImage(reviewSeq);
            Map<String, Object> map = new HashMap<>();
            map.put("myReview", dto);
            map.put("myReviewImage", reviewImage);
            mapList.add(map);
        }
        return mapList;
    }

    /** My 주문 & 결제 정보 **/
    public List<?> myPayment(int memberSeq) {
        return paymentDAO.myPayment(memberSeq);
    }

    /** My 주문 & 결제 취소 요청 **/
    public String myPaymentCancel(Map<String, Object> map) {
        map.put("payment_code", "P4");
        int result = paymentDAO.updatePayment(map);
        return result > 0 ? "ok" : "fail";
    }
}
