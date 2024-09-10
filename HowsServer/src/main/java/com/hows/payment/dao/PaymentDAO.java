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

}
