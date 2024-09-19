package com.hows.coupon.dao;

import com.hows.coupon.dto.CouponDTO;
import com.hows.coupon.dto.CouponOwnerDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CouponDAO {

    @Autowired
    private SqlSession mybatis;

    /** 해당 쿠폰 조회 **/
    public CouponDTO getCoupon(int couponSeq) {
        return mybatis.selectOne("Coupon.getCoupon", couponSeq);
    }

    /** 쿠폰 추가 **/
    public int addCoupon(CouponDTO coupon) {
        return mybatis.insert("Coupon.addCoupon", coupon);
    }

    /** 쿠폰 삭제 **/
    public int delCoupon(int couponSeq) {
        return mybatis.delete("Coupon.delCoupon", couponSeq);
    }

    /** My 쿠폰 리스트 **/
    public List<Map<String, Object>> getMyCoupon(int memberSeq) {
        return mybatis.selectList("Coupon.getMyCoupon", memberSeq);
    }

    /** 쿠폰 발급 **/
    public int addMyCoupon(CouponOwnerDTO couponOwnerDTO) {
        return mybatis.insert("Coupon.addMyCoupon", couponOwnerDTO);
    }

    /** 쿠폰 사용 **/
    public int useMyCoupon(CouponOwnerDTO couponOwnerDTO) {
        return mybatis.update("Coupon.useMyCoupon", couponOwnerDTO);
    }

    /** My 쿠폰 삭제 **/
    public int delMyCoupon(int couponOwnerSeq) {
        return mybatis.delete("Coupon.delMyCoupon", couponOwnerSeq);
    }

}
