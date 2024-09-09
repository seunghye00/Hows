package com.hows.payment.controller;

import java.net.URLEncoder;

import com.hows.payment.dto.PaymentRequestDTO;
import com.hows.payment.dto.PaymentResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Value("${portone.api.secret}")
    private String portoneApiSecret;

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody PaymentRequestDTO paymentRequest) {

        try {

            String paymentId = paymentRequest.getPaymentId();
            int totalPrice = paymentRequest.getTotalPrice();

            System.out.println("paymentId: " + paymentId);
            System.out.println("totalPrice: " + totalPrice);

            // 1. PortOne 결제내역 단건조회 API 호출
//            RestTemplate restTemplate = new RestTemplate();
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("Authorization", "PortOne " + portoneApiSecret);
//            HttpEntity<String> entity = new HttpEntity<>(headers);
//
//            String url = "https://api.portone.io/payments/" + URLEncoder.encode(paymentId, "UTF-8");
//            ResponseEntity<PaymentResponseDTO> paymentResponse = restTemplate.exchange(
//                    url, HttpMethod.GET, entity, PaymentResponseDTO.class);
//
//            if (!paymentResponse.getStatusCode().is2xxSuccessful()) {
//                throw new RuntimeException("Failed to retrieve payment details: " + paymentResponse.getBody());
//            }
//
//            PaymentResponseDTO payment = paymentResponse.getBody();
//
//            // 2. 고객사 내부 주문 데이터의 가격과 실제 지불된 금액 비교
//            OrderData orderData = OrderService.getOrderData(order);
//
//            if (orderData.getAmount().equals(payment.getAmount().getTotal())) {
//                switch (payment.getStatus()) {
//                    case "VIRTUAL_ACCOUNT_ISSUED":
//                        // 가상 계좌가 발급된 상태입니다.
//                        break;
//                    case "PAID":
//                        // 모든 금액을 지불했습니다.
//                        break;
//                    default:
//                        // 다른 상태 처리
//                        break;
//                }
//            } else {
//                // 결제 금액 불일치
//                throw new RuntimeException("Payment amount mismatch!");
//            }

            return ResponseEntity.ok("Payment validation successful");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
