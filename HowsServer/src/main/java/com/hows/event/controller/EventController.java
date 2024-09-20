package com.hows.event.controller;

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
import com.hows.event.dto.EventDTO;
import com.hows.event.service.EventService;

@RestController
@RequestMapping("/event")
public class EventController {

	@Autowired
	private EventService Eservice;

	@Autowired
	private FileService Fservice;

	// 이벤트 등록
	@PostMapping("/insert")
	public ResponseEntity<String> insertEvt(@RequestParam("event_title") String event_title,
			@RequestParam("event_contents") String event_contents,
			@RequestParam(value = "file", required = false) MultipartFile file) {

		try {

			// EventDTO 에 제목과 내용을 설정
			EventDTO dto = new EventDTO();
			
			dto.setEvent_title(event_title);
			dto.setEvent_contents(event_contents);

			// 이벤트 생성
			Eservice.insertEvt(dto);

			return ResponseEntity.ok("이벤트가 등록되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("이벤트 등록 실패: " + e.getMessage());
		}
	}

	// 이벤트 조회
	@GetMapping("/list")
	public ResponseEntity<Map<String, Object>> selectEvt(@RequestParam int startRow, @RequestParam int endRow) {
		// 전체 이벤트 수 조회
		int totalEvents = Eservice.EvtCount();

		// 페이징된 이벤트 목록 조회
		List<EventDTO> eventList = Eservice.selectEvt(startRow, endRow);

		// 응답 데이터 생성
		Map<String, Object> response = new HashMap<>();
		response.put("totalEvents", totalEvents); // 전체 이벤트 수
		response.put("eventList", eventList); // 페이징된 이벤트 목록

		return ResponseEntity.ok(response);
	}

	// 이벤트 상세조회
	@GetMapping("/detail/{event_seq}")
	public ResponseEntity<EventDTO> detailEvt(@PathVariable int event_seq) {
		EventDTO event = Eservice.detailEvt(event_seq);

		if (event == null) {
			return ResponseEntity.notFound().build();
		}
		// 조회수 증가
		Eservice.viewCount(event_seq);

		return ResponseEntity.ok(event);
	}

	// 이벤트 수정
	@PutMapping("/modify/{event_seq}")
	public ResponseEntity<String> modifyEvt(@PathVariable int event_seq,
			@RequestParam("event_title") String event_title, @RequestParam("event_contents") String event_contents,
			@RequestParam(value = "file", required = false) MultipartFile file) {
		try {
			// 기존 이벤트를 수정하기 위해 event_seq를 사용
			EventDTO dto = new EventDTO();
			dto.setEvent_seq(event_seq);
			dto.setEvent_title(event_title);
			dto.setEvent_contents(event_contents);

			// 수정 로직 호출
			Eservice.modifyEvt(event_seq, dto);

			return ResponseEntity.ok("이벤트가 수정되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("이벤트 수정 실패: " + e.getMessage());
		}
	}

	// 이벤트 삭제
	@DeleteMapping("/delete/{event_seq}")
	public ResponseEntity<String> deleteEvt(@PathVariable int event_seq) {
		try {
			// GCS에 있는 파일 삭제 (이미지 정보가 있을 경우에만)
			List<String> sysNames = Fservice.getSysNames(event_seq, "F6"); // 해당 이벤트의 이미지 sysName 목록 조회
			if (sysNames != null && !sysNames.isEmpty()) {
				for (String sysName : sysNames) {
					Fservice.deleteFile(sysName, "F6"); // GCS 파일 삭제
				}
			}

			// 공지사항 삭제
			Eservice.deleteEvt(event_seq);

			return ResponseEntity.ok("이벤트가 삭제되었습니다.");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("이벤트 삭제 실패: " + e.getMessage());
		}
	}

}
