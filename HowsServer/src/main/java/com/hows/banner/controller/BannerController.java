package com.hows.banner.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hows.File.service.FileService;
import com.hows.banner.dto.BannerDTO;
import com.hows.banner.service.BannerService;
import com.hows.common.DateFormat;

@RestController
@RequestMapping("/banner")
public class BannerController {

	@Autowired
	private BannerService bannServ;

	@Autowired
	private FileService fileServ;

	@GetMapping
	public ResponseEntity<List<BannerDTO>> getAllBanners() throws Exception {
		List<BannerDTO> list = bannServ.getAllBanners();
		return ResponseEntity.ok(list);
	}

	// 관리자 기능
	@GetMapping("/getAllBanners")
	public ResponseEntity<List<BannerDTO>> getAllBannersByAdmin() throws Exception {
		List<BannerDTO> list = bannServ.getAllBannersByAdmin();
		return ResponseEntity.ok(list);
	}

	// 관리자 기능
	@PostMapping
	public ResponseEntity<String> addBanner(@RequestParam("file") MultipartFile file, String startDate, String endDate,
			int banner_order) throws Exception {

		// 파일을 서버와 DB에 저장하고 반환받은 파일 정보에 대한 JSON 문자열
		String bannerInfo = fileServ.upload(file, 0, "F5");
		
		// 문자열을 Map으로 변환
		Map<String, Object> map = new ObjectMapper().readValue(bannerInfo, new TypeReference<Map<String, Object>>() {});
		int file_seq = (int) map.get("file_seq");
		String sysName = (String) map.get("sysName");
		String banner_url = (String) map.get("banner_url");
		
		BannerDTO dto = new BannerDTO(0, file_seq, banner_url, DateFormat.convertToDate(startDate),
				DateFormat.convertToDate(endDate), banner_order);
		if (bannServ.addBanner(dto) > 0) {
			int bannerSeq = dto.getBanner_seq();
			if (fileServ.updateParentSeq(bannerSeq, file_seq)) {
				return ResponseEntity.ok("success");
			}
		}
		// banner에 대한 정보를 DB에 저장하는데 실패했을 경우 file 관련 정보 삭제
		fileServ.deleteFile(sysName, "F5");
		return ResponseEntity.badRequest().body("fail");
	}

	// 관리자 기능
	@DeleteMapping
	@Transactional
	public ResponseEntity<String> deleteBanner(@RequestParam String seqs) throws Exception {
		String[] bannerSeqs = seqs.split(","); // seqs를 배열로 변환
		for (String bannerSeq : bannerSeqs) {
			try {
				int banner_seq = Integer.parseInt(bannerSeq);
				if (!bannServ.deleteBanner(banner_seq)) {
					throw new RuntimeException("배너 삭제 실패");
				}
				String sysName = fileServ.getSysNames(banner_seq, "F5").get(0);
				String result = fileServ.deleteFile(sysName, "F5");
				if (result.equals("fail")) {
					throw new RuntimeException("파일 삭제 실패: " + sysName);
				}
			} catch (Exception e) {
				// 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
				throw new RuntimeException("배너 삭제 실패", e);
			}
		}
		return ResponseEntity.ok("success");
	}

	// 관리자 기능
	// 배너와 이벤트 글 연결
	@PutMapping
	public ResponseEntity<Boolean> updateBanner(@RequestParam int banner_seq, @RequestParam int event_seq)
			throws Exception {
	    
		// 배너와 이벤트 연결 서비스 호출
		boolean result = bannServ.connectEvent(banner_seq, event_seq);
		// 성공적으로 업데이트 되었는지 여부 반환
		return ResponseEntity.ok(result);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
