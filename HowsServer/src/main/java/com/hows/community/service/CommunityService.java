package com.hows.community.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.community.dao.CommunityDAO;
import com.hows.community.dto.CommunityDTO;

@Service
public class CommunityService {
    @Autowired
    private CommunityDAO communityDAO;
    
    public void insertWrite(CommunityDTO dto) {
    	communityDAO.insertWrite(dto);
    }
}
