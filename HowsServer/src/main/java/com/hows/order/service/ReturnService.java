package com.hows.order.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.order.dao.ReturnDAO;
import com.hows.order.dto.ReturnDTO;

@Service
public class ReturnService {
    
	@Autowired
    private ReturnDAO returnDAO;

	// 반품 상태 변경
	public String updateReturn(ReturnDTO dto) {
		int result = returnDAO.updateReturn(dto);
        return result > 0 ? "ok" : "fail";
	}

	// 반품 내역 생성
	public String insert(ReturnDTO dto) {
		int result = returnDAO.insert(dto);
        return result > 0 ? "ok" : "fail";
	}
}
