package com.hows.File.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.hows.File.dao.FileDAO;
import com.hows.File.dto.FileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class FileService {

    @Autowired
    private FileDAO fileDAO;

    @Autowired
    private Storage storage;

    public FileService(Storage storage) {
        this.storage = storage;
    }

    /** 파일 업로드 **/
    public String upload(MultipartFile file, String code, int parentSeq) {
        String result = "fail";

        try{
            String bucketName = "sion-attachment";
            String oriName = file.getOriginalFilename();
            String sysName = UUID.randomUUID().toString();

            int value = fileDAO.upload(new FileDTO(0, code, oriName, sysName, parentSeq));
            if(value > 0) {
                BlobId blobId = BlobId.of(bucketName, sysName);
                BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
                Blob blob = storage.create(blobInfo, file.getBytes());
                if (blob != null) result = "https://storage.google.com/" + bucketName + "/" + sysName;
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
            String bucketName = "sion-attachment";
            BlobId blobId = BlobId.of(bucketName, sysName);
            boolean del = storage.delete(blobId);
            if(del)  {
                fileDAO.deleteFile(sysName);
                result = "ok";
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }


}
