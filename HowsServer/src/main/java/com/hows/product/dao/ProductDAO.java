package com.hows.product.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.product.dto.ProductDTO;

@Repository
public class ProductDAO {
	
	@Autowired
	private SqlSession myBatis;
	
	// 전체 목록 출력
	public List<ProductDTO> getProducts () throws Exception{
		return myBatis.selectList("Product.getProducts");
	}
	
	// 카테고리별 목록 출력
	public List<ProductDTO> getProductByCategory (String product_category_code) throws Exception{
		return myBatis.selectList("Product.getProductByCategory", product_category_code);
	}
	
	// 디테일 출력
	public ProductDTO getProductDetaile (String product_seq) throws Exception{
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
}
