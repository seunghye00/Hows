package com.hows.order.controller;

import java.util.List;
import java.util.Map;

import com.hows.common.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hows.order.dto.OrderDTO;
import com.hows.order.dto.OrderInfoListDTO;
import com.hows.order.service.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController {

	@Autowired
	private OrderService orderServ;

	@GetMapping
	public ResponseEntity<List<OrderDTO>> orderList() {
		try {
			List<OrderDTO> list = orderServ.orderList();
			return ResponseEntity.ok(list);

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// 필터링된 주문 목록 조회
	@GetMapping("/listByStatus")
	public ResponseEntity<List<OrderInfoListDTO>> getOrdersByStatus(@RequestParam String status) throws Exception {
		List<OrderInfoListDTO> list = orderServ.getOrdersByStatus(status);
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<Integer> addOrder(@AuthenticationPrincipal CustomUserDetails user, @RequestBody Map<String, Object> map) throws Exception {
//		int result = orderServ.addOrder(map, user.getMemberSeq());
		int result = orderServ.addOrder(map, 1);
		return ResponseEntity.ok(result);
	}

	@PutMapping
	public ResponseEntity<String> updateOrder(@AuthenticationPrincipal CustomUserDetails user, @RequestBody OrderDTO orderDTO) throws Exception {
		orderDTO.setMember_seq(user.getMemberSeq());
		String result = orderServ.updateOrder(orderDTO);
		return ResponseEntity.ok(result);
	}

	@ExceptionHandler(Exception.class)
	public String exceptionHandler(Exception e) {
		e.printStackTrace();
		return "redirect:/error";
	}
}
