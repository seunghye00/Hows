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
	
    @Autowired
    private Storage storage;

	@GetMapping
	public ResponseEntity<List<BannerDTO>> getAllBanners() throws Exception {
		List<BannerDTO> list = bannServ.getAllBanners();
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<String> addBanner(MultipartFile file) throws Exception {
		
		try {
			String bucketName = "sion-attachment";
			String sysName = UUID.randomUUID().toString();
			String contentType = file.getContentType();

			// 업로드 하기 위한 정보 객체 생성
			BlobId bolbId = BlobId.of(bucketName, sysName);
			BlobInfo blobInfo = BlobInfo.newBuilder(bolbId).setContentType(contentType).build();
			// 실제 GCS에 업로드 하는 코드
			Blob blob = storage.create(blobInfo, file.getBytes());
			if (blob == null) {
				return ResponseEntity.badRequest().body("GCS 오류");
			}
				String result = "https://storage.google.com/" + bucketName + "/" + sysName;
				bannServ.insert(new BannerDTO(0L, result, null, null, 0));

			return ResponseEntity.ok("success");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Failed to upload");
		}
	}
	
	@DeleteMapping
	public ResponseEntity<String> deleteBanner(@RequestParam String seqs) throws Exception {
		String[] bannerSeqs = seqs.split(","); // seqs를 배열로 변환
	    System.out.println(Arrays.toString(bannerSeqs));
	    return ResponseEntity.ok("success");
	}

	@ExceptionHandler(Exception.class)
	public String exceptionHandler(Exception e) {
		e.printStackTrace();
		return "redirect:/error";
	}
}
