package com.hows.banner.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hows.banner.domain.entity.Banner;

public interface BannerRepository extends JpaRepository<Banner, Long>{

}
