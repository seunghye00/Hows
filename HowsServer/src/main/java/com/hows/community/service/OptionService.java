package com.hows.community.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.community.dao.AreaSizeDAO;
import com.hows.community.dao.ColorDAO;
import com.hows.community.dao.HousingTypeDAO;
import com.hows.community.dao.SpaceTypeDAO;
import com.hows.community.dto.AreaSizeDTO;
import com.hows.community.dto.ColorDTO;
import com.hows.community.dto.HousingTypeDTO;
import com.hows.community.dto.SpaceTypeDTO;

@Service
public class OptionService {
	 @Autowired
    private HousingTypeDAO housingTypeDAO;

    @Autowired
    private SpaceTypeDAO spaceTypeDAO;

    @Autowired
    private ColorDAO colorDAO;
    
    @Autowired
    private AreaSizeDAO areaSizeDAO;
    
    public List<HousingTypeDTO> getHousingTypes() {
        return housingTypeDAO.getHousingTypes();
    }

    public List<SpaceTypeDTO> getSpaceTypes() {
        return spaceTypeDAO.getSpaceTypes();
    }

    public List<ColorDTO> getColors() {
        return colorDAO.getColors();
    }
    
    public List<AreaSizeDTO> getAreaSize() {
        return areaSizeDAO.getAreaSize();
    }
}
