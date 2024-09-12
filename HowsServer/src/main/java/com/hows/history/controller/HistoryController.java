package com.hows.history.controller;

import com.hows.common.CustomUserDetails;
import com.hows.history.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

}
