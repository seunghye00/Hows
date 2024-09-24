package com.hows.payment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hows.common.CustomUserDetails;
import com.hows.payment.dto.PaymentDTO;
import com.hows.payment.dto.PaymentRequestDTO;
import com.hows.payment.service.PaymentService;

@RestController
@RequestMapping("/payment")
public class PaymentController {

	@Autowired
	private PaymentService paymentServ;

	@GetMapping
	public ResponseEntity<List<PaymentDTO>> paymentList(@AuthenticationPrincipal CustomUserDetails user) {
		try {
			List<PaymentDTO> list = paymentServ.paymentList(user.getUsername());
			return ResponseEntity.ok(list);

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@PostMapping("/complete")
	public ResponseEntity<?> complete(@RequestBody PaymentRequestDTO paymentRequest,
			@AuthenticationPrincipal CustomUserDetails user) throws Exception {
		String result = paymentServ.payment(paymentRequest, user.getMemberSeq());
		return ResponseEntity.ok(result);
	}

	@PostMapping("/cancel")
	public ResponseEntity<?> cancel(@RequestBody Map<String, Object> map) throws Exception {
		System.out.println("결체 취소 파라미터 ======= " + map);
		String result = paymentServ.paymentCancel(map);
		return ResponseEntity.ok(result);
	}

	// 관리자 기능
	// 오늘 매출 조회
	@GetMapping("/todayPaymentPrice")
	public ResponseEntity<Integer> todayPaymentPrice() throws Exception {
		int result = paymentServ.todayPaymentPrice();
		return ResponseEntity.ok(result);
	}

	/** throws Exception 처리 **/
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.ok("fail");
	}

}
