package com.hows.order.controller;

import com.hows.order.dto.OrderDTO;
import com.hows.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
