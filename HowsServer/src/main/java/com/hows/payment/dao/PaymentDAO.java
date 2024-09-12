package com.hows.payment.dao;

import com.hows.payment.dto.PaymentDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

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

}
