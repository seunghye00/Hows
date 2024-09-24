package com.hows.product.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.order.dto.OrderListDTO;
import com.hows.product.dto.ProductDTO;

@Repository
public class ProductDAO {

	@Autowired
	private SqlSession myBatis;

	// 베스트 상품 목록 출력
	public List<ProductDTO> getBestProducts() {
		return myBatis.selectList("Product.getBestProducts");
	}

	// 전체 목록 출력
	public List<ProductDTO> getProducts() {
		return myBatis.selectList("Product.getProducts");
	}

	// 상품 리뷰 많은순 목록 출력
	public List<ProductDTO> getProductBytReview() {
		return myBatis.selectList("Product.getProductBytReview");
	}

	// 카테고리별 목록 출력
	public List<Map<String, Object>> getProductByCategory(String product_category_code) {
		return myBatis.selectList("Product.getProductByCategory", product_category_code);
	}

	// 디테일 출력
	public ProductDTO getProductDetaile(String product_seq) {
		return myBatis.selectOne("Product.getProductDetaile", product_seq);
	}

	// 상품 추가
	public int addProduct(ProductDTO dto) {
		return myBatis.insert("Product.insert", dto);
	}

	// 상품 대표 이미지 수정
	public int updateThumbNail(int product_seq, String url) {
		Map<String, Object> params = new HashMap<>();
		params.put("url", url);
		params.put("seq", product_seq);
		return myBatis.update("Product.updateThumbNail", params);
	}

	// 상품 삭제
	public boolean deleteProduct(int productSeq) {
		return myBatis.delete("Product.deleteProduct", productSeq) > 0;
	}

	// 상품 수량 변경
	public boolean updateByQuantity(int productSeq, int quantity) {
		Map<String, Object> params = new HashMap<>();
		params.put("productSeq", productSeq);
		params.put("quantity", quantity);
		return myBatis.update("Product.updateByQuantity", params) > 0;
	}

	// 카테고리별 상품 수 조회
	public List<Map<String, Object>> getProductNumByCategory() {
		return myBatis.selectList("Product.getProductNumByCategory", "category_title");
	}

	/** 주문 시 상품 수량 변경 **/
	public int updateQuantity(OrderListDTO dto) {
		return myBatis.update("Product.updateQuantity", dto);
	}

	// 판매량 순 베스트 상품 조회
	public List<ProductDTO> getBestProductBySelling() {
		return myBatis.selectList("Product.getBestProductBySelling");
	}

	// 리뷰 작성 순 베스트 상품 조회
	public List<ProductDTO> getBestProductByReview() {
		return myBatis.selectList("Product.getBestProductByReview");
	}

	// 상품 전체 목록 조회 (관리자)
	public List<ProductDTO> getProductsByAdmin() {
		return myBatis.selectList("Product.getProductsByAdmin");
	}
}
