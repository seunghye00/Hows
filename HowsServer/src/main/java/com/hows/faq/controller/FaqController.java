package com.hows.faq.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.faq.dto.FaqDTO;
import com.hows.faq.service.FaqService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/faq")
public class FaqController {

	@Autowired
	private FaqService service;

	// FAQ 등록
	@PostMapping
	public void insertFaq(@RequestBody FaqDTO faq) {
		service.insertFaq(faq);
	}

	// FAQ 조회
	@GetMapping
	public List<FaqDTO> selectAllFaq() {
		return service.selectAllFaq();
	}

	// FAQ 수정
	@PutMapping("/{faq_seq}")
	public void updateFaq(@PathVariable int faq_seq, @RequestBody FaqDTO faq) {
		faq.setFaq_seq(faq_seq);
		service.updateFaq(faq);
	}

	// FAQ 삭제
	@DeleteMapping("/{faq_seq}")
	public void deleteFaq(@PathVariable int faq_seq) {
		service.deleteFaq(faq_seq);
	}

}
