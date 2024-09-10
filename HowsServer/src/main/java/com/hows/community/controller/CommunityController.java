package com.hows.community.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.storage.Storage;
import com.hows.community.dto.CommunityDTO;
import com.hows.community.dto.ImageDTO;
import com.hows.community.dto.TagDTO;
import com.hows.community.service.CommunityService;

@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    private CommunityService communityService;

    @Autowired
    private Storage storage;

    @Value("${gcp.bucket}")
    private String bucketName;

    // 게시글 저장
    @PostMapping
    public ResponseEntity<Integer> insertWrite(@RequestBody CommunityDTO dto) {
        // 게시글 정보 출력
        int board_seq = communityService.insertWrite(dto);
        System.out.println(board_seq + " 현재 시퀀스 값");
        return ResponseEntity.ok(board_seq);
    }

    // 이미지 및 태그 저장
    @PostMapping("/images")
    public ResponseEntity<Void> insertImagesAndTags(@RequestBody ImageDTO imageDTO) {
        System.out.println("게시글 번호: " + imageDTO.getBoard_seq());
        System.out.println("이미지 URL: " + imageDTO.getImage_url()); // base64 인코딩된 이미지
        System.out.println("이미지 순서: " + imageDTO.getImage_order());

        // 1. 이미지 확장자 추출 및 sysname 생성
        String sysname = generateSysname(imageDTO); // GCP에 저장할 파일명 생성
        System.out.println(sysname + " sysname 값 확인");

        // 2. GCP 저장 로직 (base64 디코딩 후 업로드)
        //BlobId blobId = BlobId.of(bucketName, sysname); 
        //BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        //storage.create(blobInfo, decodeBase64(imageDTO.getImage_url())); // base64 디코딩 후 업로드

        // 3. 이미지 정보를 DB에 저장 (sysname으로 URL 대체)
        imageDTO.setImage_url(sysname);  // sysname을 image_url에 저장 (GCP의 저장된 경로)
        int board_image_seq = communityService.insertImage(imageDTO); // DB에 저장된 이미지 시퀀스 얻기
        System.out.println("저장된 이미지 시퀀스: " + board_image_seq);

        // 4. 태그 저장 로직
        List<TagDTO> tags = imageDTO.getTags();
        if (tags != null && !tags.isEmpty()) {
            for (TagDTO tag : tags) {
                tag.setBoard_image_seq(board_image_seq); // 이미지 시퀀스 설정
                communityService.insertTag(tag); // 태그 DB에 저장
            }
        }

        return ResponseEntity.ok().build();
    }
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> selectAll() {
        // 게시글 정보 리스트
        List<Map<String, Object>> list = communityService.selectAll();
        // 이미지 정보 리스트
        List<Map<String, Object>> listImg = communityService.selectAllImg();

        // 이미지 데이터를 board_seq로 매핑하기 위한 맵 생성
        Map<Integer, List<String>> imageMap = new HashMap<>();

        // listImg에서 board_seq를 기준으로 이미지 리스트를 맵에 저장
        for (Map<String, Object> imgData : listImg) {
            BigDecimal boardSeqDecimal = (BigDecimal) imgData.get("BOARD_SEQ");
            Integer boardSeq = boardSeqDecimal != null ? boardSeqDecimal.intValue() : null;
            String imageUrl = (String) imgData.get("IMAGE_URL");
            // 이미지 URL이 null이 아닌 경우에만 추가
            if (imageUrl != null) {
                imageMap.putIfAbsent(boardSeq, new ArrayList<>());
                imageMap.get(boardSeq).add(imageUrl);
            }
        }

        // 게시글 리스트에 이미지 리스트를 병합
        for (Map<String, Object> boardData : list) {
            // 먼저 BigDecimal로 값을 가져옴
            BigDecimal boardSeqDecimal = (BigDecimal) boardData.get("BOARD_SEQ");
            
            // BigDecimal을 Integer로 변환
            Integer boardSeq = boardSeqDecimal != null ? boardSeqDecimal.intValue() : null;
            
            List<String> images = imageMap.getOrDefault(boardSeq, new ArrayList<>());

            // 이미지가 없는 경우 빈 배열 설정
            boardData.put("images", images);
        }

        // 최종 합쳐진 리스트 반환
        return ResponseEntity.ok(list);
    }
    
    @GetMapping("/{board_seq}")
    public ResponseEntity<Void> selectAllSeq(@PathVariable int board_seq) {
        // 요청이 제대로 들어오는지 확인하기 위해 콘솔에 찍어봄
        System.out.println("Request received for board_seq: " + board_seq);

        // 이후 실제 로직을 추가할 수 있음
        return ResponseEntity.ok().build();
    }



    // base64 디코딩 함수 (추가 필요)
    private byte[] decodeBase64(String base64Image) {
        String base64Data = base64Image.split(",")[1]; // "data:image/png;base64," 부분을 제거하고 실제 데이터만 디코딩
        return Base64.getDecoder().decode(base64Data);
    }

    // 이미지 데이터에서 확장자를 추출하는 함수
    public String extractFileExtension(String base64Data) {
        if (base64Data.startsWith("data:")) {
            return base64Data.substring(base64Data.indexOf("/") + 1, base64Data.indexOf(";"));
        }
        throw new IllegalArgumentException("잘못된 base64 형식입니다.");
    }

    // 동적으로 파일 이름을 생성하는 함수
    public String generateSysname(ImageDTO imageDTO) {
        String fileExtension = extractFileExtension(imageDTO.getImage_url());
        return "board_" + imageDTO.getBoard_seq() + "_image_" + imageDTO.getImage_order() + "." + fileExtension;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
       e.printStackTrace();
       return ResponseEntity.badRequest().body("fail");
    }
}
