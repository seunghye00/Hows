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
	
	// 베스트 상품 목록 출력
    public List<ProductDTO> getBestProducts() {
        return productDAO.getBestProducts();
    }
	
	// 전체 목록 출력 
	public List<ProductDTO> getProducts () throws Exception{
		return productDAO.getProducts();
	}
	
	// 카테고리별 목록 출력
	public List<ProductDTO> getProductByCategory (String product_category_code) throws Exception {
		return productDAO.getProductByCategory(product_category_code);
	}
	
	// 디테일 출력
	public ProductDTO getProductByDetail (String product_seq) throws Exception {
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
}