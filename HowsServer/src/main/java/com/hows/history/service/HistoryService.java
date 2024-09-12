package com.hows.history.service;

import com.hows.order.dao.OrderDAO;
import com.hows.order.dto.OrderDTO;
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

    public List<?>  myPayment(int memberSeq) {
        return paymentDAO.myPayment(memberSeq);
    }

}
