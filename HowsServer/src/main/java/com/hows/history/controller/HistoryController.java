package com.hows.history.controller;

import com.hows.common.CustomUserDetails;
import com.hows.history.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/history")
public class HistoryController {

    @Autowired
    private HistoryService historyServ;

    @GetMapping("/order")
    public ResponseEntity<List<?>> orderList(@AuthenticationPrincipal CustomUserDetails user) {
        List<?> list = historyServ.myOrder(user.getMemberSeq());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/order/{seq}")
    public ResponseEntity<Map<String, Object>> orderList(@PathVariable("seq") int seq) {
        Map<String, Object> map = historyServ.orderDetail(seq);
        System.out.println("map ==== " + map);
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

    @PostMapping("/payment/cancel")
    public ResponseEntity<String> paymentList(@AuthenticationPrincipal CustomUserDetails user, @RequestBody Map<String, Object> map) {
        map.put("member_seq", user.getMemberSeq());
        String result = historyServ.myPaymentCancel(map);
        return ResponseEntity.ok(result);
    }
}