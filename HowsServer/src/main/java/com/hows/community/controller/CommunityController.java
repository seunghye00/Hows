package com.hows.community.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.community.dto.CommunityDTO;
import com.hows.community.dto.ImageDTO;
import com.hows.community.dto.TagDTO;
import com.hows.community.service.CommunityService;


@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    private CommunityService communityService;

    // 게시글 저장
    @PostMapping
    public ResponseEntity<Void> insertWrite(@RequestBody CommunityDTO dto) {
        // 게시글 정보 출력
        System.out.println("게시글 내용: " + dto.getBoard_contents());
        System.out.println("주거 형태 코드: " + dto.getHousing_type_code());
        System.out.println("공간 타입 코드: " + dto.getSpace_type_code());
        System.out.println("평수 코드: " + dto.getArea_size_code());
        System.out.println("멤버 ID: " + dto.getMember_id());

        // 이미지 정보 출력
        List<ImageDTO> images = dto.getImages();
        if (images != null) {
            for (ImageDTO image : images) {
                System.out.println("이미지 URL: " + image.getImage_url());
                System.out.println("이미지 순서: " + image.getImage_order());

                // 태그 정보 출력
                List<TagDTO> tags = image.getTags();
                if (tags != null) {
                    for (TagDTO tag : tags) {
                        System.out.println("상품 번호: " + tag.getProduct_seq());
                        System.out.println("태그 위치 (Left): " + tag.getLeft_position());
                        System.out.println("태그 위치 (Top): " + tag.getTop_position());
                    }
                }
            }
        }

        // 실제 DB 삽입 로직
        int board_seq = communityService.insertWrite(dto);
        // 삽입 후 시퀀스 값가져오기
        System.out.println(board_seq + "현재 시퀀스 값");
        return ResponseEntity.ok().build();
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception e) {
       e.printStackTrace();
       return ResponseEntity.badRequest().body("fail");
    }
}
