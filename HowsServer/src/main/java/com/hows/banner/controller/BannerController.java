package com.hows.banner.controller;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.hows.banner.dto.BannerDTO;
import com.hows.banner.service.BannerService;

@RestController
@RequestMapping("/banner")
public class BannerController {

	@Autowired
	private BannerService bannServ;

	@GetMapping
	public ResponseEntity<List<BannerDTO>> getAllBanners() throws Exception {
		List<BannerDTO> list = bannServ.getAllBanners();
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<String> addBanner(MultipartFile file) throws Exception {
		if (bannServ.addBanner(file)) {
			return ResponseEntity.ok("success");
		}
		return ResponseEntity.badRequest().body("fail");

	}

	@DeleteMapping
	public ResponseEntity<String> deleteBanner(@RequestParam String sysNames) throws Exception {
		String[] bannerNames = sysNames.split(","); // seqs를 배열로 변환
		if(bannServ.deleteBanner(bannerNames)) {
			return ResponseEntity.ok("success");
		}
		return ResponseEntity.badRequest().body("fail");
	}

	@ExceptionHandler(Exception.class)
	public String exceptionHandler(Exception e) {
		e.printStackTrace();
		return "redirect:/error";
	}
}
