package com.hows.notice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hows.File.service.FileService;
import com.hows.notice.dto.NoticeDTO;
import com.hows.notice.service.NoticeService;

@RestController
@RequestMapping("/notice")
public class NoticeController {

	@Autowired
	private NoticeService Nservice;

	@Autowired
	private FileService Fservice;

	// 공지사항 등록
	@PostMapping("/insert")
	public ResponseEntity<String> insertNtc(@RequestParam("notice_title") String notice_title,
			@RequestParam("notice_contents") String notice_contents,
			@RequestParam(value = "file", required = false) MultipartFile file) {

		try {

			// NoticeDTO에 제목과 내용을 설정
			NoticeDTO dto = new NoticeDTO();
			dto.setNotice_title(notice_title);
			dto.setNotice_contents(notice_contents);

			// 공지사항 생성
			Nservice.insertNtc(dto);

			return ResponseEntity.ok("공지사항이 등록되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("공지사항 등록 실패: " + e.getMessage());
		}
	}

	// 공지사항 조회
	@GetMapping("/list")
	public ResponseEntity<Map<String, Object>> selectNtc(@RequestParam int startRow, @RequestParam int endRow)
			throws Exception {

		// 전체 공지사항 개수 조회
		int totalNotices = Nservice.NtcCount();

		// 페이징된 공지사항 목록 조회
		List<NoticeDTO> noticeList = Nservice.selectNtc(startRow, endRow);

		// 응답 데이터 생성
		Map<String, Object> response = new HashMap<>();
		response.put("totalNotices", totalNotices); // 전체 공지사항 개수
		response.put("noticeList", noticeList); // 페이징된 공지사항 목록

		return ResponseEntity.ok(response);
	}

	// 공지사항 상세조회
	@GetMapping("/detail/{notice_seq}")
	public ResponseEntity<NoticeDTO> detailNtc(@PathVariable int notice_seq) {
		NoticeDTO notice = Nservice.detailNtc(notice_seq);

		if (notice == null) {
			return ResponseEntity.notFound().build();
		}
		// 조회수 증가
		Nservice.viewCount(notice_seq);

		return ResponseEntity.ok(notice);
	}

	// 공지사항 수정
	@PutMapping("/modify/{notice_seq}")
	public ResponseEntity<String> modifyNtc(@PathVariable int notice_seq,
			@RequestParam("notice_title") String notice_title, @RequestParam("notice_contents") String notice_contents,
			@RequestParam(value = "file", required = false) MultipartFile file) {
		try {
			// 기존 공지사항을 수정하기 위해 notice_seq를 사용
			NoticeDTO dto = new NoticeDTO();
			dto.setNotice_seq(notice_seq);
			dto.setNotice_title(notice_title);
			dto.setNotice_contents(notice_contents);

			// 수정 로직 호출
			Nservice.modifyNtc(notice_seq, dto);

			return ResponseEntity.ok("공지사항이 수정되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("공지사항 수정 실패: " + e.getMessage());
		}
	}

	// 공지사항 삭제
	@DeleteMapping("/delete/{notice_seq}")
	public ResponseEntity<String> deleteNtc(@PathVariable int notice_seq) {
	    try {
	        // GCS에 있는 파일 삭제 (이미지 정보가 있을 경우에만)
	        List<String> sysNames = Fservice.getSysNames(notice_seq, "F6"); // 해당 공지사항의 이미지 sysName 목록 조회
	        if (sysNames != null && !sysNames.isEmpty()) {
	            for (String sysName : sysNames) {
	                Fservice.deleteFile(sysName, "F6"); // GCS 파일 삭제
	            }
	        }

	        // 공지사항 삭제
	        Nservice.deleteNtc(notice_seq);

	        return ResponseEntity.ok("공지사항이 삭제되었습니다.");

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.badRequest().body("공지사항 삭제 실패: " + e.getMessage());
	    }
	}

}

