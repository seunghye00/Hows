package com.hows.product.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.product.dao.ProductDAO;
import com.hows.product.dto.ProductDTO;

@Service
public class ProductService {
	
	@Autowired
	private ProductDAO productDAO;
	
	// 목록 출력
	public List<ProductDTO> getProductByCategory (String product_category_code) throws Exception {
		return productDAO.getProductByCategory(product_category_code);
	}
}
