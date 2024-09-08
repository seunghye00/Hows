package com.hows.File.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.hows.File.dao.FileDAO;
import com.hows.File.dto.FileDTO;
import com.hows.common.GCSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class FileService {

    @Autowired
    private FileDAO fileDAO;

    @Autowired
    private Storage storage;

    @Autowired
    private GCSFile gcsFile;

    @Value("${gcp.bucket}")
    private String bucket;

    public FileService(Storage storage) {
        this.storage = storage;
    }

    /** 파일 업로드 **/
    public String upload(MultipartFile file, int parentSeq) {
        String result = "fail";
        try{
            String oriName = file.getOriginalFilename();
            String sysName = UUID.randomUUID().toString();

            // F1: 프로필(멤버), F2: 커뮤니티, F3: 상품, F4: 리뷰, F5: 배너
            // 각자 컨트롤러에 맞는 code 고정하고 사용
            String code = "F1";

            // 1. 이미지 gcs 서버에 업로드
            result = gcsFile.addFileGcs(file, sysName, code);
            
            // 2. 이미지 업로드 성공
            if(!result.equals("fail")) {
                
                // 3. 이미지 File 테이블에 저장
                int value = fileDAO.upload(new FileDTO(0, code, oriName, sysName, parentSeq));
                
                // 4. 태이블에 저장 실패 시 gcs 서버에서 이미지 삭제
                if(value <= 0) {
                    gcsFile.deleteFileGcs(sysName);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    /** 파일 삭제 **/
    public String deleteFile(String sysName) {
        String result = "fail";
        try {
            result = gcsFile.deleteFileGcs(sysName);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }


}
