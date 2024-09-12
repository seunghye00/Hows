package com.hows.notice.controller;

import java.util.List;

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

import org.springframework.util.StringUtils;
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
			String imageUrl = null;

			// 파일이 업로드된 경우
			if (file != null && !file.isEmpty()) {
				// GCS에 파일 업로드
				String code = "F6";
				imageUrl = Fservice.upload(file, 0, code);
				if ("fail".equals(imageUrl)) {
					throw new Exception("File upload failed");
				}
				System.out.println("GCS 업로드 성공: " + imageUrl);
			}

			// 이미지가 포함된 공지사항 내용 생성
			String fullContents = notice_contents;
			if (StringUtils.hasText(imageUrl)) {
				fullContents += "<br><img src='" + imageUrl + "' alt='공지사항 이미지'>";
			}

			// NoticeDTO에 제목과 내용을 설정
			NoticeDTO dto = new NoticeDTO();
			dto.setNotice_title(notice_title);
			dto.setNotice_contents(fullContents);

			System.out.println("컨트롤러 : " + dto);
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
	public ResponseEntity<List<NoticeDTO>> selectNtc() {
		List<NoticeDTO> noticeList = Nservice.selectNtc();
		System.out.println(noticeList);
		return ResponseEntity.ok(noticeList);
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
			String imageUrl = null;

			// 파일이 업로드된 경우에만 GCS에 업데이트
			if (file != null && !file.isEmpty()) {
				// 기존 파일이 있는지 확인하고 삭제
				String oldSysName = Fservice.getSysName(notice_seq);
				if (oldSysName != null) {
					Fservice.deleteFile(oldSysName, "F6");
				}

				// GCS에 새 파일 업로드
				imageUrl = Fservice.upload(file, notice_seq, "F6");
				if ("fail".equals(imageUrl)) {
					throw new Exception("File upload failed");
				}
			}

			// NoticeDTO에 제목과 내용을 설정
			NoticeDTO dto = new NoticeDTO();
			dto.setNotice_title(notice_title);
			dto.setNotice_contents(notice_contents);

			// 수정
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
			String sysName = Fservice.getSysName(notice_seq); // 해당 공지사항의 이미지 sysname 조회
			if (sysName != null) {
				Fservice.deleteFile(sysName, "F6"); // GCS 파일 삭제
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
