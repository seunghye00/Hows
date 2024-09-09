package com.hows.cart.controller;

import com.hows.cart.dto.CartDTO;
import com.hows.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartServ;

    @GetMapping
    public ResponseEntity<List<HashMap<String, Object>>> cartList(@AuthenticationPrincipal UserDetails user) {
        try{
            List<HashMap<String, Object>> list = cartServ.cartList(user.getUsername());
            return ResponseEntity.ok(list);

        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping
    public ResponseEntity<String> addCart(@RequestBody CartDTO cartDTO) throws Exception {
        String result = cartServ.addCart(cartDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<String> updateCart(@RequestBody CartDTO cartDTO) throws Exception {
        String result = cartServ.updateCart(cartDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{seq}")
    public ResponseEntity<String> deleteCart(@PathVariable int seq) throws Exception {
        String result = cartServ.deleteCart(seq);
        return ResponseEntity.ok(result);
    }

    /** throws Exception 처리 **/
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
        e.printStackTrace();
        return ResponseEntity.ok("fail");
    }

}
