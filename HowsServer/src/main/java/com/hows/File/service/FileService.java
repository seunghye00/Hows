package com.hows.File.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.Storage;
import com.hows.File.dao.FileDAO;
import com.hows.File.dto.FileDTO;
import com.hows.common.GCSFile;

@Service
public class FileService {

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private Storage storage;

	@Autowired
	private GCSFile gcsFile;

	@Value("${gcp.bucket}")
	private String bucket;

	public FileService(Storage storage) {
		this.storage = storage;
	}

	/** 파일 업로드 **/
	public String upload(MultipartFile file, int parentSeq, String code) {
		String result = "fail";
		try {
			String oriName = file.getOriginalFilename();
			String sysName = UUID.randomUUID().toString();

			// F1: 프로필(멤버), F2: 커뮤니티, F3: 상품, F4: 리뷰, F5: 배너, F6: 공지
			// 각자 컨트롤러에 맞는 code 고정하고 사용
			// String code = "F1";

			// 1. 이미지 gcs 서버에 업로드
			result = gcsFile.addFileGcs(file, sysName, code);

			// 2. 이미지 업로드 성공
			if (!result.equals("fail")) {

				// 3. 이미지 File 테이블에 저장
				FileDTO dto = new FileDTO(0, code, oriName, sysName, parentSeq);
				int value = fileDAO.upload(dto);

				// 4. 태이블에 저장 실패 시 gcs 서버에서 이미지 삭제
				if (value <= 0) {
					gcsFile.deleteFileGcs(sysName, code);
				}

				// 배너를 등록한 경우 생성된 file 데이터 반환
				if (code.equals("F5")) {
					Map<String, Object> bannerInfo = new HashMap<>();
					bannerInfo.put("file_seq", dto.getFile_seq());
					bannerInfo.put("sysName", sysName);
					bannerInfo.put("banner_url", result);
					// Jackson 라이브러리를 사용하여 Map을 JSON 문자열로 변환하여 반환
					return new ObjectMapper().writeValueAsString(bannerInfo);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/** 파일 삭제 **/
	public String deleteFile(String sysName, String code) {
		String result = "fail";
		try {
			result = gcsFile.deleteFileGcs(sysName, code);
			fileDAO.deleteFile(sysName);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	// fileCode와 parent_seq로 파일의 sysname 조회
	public List<String> getSysNames(int parentSeq, String fileCode) {
		return fileDAO.getSysNames(parentSeq, fileCode);
	}

	// parent_seq 업데이트
	public boolean updateParentSeq(int parentSeq, int fileSeq) {
		return fileDAO.updateParentSeq(parentSeq, fileSeq);
	}

	// parent_seq가 0인 파일 목록 삭제
	@Transactional
	public void deleteFilesByNotFound() {
		List<FileDTO> list = fileDAO.getFilesByNotFound();
		for(FileDTO dto : list) {
			String result = gcsFile.deleteFileGcs(dto.getFile_sysname(), dto.getFile_code());
			if(result.equals("ok")) {
				fileDAO.deleteFile(dto.getFile_sysname());
			} else {
				throw new RuntimeException("파일 삭제 실패: " + dto.getFile_sysname());
			}
		}
	}
}
