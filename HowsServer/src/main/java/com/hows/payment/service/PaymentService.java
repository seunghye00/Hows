package com.hows.payment.service;

import com.hows.payment.dto.PaymentRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${portone.api.secret}")
    private String portoneApiSecret;

    /** 결제 여부 확인 **/
    public String payment(PaymentRequestDTO paymentRequest) {
        String result = "fail";
        try {
            String paymentId = paymentRequest.getPaymentId();
            int totalAmount = paymentRequest.getTotalAmount();

            // 1. PortOne 결제내역 단건조회 API 호출
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "PortOne " + portoneApiSecret);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = "https://api.portone.io/payments/" + URLEncoder.encode(paymentId, "UTF-8");
            ResponseEntity<Object> paymentResponse = restTemplate.exchange(
                    url, HttpMethod.GET, entity, Object.class);

            Map<String, Object> responseBody = (Map<String, Object>) paymentResponse.getBody();
            Map<String, Object> amountMap = (Map<String, Object>) responseBody.get("amount");
            String status = (String) responseBody.get("status");

            // 실제 결제 금액
            int total = (int) amountMap.get("total");

            if (!paymentResponse.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to retrieve payment details: " + paymentResponse.getBody());
            }

            if(totalAmount == total) {
                switch (status) {
                    case "VIRTUAL_ACCOUNT_ISSUED":
                        result = "virtual_account";
                        break;
                    case "PAID":
                        result = "completed";
                        break;
                    default:
                        result = "other";
                        break;
                }
            } else {
                // 결제 금액 불일치
                throw new RuntimeException("Payment amount mismatch!");

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

}
