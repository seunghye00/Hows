package com.hows.banner.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.hows.banner.dao.BannerDAO;
import com.hows.banner.domain.entity.Banner;
import com.hows.banner.domain.mapper.BannerMapper;
import com.hows.banner.domain.repository.BannerRepository;
import com.hows.banner.dto.BannerDTO;

@Service
public class BannerService {

	@Autowired
	private BannerRepository bannRepo;

	@Autowired
	private BannerMapper bannMap;
	
	@Autowired
	private BannerDAO bannDAO;
	
	@Autowired
	private Storage storage;
	
    @Value("${gcp.bucket}")
    private String bucket;

	public List<BannerDTO> getAllBanners() {
		return bannDAO.getAllBanners();
	}

	public boolean addBanner(MultipartFile file) {
		try {
			String sysName = UUID.randomUUID().toString();
			String contentType = file.getContentType();

			// 업로드 하기 위한 정보 객체 생성
			BlobId blobId = BlobId.of(bucket, sysName);
			BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
			// 실제 GCS에 업로드 하는 코드
			Blob blob = storage.create(blobInfo, file.getBytes());
			if (blob == null) {
				return false;
			}
			String result = "https://storage.google.com/" + bucket + "/" + sysName;
			// Banner banner = bannMap.toEntity(new BannerDTO(0L, sysName, result, null, null, 0));
			// bannRepo.save(banner);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean deleteBanner(String[] bannerNames) {
		// 삭제 도중 실패 시 처리 방법 추후 수정
		try {
			for(String sysName : bannerNames) {
				// 삭제하기 위한 정보 객체 생성
				BlobId blobId = BlobId.of(bucket, sysName);
				// 파일 삭제
		        boolean result1 = storage.delete(blobId);
		        bannDAO.deleteBySysName(sysName);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
}
