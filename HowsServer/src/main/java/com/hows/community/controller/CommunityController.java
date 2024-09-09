package com.hows.community.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.community.dto.CommunityDTO;
import com.hows.community.service.CommunityService;


@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    private CommunityService communityService;

    // 게시글 저장
    @PostMapping
    public ResponseEntity<Void> insertPost(@RequestBody CommunityDTO dto) {
    	//communityService.insertWrite(dto);
    	return ResponseEntity.ok().build();
    }
}
