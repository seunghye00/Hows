package com.hows.common;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hows.banner.dto.BannerDTO;
import com.hows.banner.service.BannerService;

@Component
public class Scheduler {
	
	@Autowired
	private BannerService bannServ;

	// 매일 자정 0시에 실행
	@Scheduled(cron = "0 0 0 * * ?")
	public void checkAllBanner() {
		// 해당 날짜
		LocalDate today = LocalDate.now();
		// 배너 목록 조회
		List<BannerDTO> list = bannServ.getAllBannersByAdmin();
		// 배너 순서를 저장할 map 생성
		Map<Integer, Integer> orders = new HashMap<>();
		int bannerOrder = 1;
		
		System.out.println("스케쥴러 실행");
		
		for(BannerDTO dto : list) {
			Date startDate = dto.getStart_date();
			Date endDate = dto.getEnd_date();
			
			// java.sql.Date를 LocalDate로 변환
            LocalDate startLocalDate = startDate.toLocalDate();
            LocalDate endLocalDate = endDate.toLocalDate();
			
            // 배너가 해당 날짜에 노출되어야 한다면 순서 지정
            if ((startLocalDate.isBefore(today) || startLocalDate.isEqual(today)) && 
            	    (endLocalDate.isAfter(today) || endLocalDate.isEqual(today))) {
                orders.put(dto.getBanner_seq(), bannerOrder++);
            } else {
            	orders.put(dto.getBanner_seq(), 0);
            }
		}
		// entrySet()을 사용하여 Map의 모든 엔트리를 반복해서 배너 순서 업데이트
        for (Map.Entry<Integer, Integer> order : orders.entrySet()) {
            bannServ.updateOrder(order.getKey(), order.getValue());
        }
	}
}
