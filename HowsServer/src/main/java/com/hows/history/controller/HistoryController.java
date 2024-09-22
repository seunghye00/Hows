package com.hows.history.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.common.CustomUserDetails;
import com.hows.history.service.HistoryService;
import com.hows.order.dto.ReturnDTO;
import com.hows.order.service.OrderService;
import com.hows.order.service.ReturnService;
import com.hows.payment.service.PaymentService;

@RestController
@RequestMapping("/history")
public class HistoryController {

	@Autowired
	private HistoryService historyServ;

	@Autowired
	private ReturnService returnServ;

	@Autowired
	private PaymentService paymentServ;

	@Autowired
	private OrderService orderServ;

	@GetMapping
	public ResponseEntity<Map<String, Object>> myInfo(@AuthenticationPrincipal CustomUserDetails user) {
		Map<String, Object> map = historyServ.myInfo(user.getMemberSeq());
		return ResponseEntity.ok(map);
	}

	@GetMapping("/order")
	public ResponseEntity<List<?>> orderList(@AuthenticationPrincipal CustomUserDetails user) {
		List<?> list = historyServ.myOrder(user.getMemberSeq());
		return ResponseEntity.ok(list);
	}

	@GetMapping("/order/{seq}")
	public ResponseEntity<Map<String, Object>> orderList(@PathVariable("seq") int seq) {
		Map<String, Object> map = historyServ.orderDetail(seq);
		return ResponseEntity.ok(map);
	}

	@GetMapping("/review")
	public ResponseEntity<List<?>> reviewList(@AuthenticationPrincipal CustomUserDetails user) {
		List<?> list = historyServ.myReview(user.getUsername());
		return ResponseEntity.ok(list);
	}

	@GetMapping("/payment")
	public ResponseEntity<List<?>> paymentList(@AuthenticationPrincipal CustomUserDetails user) {
		List<?> list = historyServ.myPayment(user.getMemberSeq());
		return ResponseEntity.ok(list);
	}

	@Transactional
	@PutMapping("/payment")
	public ResponseEntity<String> paymentList(@AuthenticationPrincipal CustomUserDetails user,
			@RequestBody Map<String, Object> map) {
		map.put("member_seq", user.getMemberSeq());
		String result = historyServ.myPaymentCancel(map);
		if (result.equals("fail")) {
			throw new RuntimeException("실패");
		}
		int paymentSeq = (int) map.get("payment_seq");
		int orderSeq = paymentServ.getOrderSeq(paymentSeq);
		String orderCode = orderServ.getOrderCode(orderSeq);
		String return_code = "R1";
		if (orderCode.equals("O5")) {
			return_code = "R2";
		}
		String result2 = returnServ.insert(new ReturnDTO(0, orderSeq, paymentSeq, return_code));
		return ResponseEntity.ok(result2);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body(null);
	}
}