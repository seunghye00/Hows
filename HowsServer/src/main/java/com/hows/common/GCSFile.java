package com.hows.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

@Component
public class GCSFile {

	private static final Logger logger = LoggerFactory.getLogger(GCSFile.class);
    
	@Autowired
    private Storage storage;

    @Value("${gcp.bucket}")
    private String bucket;

    public  GCSFile(Storage storage) {
        this.storage = storage;
    }

    /** GCS 파일 서버에 파일 및 이미지 업로드 **/
    public String addFileGcs (MultipartFile file, String sysName, String code) {
        try{
            BlobId blobId = BlobId.of(bucket, code + "/" + sysName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            Blob blob = storage.create(blobInfo, file.getBytes());
            if(blob != null) return "https://storage.cloud.google.com/" + bucket + "/" + code + "/" + sysName;
            return "fail";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    /** GCS 파일 서버에 파일 및 이미지 삭제 **/
    public String deleteFileGcs(String sysName, String code) {
        BlobId blobId = BlobId.of(bucket, code + "/" + sysName);
        try {
            // 파일 객체를 가져옴
            Blob blob = storage.get(blobId);

            if (blob == null) {
                logger.warn("파일이 존재하지 않습니다: " + blobId.toString());
                return "fail";
            }
            
            boolean result = storage.delete(blobId);

            if (result) {
                return "ok";
            } else {
                logger.warn("파일 삭제 실패: 파일이 존재하지 않거나 다른 이유로 실패, BlobId: " + blobId.toString());
                return "fail";
            }
        } catch (Exception e) {
            logger.error("파일 삭제 실패: " + sysName + ", 코드: " + code, e);
            return "fail";
        }
    }


}
