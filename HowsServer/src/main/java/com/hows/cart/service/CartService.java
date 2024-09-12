package com.hows.cart.service;

import com.hows.cart.dao.CartDAO;
import com.hows.cart.dto.CartDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    private CartDAO cartDAO;

    /** 상품 목록 **/
    public List<HashMap<String, Object>> cartList(int memberSeq) {
        return cartDAO.cartList(memberSeq);
    }

    /** 상품 추가 **/
    public String addCart(CartDTO cartDTO) {
        int result = cartDAO.addCart(cartDTO);
        return result > 0 ? "ok" : "fail";
    }

    /** 상품 수정 (수량 ) **/
    public String updateCart(CartDTO cartDTO) {
        int result = cartDAO.updateCart(cartDTO);
        return result > 0 ? "ok" : "fail";
    }

    /** 상품 삭제 **/
    public String deleteCart(int seq, int memberSeq, String type) {
        int result = 0;
        if(type.equals("cart")){
            // seq : cart_seq
            result = cartDAO.deleteCart(seq);
        } else if(type.equals("saleSuccess")){
            // seq : product_seq
            CartDTO cartDTO = new CartDTO(seq, memberSeq);
            result = cartDAO.saleSuccessCart(cartDTO);
        }
        return result > 0 ? "ok" : "fail";
    }

}
