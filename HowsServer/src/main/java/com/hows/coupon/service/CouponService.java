package com.hows.coupon.service;

import com.hows.coupon.dao.CouponDAO;
import com.hows.coupon.dto.CouponDTO;
import com.hows.coupon.dto.CouponOwnerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CouponService {

    @Autowired
    private CouponDAO couponDAO;

    /** 해당 쿠폰 조회 **/
    public CouponDTO getCoupon(int couponSeq) {
        return couponDAO.getCoupon(couponSeq);
    }

    /** 쿠폰 추가 **/
    public String addCoupon(CouponDTO coupon){
        int result = couponDAO.addCoupon(coupon);
        return result > 0 ? "ok" : "fail";
    }

    /** 쿠폰 삭제 **/
    public String delCoupon(int couponSeq){
        int result = couponDAO.delCoupon(couponSeq);
        return result > 0 ? "ok" : "fail";
    }

    /** My 쿠폰 리스트 **/
    public List<Map<String, Object>> getMyCoupon(int memberSeq) {
        return couponDAO.getMyCoupon(memberSeq);
    }

    /** 쿠폰 발급 **/
    public String addMyCoupon(CouponOwnerDTO couponOwnerDTO){
        int result = couponDAO.addMyCoupon(couponOwnerDTO);
        return result > 0 ? "ok" : "fail";
    }

    /** My 쿠폰 사용 **/
    public String useMyCoupon(CouponOwnerDTO couponOwnerDTO){
        int result = couponDAO.useMyCoupon(couponOwnerDTO);
        return result > 0 ? "ok" : "fail";
    }

    /** My 쿠폰 삭제 **/
    public String delMyCoupon(int couponOwnerSeq){
        int result = couponDAO.delMyCoupon(couponOwnerSeq);
        return result > 0 ? "ok" : "fail";
    }

}
