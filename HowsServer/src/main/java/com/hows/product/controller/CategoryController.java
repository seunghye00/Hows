package com.hows.product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.product.dto.CategoryDTO;
import com.hows.product.service.CategoryService;


@RestController
@RequestMapping("/category")
public class CategoryController {
	
	@Autowired
	private CategoryService categoryServ;
	
	// 카테고리 목록 출력
	@GetMapping
	public ResponseEntity<List<CategoryDTO>> categoryList () 
	throws Exception{ 
		List<CategoryDTO> list = categoryServ.categoryList();
		return ResponseEntity.ok(list);
	} 
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}