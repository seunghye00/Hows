package com.hows.order.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.order.dao.ReturnDAO;
import com.hows.order.dto.OrderDTO;
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
}
