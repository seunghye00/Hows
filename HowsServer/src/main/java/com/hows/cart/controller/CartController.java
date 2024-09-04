package com.hows.cart.controller;

import com.hows.cart.dto.CartDTO;
import com.hows.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<CartDTO>> cartList() {
        try{
            List<CartDTO> list = cartServ.cartList();
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

    @PutMapping("/{seq}")
    public ResponseEntity<String> updateCart(@PathVariable int seq, int count) throws Exception {
        Map<String, Integer> map = new HashMap<>();
        map.put("seq", seq);
        map.put("count", count);

        String result = cartServ.updateCart(map);
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
