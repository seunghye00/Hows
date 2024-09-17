package com.hows.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.order.dto.ReturnDTO;
import com.hows.order.service.ReturnService;

@RestController
@RequestMapping("/return")
public class ReturnController {
	
	@Autowired
	private ReturnService returnServ;
	

}
