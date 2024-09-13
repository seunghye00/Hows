package com.hows.cart.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.cart.dto.CartDTO;
import com.hows.cart.service.CartService;
import com.hows.common.CustomUserDetails;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartServ;

    @GetMapping
    public ResponseEntity<List<HashMap<String, Object>>> cartList(@AuthenticationPrincipal CustomUserDetails user) {
        try{
            List<HashMap<String, Object>> list = cartServ.cartList(user.getMemberSeq());
            return ResponseEntity.ok(list);

        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping
    public ResponseEntity<String> addCart(@AuthenticationPrincipal CustomUserDetails user, @RequestBody CartDTO cartDTO) throws Exception {
        cartDTO.setMember_seq(user.getMemberSeq());
    	String result = cartServ.addCart(cartDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<String> updateCart(@RequestBody CartDTO cartDTO) throws Exception {
        String result = cartServ.updateCart(cartDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{seq}/{type}")
    public ResponseEntity<String> deleteCart(@AuthenticationPrincipal CustomUserDetails user, @PathVariable int seq, @PathVariable String type) throws Exception {
        String result = cartServ.deleteCart(seq, user.getMemberSeq(), type);
        return ResponseEntity.ok(result);
    }

    /** throws Exception 처리 **/
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
        e.printStackTrace();
        return ResponseEntity.ok("fail");
    }

}
