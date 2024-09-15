package com.hows.cart.dao;

import com.hows.cart.dto.CartDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
public class CartDAO {

    @Autowired
    private SqlSession mybatis;

    /** 상품 목록 **/
    public List<HashMap<String, Object>> cartList(int memberSeq) {
        return mybatis.selectList("Cart.cartList", memberSeq);
    }

    /** 상품 추가 **/
    public int addCart(CartDTO cartDTO) {
        return mybatis.insert("Cart.addCart", cartDTO);
    }

    /** 상품 수정 (수량 ) **/
    public int updateCart(CartDTO cartDTO) {
        return mybatis.update("Cart.updateCart", cartDTO);
    }

    /** 상품 삭제 **/
    public int deleteCart(int seq) {
        return mybatis.delete("Cart.deleteCart", seq);
    }

    /** 상품 구매 성공 시 카트에 있는 상품 삭제 **/
    public int saleSuccessCart(CartDTO cartDTO) {
        return mybatis.delete("Cart.saleSuccessCart", cartDTO);
    }

}
