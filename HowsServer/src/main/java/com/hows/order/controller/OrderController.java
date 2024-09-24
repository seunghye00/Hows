package com.hows.order.controller;

import java.util.List;
import java.util.Map;

import com.hows.common.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;
import com.hows.order.dto.ReturnDTO;
import com.hows.order.service.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController {

	@Autowired
	private OrderService orderServ;

	// 관리자 기능
	// 필터링된 주문 목록 조회
	@GetMapping("/listByStatus")
	public ResponseEntity<List<OrderInfoListDTO>> getOrdersByStatus(@RequestParam String status) throws Exception {
		List<OrderInfoListDTO> list = orderServ.getOrdersByStatus(status);
		return ResponseEntity.ok(list);
	}
	
	// 관리자 기능
	// 반품 목록 조회
	@GetMapping("/getReturnList")
	public ResponseEntity<List<ReturnDTO>> getReturnList() throws Exception {
		List<ReturnDTO> list = orderServ.getReturnList();
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<Integer> addOrder(@AuthenticationPrincipal CustomUserDetails user, @RequestBody Map<String, Object> map) throws Exception {
		int result = orderServ.addOrder(map, user.getMemberSeq());
		return ResponseEntity.ok(result);
	}

	@PutMapping
	public ResponseEntity<String> updateOrder(@AuthenticationPrincipal CustomUserDetails user, @RequestBody OrderDTO orderDTO) throws Exception {
		orderDTO.setMember_seq(user.getMemberSeq());
		String result = orderServ.updateOrder(orderDTO);
		return ResponseEntity.ok(result);
	}
	
	// 관리자 기능
	// 주문 상태 변경
	@PutMapping("/updateOrderCode")
	public ResponseEntity<String> updateOrderCode(@RequestParam int order_seq, @RequestParam String order_code) throws Exception {
		String result = orderServ.updateOrder(new OrderDTO(order_seq, order_code));
		return ResponseEntity.ok(result);
	}
	
	// 관리자 기능
	// 배송 시작
	@Transactional
	@PutMapping("/startDelivery")
	public ResponseEntity<String> startDelivery(@RequestParam String seqs) throws Exception {
		String[] orderSeqs = seqs.split(","); // seqs를 배열로 변환
		for(String orderSeq : orderSeqs) {
			try {
				int order_seq = Integer.parseInt(orderSeq);
				// 업데이트 실패 시 예외 처리
				if(orderServ.updateOrder(new OrderDTO(order_seq, "O4")).equals("fail")) {
					throw new RuntimeException("배송 시작 실패");
				}
            } catch (Exception e) {
                // 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
                throw new RuntimeException("배송 시작 실패", e);
            }
		}
		return ResponseEntity.ok("success");
	}
	
	// 관리자 기능
	// 구매 확정
	@Transactional
	@PutMapping("/doneOrder")
	public ResponseEntity<String> doneOrder(@RequestParam String seqs) throws Exception {
		String[] orderSeqs = seqs.split(","); // seqs를 배열로 변환
		for(String orderSeq : orderSeqs) {
			try {
				int order_seq = Integer.parseInt(orderSeq);
				// 업데이트 실패 시 예외 처리
				if(orderServ.updateOrder(new OrderDTO(order_seq, "O6")).equals("fail")) {
					throw new RuntimeException("구매 확정 실패");
				}
            } catch (Exception e) {
                // 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
                throw new RuntimeException("구매 확정 실패", e);
            }
		}
		return ResponseEntity.ok("success");
	}

	// 관리자 기능
	// 주문 내역 삭제
	@Transactional
	@DeleteMapping
	public ResponseEntity<String> deleteOrder(@RequestParam String seqs) throws Exception {
		String[] orderSeqs = seqs.split(","); // seqs를 배열로 변환
		for(String orderSeq : orderSeqs) {
			try {
				int order_seq = Integer.parseInt(orderSeq);
				if(!orderServ.deleteOrder(order_seq)) {
					throw new RuntimeException("주문 삭제 실패");
				}
            } catch (Exception e) {
                // 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
                throw new RuntimeException("주문 삭제 실패", e);
            }
		}
		return ResponseEntity.ok("success");
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
