package com.hows.payment.controller;

import java.net.URLEncoder;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hows.payment.dto.PaymentRequestDTO;
import com.hows.payment.dto.PaymentResponseDTO;
import com.hows.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private PaymentService paymentServ;

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody PaymentRequestDTO paymentRequest) {
        String result = paymentServ.payment(paymentRequest);
        return ResponseEntity.ok(result);
    }

}
