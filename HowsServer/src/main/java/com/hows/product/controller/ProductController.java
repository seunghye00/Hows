package com.hows.product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.product.dto.ProductDTO;
import com.hows.product.service.ProductService;

@RestController
@RequestMapping("/product")
public class ProductController {
	
	@Autowired
	private ProductService productServ;
	
	
	// 전체 목록 출력
	@GetMapping
	public ResponseEntity<List<ProductDTO>> getProducts () throws Exception{
		List<ProductDTO> products = productServ.getProducts();
		return ResponseEntity.ok(products);
	}
	
	// 카테고리별 목록 출력
	@GetMapping("/category/{product_category_code}")
	public ResponseEntity<List<ProductDTO>> getProductByCategory (@PathVariable String product_category_code) throws Exception {
		List<ProductDTO> products = productServ.getProductByCategory(product_category_code);
		return ResponseEntity.ok(products);
	}
	
	// 디테일 출력 
	@GetMapping("/detail/{product_seq}")
	public ResponseEntity<ProductDTO> getProductByDetail (@PathVariable String product_seq) throws Exception{
		ProductDTO detaile = productServ.getProductByDetail(product_seq);
		return ResponseEntity.ok(detaile);
	}
	
	
	
	
	
	
	
	@ExceptionHandler(Exception.class)
	public String exceptionHandler(Exception e) {
		e.printStackTrace();
		return "redirect:/error";
	}
}
