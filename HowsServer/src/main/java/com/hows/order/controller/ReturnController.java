package com.hows.order.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.order.dto.ReturnDTO;
import com.hows.order.service.ReturnService;
import com.hows.payment.service.PaymentService;

@RestController
@RequestMapping("/return")
public class ReturnController {
	
	@Autowired
	private ReturnService returnServ;
	
	@Autowired
	private PaymentService payServ;
	
	// 반품 상태 변경
	@PutMapping("/updateReturnCode")
	public ResponseEntity<String> updateOrderCode(@RequestParam int return_seq, @RequestParam String return_code) throws Exception {
		String result = returnServ.updateReturn(new ReturnDTO(return_seq, return_code));
		return ResponseEntity.ok(result);
	}
	
	// 환불 완료
	@Transactional
    @PutMapping("/doneReturn")
    public ResponseEntity<String> doneOrder(@RequestBody List<Map<String, Object>> data) throws Exception {
        try {
            for (Map<String, Object> item : data) {
                String result = payServ.paymentCancel(item);
                if(result.equals("fail")) {
                	throw new RuntimeException("환불 실패 : 결재 취소 오류");
                }
                String result2 = returnServ.updateReturn(new ReturnDTO((int)item.get("return_seq"), "R6"));
                if(result2.equals("fail")) {
                	throw new RuntimeException("환불 실패 : DB 업데이트 오류");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("환불 실패", e);
        }
        return ResponseEntity.ok("success");
    }
}
