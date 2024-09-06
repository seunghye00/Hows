package com.hows.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

	@ExceptionHandler(Exception.class)
	public String exceptionHandler(Exception e) {
		e.printStackTrace();
		return "redirect:/error";
	}
}
