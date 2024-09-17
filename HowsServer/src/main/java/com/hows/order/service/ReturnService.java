package com.hows.order.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.order.dao.ReturnDAO;
import com.hows.order.dto.ReturnDTO;

@Service
public class ReturnService {
    
	@Autowired
    private ReturnDAO returnDAO;


}
