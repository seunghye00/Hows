package com.hows.product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hows.File.service.FileService;
import com.hows.product.dto.ProductDTO;
import com.hows.product.service.ProductService;

@RestController
@RequestMapping("/product")
public class ProductController {
	
	@Autowired
	private ProductService productServ;
	
	@Autowired
	private FileService fileServ;
	
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
	
	// 상품 추가
	@PostMapping
	@Transactional
	public ResponseEntity<String> addProduct (MultipartFile[] images, ProductDTO dto, int thumbNailIndex) throws Exception {
		
		// 대표 사진 파일 이름
		String thumbNailFileName = images[thumbNailIndex].getOriginalFilename();
		try {
			// 상품 정보 저장 후 대표 이미지 파일 GCP에 저장
			int result = productServ.addProduct(dto);
			if (result < 0) {
                throw new RuntimeException("상품 등록 실패");
            }
			int product_seq = dto.getProduct_seq();
			String url = fileServ.upload(images[thumbNailIndex], product_seq, "F3");
			
			// 상품 대표 이미지 url 업데이트
			int result2 = productServ.updateThumbNail(product_seq, url);
            if (result2 < 0) {
                throw new RuntimeException("대표 이미지 업데이트 실패");
            }
            
            for(MultipartFile img : images) {
    			if(!img.getOriginalFilename().equals(thumbNailFileName)) {
    				fileServ.upload(img, product_seq, "F3");
    			}
    		}
        } catch (Exception e) {
            // 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
            throw new RuntimeException("상품 등록 실패", e);
        }
		return ResponseEntity.ok().build();
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
