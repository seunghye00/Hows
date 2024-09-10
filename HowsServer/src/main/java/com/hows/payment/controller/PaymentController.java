package com.hows.payment.controller;

import java.util.List;

import com.hows.payment.dto.PaymentDTO;
import com.hows.payment.dto.PaymentRequestDTO;
import com.hows.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentServ;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> paymentList(@AuthenticationPrincipal UserDetails user) {
        try{
            List<PaymentDTO> list = paymentServ.paymentList(user.getUsername());
            return ResponseEntity.ok(list);

        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody PaymentRequestDTO paymentRequest) throws Exception {

        System.out.println(paymentRequest.getOrderSeq());

        String result = paymentServ.payment(paymentRequest);
        return ResponseEntity.ok(result);
    }

    /** throws Exception 처리 **/
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
        e.printStackTrace();
        return ResponseEntity.ok("fail");
    }

}
