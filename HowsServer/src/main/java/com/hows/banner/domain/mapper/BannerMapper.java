package com.hows.banner.domain.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.hows.banner.domain.entity.Banner;
import com.hows.banner.dto.BannerDTO;

@Mapper(componentModel = "spring")
public interface BannerMapper {
	Banner toEntity(BannerDTO dto);
	BannerDTO toDTO(Banner banner);
	
	List<BannerDTO> toDTOList(List<Banner> list);
	List<Banner> toEntityList(List<BannerDTO> list);
}
