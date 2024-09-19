package com.hows.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.ReturnDTO;
import com.hows.order.service.ReturnService;

@RestController
@RequestMapping("/return")
public class ReturnController {
	
	@Autowired
	private ReturnService returnServ;
	
	// 반품 상태 변경
	@PutMapping("/updateReturnCode")
	public ResponseEntity<String> updateOrderCode(@RequestParam int return_seq, @RequestParam String return_code) throws Exception {
		String result = returnServ.updateReturn(new ReturnDTO(return_seq, return_code));
		return ResponseEntity.ok(result);
	}
	
	// 구매 확정
	@Transactional
	@PutMapping("/doneReturn")
	public ResponseEntity<String> doneOrder(@RequestParam String seqs) throws Exception {
		String[] returnSeqs = seqs.split(","); // seqs를 배열로 변환
		for(String returnSeq : returnSeqs) {
			try {
				int return_seq = Integer.parseInt(returnSeq);
				// 업데이트 실패 시 예외 처리
				if(returnServ.updateReturn(new ReturnDTO(return_seq, "R6")).equals("fail")) {
					throw new RuntimeException("환불 실패");
				}
            } catch (Exception e) {
                // 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
                throw new RuntimeException("환불 실패", e);
            }
		}
		return ResponseEntity.ok("success");
	}

}
