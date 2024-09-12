package com.hows.history.service;

import com.hows.order.dao.OrderDAO;
import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HistoryService {

    @Autowired
    private OrderDAO orderDAO;

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

}
