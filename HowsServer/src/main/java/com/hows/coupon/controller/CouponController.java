package com.hows.coupon.controller;

import com.hows.common.CustomUserDetails;
import com.hows.coupon.dto.CouponDTO;
import com.hows.coupon.dto.CouponOwnerDTO;
import com.hows.coupon.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coupon")
public class CouponController {

    @Autowired
    private CouponService couponServ;

    @GetMapping
    public ResponseEntity<CouponDTO> getCoupon(int couponSeq) {
        try {
            CouponDTO coupon = couponServ.getCoupon(couponSeq);
            return ResponseEntity.ok(coupon);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(null);
    }

    @PostMapping
    public ResponseEntity<CouponDTO> createCoupon(@RequestBody CouponDTO coupon) throws Exception {
        String result = couponServ.addCoupon(coupon);
        return ResponseEntity.ok(coupon);
    }

    @DeleteMapping("/{seq}")
    public ResponseEntity<String> delCoupon(@PathVariable int seq) {
        String result = couponServ.delCoupon(seq);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<Map<String, Object>>> getCouponOwner(@AuthenticationPrincipal CustomUserDetails user) {
        int memberSeq = user.getMemberSeq();
        try {
            List<Map<String, Object>> myCoupon = couponServ.getMyCoupon(memberSeq);
            return ResponseEntity.ok(myCoupon);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(null);
    }

    @PostMapping("/owner")
    public ResponseEntity<String> addMyCoupon(@AuthenticationPrincipal CustomUserDetails user, int couponSeq) throws Exception {
        CouponOwnerDTO dto = new CouponOwnerDTO(user.getMemberSeq(), couponSeq);
        String result = couponServ.addMyCoupon(dto);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/owner")
    public ResponseEntity<String> useMyCoupon(CouponOwnerDTO couponOwnerDTO) throws Exception {
        String result = couponServ.useMyCoupon(couponOwnerDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/owner/{seq}")
    public ResponseEntity<String> delMyCoupon(@PathVariable int seq) throws Exception {
        String result = couponServ.delMyCoupon(seq);
        return ResponseEntity.ok(result);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body("fail");
    }
}
