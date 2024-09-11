package com.hows.community.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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

    // 게시글 및 이미지/태그 저장 (트랜잭션 적용)
    @PostMapping("/write-with-images")
    @Transactional // 트랜잭션 적용
    public ResponseEntity<Void> insertWriteWithImages(
        @RequestParam("housing_type_code") String housingTypeCode,
        @RequestParam("space_type_code") String spaceTypeCode,
        @RequestParam("area_size_code") String areaSizeCode,
        @RequestParam("board_contents") String boardContents,
        @RequestParam("member_id") String memberId,
        @RequestPart("files") MultipartFile[] files,  // FormData에서 여러 이미지 파일을 받음
        @RequestParam("image_orders") int[] imageOrders,  // 이미지 순서를 배열로 받음
        @RequestParam("tags") String[] tagsJson  // 태그 데이터를 JSON 문자열 배열로 받음
    ) {
        try {
            // 1. CommunityDTO 객체 생성 및 게시글 저장
            CommunityDTO dto = new CommunityDTO();
            dto.setHousing_type_code(housingTypeCode);
            dto.setSpace_type_code(spaceTypeCode);
            dto.setArea_size_code(areaSizeCode);
            dto.setBoard_contents(boardContents);
            dto.setMember_id(memberId);
            
            int boardSeq = communityServ.insertWrite(dto); // 게시글 저장
            System.out.println(boardSeq + " 게시글 시퀀스");

            // 2. 이미지 및 태그 저장 로직
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                int imageOrder = imageOrders[i];
                String tags = tagsJson[i];

                // 이미지 업로드
                String code = "F2"; 
                String uploadResult = fileServ.upload(file, boardSeq, code); 
                System.out.println(uploadResult + " 업로드 결과 확인");

                if (!uploadResult.equals("fail")) {
                    // 이미지 DB 저장
                    ImageDTO imageDTO = new ImageDTO();
                    imageDTO.setBoard_seq(boardSeq);
                    imageDTO.setImage_url(uploadResult);
                    imageDTO.setImage_order(imageOrder);
                    int boardImageSeq = communityServ.insertImage(imageDTO);

                    // 태그 데이터 처리
                    List<TagDTO> tagsList = parseTagsFromJson(tags, boardImageSeq);
                    if (tagsList != null && !tagsList.isEmpty()) {
                        for (TagDTO tag : tagsList) {
                            tag.setBoard_image_seq(boardImageSeq);
                            communityServ.insertTag(tag);
                        }
                    }
                } else {
                    throw new IOException("이미지 업로드 실패");
                }
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("게시글 작성 또는 이미지 업로드 실패", e);
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
    
    @GetMapping("/images/{board_seq}")
    public ResponseEntity<Map<String, Object>> selectImagesAndTags(@PathVariable int board_seq) {
        List<Map<String, Object>> images = communityServ.selectImages(board_seq);
        List<Map<String, Object>> tags = communityServ.selectTagsAndProductInfo(board_seq);

        // 이미지와 태그 데이터를 하나의 맵으로 합침
        Map<String, Object> result = new HashMap<>();
        result.put("images", images);
        result.put("tags", tags);

        return ResponseEntity.ok(result);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body("fail");
    }
}

