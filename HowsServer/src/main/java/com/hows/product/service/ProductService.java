package com.hows.product.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.product.dao.ProductDAO;
import com.hows.product.dto.ProductDTO;

@Service
public class ProductService {

	@Autowired
	private ProductDAO productDAO;

	// 상품 '베스트' 목록 출력
	public List<ProductDTO> getBestProducts() {
		return productDAO.getBestProducts();
	}

	// 상품 '전체' 목록 출력
	public List<ProductDTO> getProducts() {
		return productDAO.getProducts();
	}

	// 상품 리뷰 많은순 목록 출력
	public List<ProductDTO> getProductBytReview() {
		return productDAO.getProductBytReview();
	}

	// 상품 '카테고리'별 목록 출력
	public List<Map<String, Object>> getProductByCategory(String product_category_code) {
		return productDAO.getProductByCategory(product_category_code);
	}

	// 상품 '디테일' 출력
	public ProductDTO getProductByDetail(String product_seq) {
		return productDAO.getProductDetaile(product_seq);
	}

	// 상품 추가
	public int addProduct(ProductDTO dto) {
		return productDAO.addProduct(dto);
	}

	// 상품 대표 이미지 변경
	public int updateThumbNail(int product_seq, String url) {
		return productDAO.updateThumbNail(product_seq, url);
	}

	// 상품 삭제
	public boolean deleteProduct(int productSeq) {
		return productDAO.deleteProduct(productSeq);
	}

	// 상품 수량 변경
	public boolean updateByQuantity(int productSeq, int quantity) {
		return productDAO.updateByQuantity(productSeq, quantity);
	}

	// 카테고리별 상품 수 조회
	public List<Map<String, Object>> getProductNumByCategory() {
		return productDAO.getProductNumByCategory();
	}

	// 조건별 베스트 상품 조회
	public List<ProductDTO> getBestProductByCondition(String condition) {
		switch(condition) {
		case "selling":
			return productDAO.getBestProductBySelling();
		case "review":
			return productDAO.getBestProductByReview();
		default:
			return null;
		}
	}

	// 상품 전체 목록 조회 (관리자)
	public List<ProductDTO> getProductsByAdmin() {
		return productDAO.getProductsByAdmin();
	}
}