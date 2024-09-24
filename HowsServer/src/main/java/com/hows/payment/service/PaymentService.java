package com.hows.payment.service;

import com.hows.payment.dao.PaymentDAO;
import com.hows.payment.dto.PaymentDTO;
import com.hows.payment.dto.PaymentRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

	@Autowired
	private PaymentDAO paymentDAO;

	@Value("${portone.api.secret}")
	private String portoneApiSecret;

	@Value("${portone.api.url}")
	private String portoneApiUrl;

	/** 내 결제 내역 **/
	public List<PaymentDTO> paymentList(String id) {
		return paymentDAO.paymentList(id);
	}

	/** 결제 여부 확인 **/
	public String payment(PaymentRequestDTO paymentRequest, int memberSeq) {
		String result = "fail";
		try {
			String paymentId = paymentRequest.getPaymentId();
			int totalAmount = paymentRequest.getTotalAmount();
			int orderSeq = paymentRequest.getOrderSeq();

			// 1. PortOne 결제내역 단건조회 API 호출
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "PortOne " + portoneApiSecret);
			HttpEntity<String> entity = new HttpEntity<>(headers);

			String url = portoneApiUrl + URLEncoder.encode(paymentId, "UTF-8");
			ResponseEntity<Object> paymentResponse = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);

			Map<String, Object> responseBody = (Map<String, Object>) paymentResponse.getBody();
			Map<String, Object> amountMap = (Map<String, Object>) responseBody.get("amount");
			String status = (String) responseBody.get("status");

			// 실제 결제 금액
			int total = (int) amountMap.get("total");

			if (!paymentResponse.getStatusCode().is2xxSuccessful()) {
				throw new RuntimeException("Failed to retrieve payment details: " + paymentResponse.getBody());
			}

//            String paymentCode = "";
//
//            // 실제 결제 내역이랑, 주문 시 가격이랑 비교
//            if(totalAmount == total) {
//                switch (status) {
//                    case "VIRTUAL_ACCOUNT_ISSUED":
//                        // 가상 계좌 발급 상태 "virtual_account"
//                        paymentCode = "P1";
//                        break;
//                    case "PAID":
//                        // 결제가 완료된 상태 "completed"
//                        paymentCode = "P2";
//                        break;
//                }
//
//                int addPayment = paymentDAO.addPayment(new PaymentDTO(memberSeq, orderSeq, paymentCode, total, paymentId));
//                result = addPayment > 0 ? "ok" : "fail";
//
//            } else {
//                // 결제 금액 불일치, 위/변조 시도가 의심됨 (memberSeq 회원)
//                throw new RuntimeException("Payment amount mismatch!");
//            }

			String paymentCode = "P2";
			int addPayment = paymentDAO.addPayment(new PaymentDTO(memberSeq, orderSeq, paymentCode, total, paymentId));
			result = addPayment > 0 ? "ok" : "fail";

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	/** 결제 취소 **/
	public String paymentCancel(Map<String, Object> map) {
		String paymentId = (String) map.get("payment_id");
		String reason = (String) map.get("payment_text");
		String type = null;
		if (map.get("type") != null) {
			type = (String) map.get("type");
		}
		String result = "fail";

		try {
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "PortOne " + portoneApiSecret);
			Map<String, String> body = new HashMap<>();
			body.put("reason", reason);
			HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

			String url = portoneApiUrl + paymentId + "/cancel";
			ResponseEntity<Object> paymentResponse = restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);

			// Body를 Map으로 캐스팅
			Map<String, Object> responseBody = (Map<String, Object>) paymentResponse.getBody();

			// cancellation 객체 가져오기
			Map<String, Object> cancellation = (Map<String, Object>) responseBody.get("cancellation");

			String status = (String) cancellation.get("status");
			Integer totalAmount = (Integer) cancellation.get("totalAmount");

			// 성공 시 데이터베이스 수정
			if (status.equals("SUCCEEDED")) {
				if (type != null) {
					// 결제 내역 취소로 변경
					if (!paymentDAO.doneCancel(paymentId)) {
						throw new RuntimeException("DB 업데이트 오류");
					} 
					return "ok";
				} else {
					// 결제 오류로 발생 시 자동 결제 취소
					int cancel = paymentDAO.cancelPayment(paymentId);
					return cancel > 0 ? "ok" : "fail";
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	// order_seq 조회
	public int getOrderSeq(int payment_seq) {
		return paymentDAO.getOrderSeq(payment_seq);
	}

	// 오늘 매출 조회
	public int todayPaymentPrice() {
		return paymentDAO.todayPaymentPrice();
	}
}
