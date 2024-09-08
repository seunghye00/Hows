package com.hows.common;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class GCSFile {

    @Autowired
    private Storage storage;

    @Value("${gcp.bucket}")
    private String bucket;

    public  GCSFile(Storage storage) {
        this.storage = storage;
    }

    /** GCS 파일 서버에 파일 및 이미지 업로드 **/
    public String addFileGcs (MultipartFile file, String sysName, String type) {
        try{
            BlobId blobId = BlobId.of(bucket, sysName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            Blob blob = storage.create(blobInfo, file.getBytes());
            if(blob != null) return "https://storage.google.com/" + bucket + "/" + type + "/" + sysName;
            return "fail";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    /** GCS 파일 서버에 파일 및 이미지 삭제 **/
    public String deleteFileGcs (String sysName) {
        try {
            BlobId blobId = BlobId.of(bucket, sysName);
            boolean result = storage.delete(blobId);
            if(result) return "ok";
            return "fail";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

}
