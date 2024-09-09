package com.hows.product.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.product.dto.ProductDTO;

@Repository
public class ProductDAO {
	@Autowired
	private SqlSession myBatis;
	
	// 목록 출력
	public List<ProductDTO> getProductByCategory (String product_category_code) throws Exception{
		return myBatis.selectList("Product.getProductByCategory", product_category_code);
	}
	
	public ProductDTO getProductDetaile (String product_seq) throws Exception{
		return myBatis.selectOne("Product.getProductDetaile", product_seq);
	}
}
