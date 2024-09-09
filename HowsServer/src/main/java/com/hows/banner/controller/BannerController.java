package com.hows.banner.controller;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hows.banner.dto.BannerDTO;
import com.hows.banner.service.BannerService;

@RestController
@RequestMapping("/banner")
public class BannerController {

	@Autowired
	private BannerService bannServ;

    // 요청 처리 전에 호출되어 SimpleDateFormat을 사용하여 문자열을 Timestamp 객체로 변환하는 CustomDateEditor를 등록
    // 두 번째 파라미터 true는 빈 문자열을 허용할지 여부 결정
	@InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        binder.registerCustomEditor(Timestamp.class, new CustomDateEditor(dateFormat, true));
    }
	
	@GetMapping
	public ResponseEntity<List<BannerDTO>> getAllBanners() throws Exception {
		List<BannerDTO> list = bannServ.getAllBanners();
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<String> addBanner(@RequestParam("file") MultipartFile file, @ModelAttribute BannerDTO banner) throws Exception {
		
		System.out.println(file.getSize());
		System.out.println(banner.getStart_date());
		System.out.println(banner.getEnd_date());
		System.out.println(banner.getBanner_order());
		
		//if (bannServ.addBanner(file)) {
			return ResponseEntity.ok("success");
		//}
		//return ResponseEntity.badRequest().body("fail");
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
