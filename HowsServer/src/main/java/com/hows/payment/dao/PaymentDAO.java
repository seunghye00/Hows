package com.hows.payment.dao;

import com.hows.payment.dto.PaymentDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class PaymentDAO {

    @Autowired
    private SqlSession mybatis;

    /** 내 결제 내역 **/
    public List<PaymentDTO> paymentList(String id) {
        return mybatis.selectList("Payment.list", id);
    }

    /** 내 결제 내역 **/
    public List<?> myPayment(int memberSeq) {
        return mybatis.selectList("Payment.myPayment", memberSeq);
    }

    /** 결제 내역 추가 **/
    public int addPayment(PaymentDTO paymentDTO) {
        return mybatis.insert("Payment.addPayment", paymentDTO);
    }

    /** 결제 상태 변경 **/
    public int updatePayment(Map<String, Object> map) {
        return mybatis.update("Payment.updatePayment", map);
    }

    /** 결제 삭제 **/
    public int cancelPayment(String id) {
        return mybatis.delete("Payment.cancelPayment", id);
    }

    // 결제 취소 상태로 업데이트
	public boolean doneCancel(String paymentId) {
		return mybatis.update("Payment.doneCancel", paymentId) > 0;
	}
	
	// order_seq 조회
	public int getOrderSeq(int payment_seq) {
		return mybatis.selectOne("Payment.getOrderSeq", payment_seq);
	}

	// 오늘 매출 조회
	public int todayPaymentPrice() {
		return mybatis.selectOne("Payment.todayPaymentPrice");
	}
}
