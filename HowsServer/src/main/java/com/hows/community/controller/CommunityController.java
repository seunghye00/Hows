package com.hows.community.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hows.File.service.FileService; // FileService 클래스 import
import com.hows.community.dto.CommunityDTO; // CommunityDTO import
import com.hows.community.dto.ImageDTO; // ImageDTO import
import com.hows.community.dto.TagDTO; // TagDTO import
import com.hows.community.service.CommunityService; // CommunityService import
@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    private CommunityService communityServ;

    @Autowired
    private FileService fileServ;

    // 게시글 저장
    @PostMapping
    public ResponseEntity<Integer> insertWrite(@RequestBody CommunityDTO dto) {
        int board_seq = communityServ.insertWrite(dto);
        System.out.println(board_seq + " 현재 시퀀스 값");
        return ResponseEntity.ok(board_seq);
    }

    // 이미지 및 태그 저장
    @PostMapping("/images")
    public ResponseEntity<Void> insertImagesAndTags(
        @RequestPart("file") MultipartFile file,  // FormData에서 이미지 파일을 받음
        @RequestParam("board_seq") int board_seq,
        @RequestParam("image_order") int image_order,
        @RequestParam("tags") String tagsJson // 태그 데이터를 JSON 문자열로 받음
    ) {
        try {
            // 1. FileService를 통해 GCS에 이미지 업로드
            String code = "F2"; // 커뮤니티 코드 (필요에 따라 변경 가능)
            String uploadResult = fileServ.upload(file, board_seq, code); 
            System.out.println(uploadResult + " 업로드 결과 확인");

            // 2. 이미지가 성공적으로 업로드되었다면 sysname을 image_url에 저장
            if (!uploadResult.equals("fail")) {
                ImageDTO imageDTO = new ImageDTO();
                imageDTO.setBoard_seq(board_seq);
                imageDTO.setImage_url(uploadResult); // GCS에 저장된 이미지 URL을 DB에 저장
                imageDTO.setImage_order(image_order);

                // 3. 이미지 정보 DB에 저장
                int board_image_seq = communityServ.insertImage(imageDTO);
                System.out.println("저장된 이미지 시퀀스: " + board_image_seq);

                // 4. 태그 데이터 처리 (tagsJson을 JSON으로 파싱)
                List<TagDTO> tags = parseTagsFromJson(tagsJson, board_image_seq);
                if (tags != null && !tags.isEmpty()) {
                    for (TagDTO tag : tags) {
                        tag.setBoard_image_seq(board_image_seq);
                        communityServ.insertTag(tag); // 태그 DB에 저장
                    }
                }
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 태그 데이터를 JSON에서 List<TagDTO>로 파싱하는 메서드
    private List<TagDTO> parseTagsFromJson(String tagsJson, int board_image_seq) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<TagDTO> tags = objectMapper.readValue(tagsJson, new TypeReference<List<TagDTO>>() {});

        // 각 태그에 이미지 시퀀스 추가
        for (TagDTO tag : tags) {
            tag.setBoard_image_seq(board_image_seq);
        }
        return tags;
    }
    
    // 커뮤니티 게시글 불러오는 메서드
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> selectAll() {
        List<Map<String, Object>> list = communityServ.selectAll();
        List<Map<String, Object>> listImg = communityServ.selectAllImg();

        Map<Integer, List<String>> imageMap = new HashMap<>();
        for (Map<String, Object> imgData : listImg) {
            BigDecimal boardSeqDecimal = (BigDecimal) imgData.get("BOARD_SEQ");
            Integer boardSeq = boardSeqDecimal != null ? boardSeqDecimal.intValue() : null;
            String imageUrl = (String) imgData.get("IMAGE_URL");

            if (imageUrl != null) {
                imageMap.putIfAbsent(boardSeq, new ArrayList<>());
                imageMap.get(boardSeq).add(imageUrl);
            }
        }

        for (Map<String, Object> boardData : list) {
            BigDecimal boardSeqDecimal = (BigDecimal) boardData.get("BOARD_SEQ");
            Integer boardSeq = boardSeqDecimal != null ? boardSeqDecimal.intValue() : null;
            List<String> images = imageMap.getOrDefault(boardSeq, new ArrayList<>());
            boardData.put("images", images);
        }

        return ResponseEntity.ok(list);
    }
    
    // 커뮤니티 디테일
    @GetMapping("/{board_seq}")
    public ResponseEntity<Map<String, Object>> selectAllSeq(@PathVariable int board_seq) {
    	Map<String, Object> boardDetail = communityServ.selectAllSeq(board_seq);
        return ResponseEntity.ok(boardDetail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body("fail");
    }
}

