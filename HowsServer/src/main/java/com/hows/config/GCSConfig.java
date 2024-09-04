package com.hows.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;

@Configuration
public class GCSConfig {

    @Value("${gcp.credentials.location}")
    private Resource credentialsLocation;

    @Value("${gcp.project.id}")
    private String projectId;

    @Bean
    public Storage storage() throws IOException {
        GoogleCredentials cred= GoogleCredentials.fromStream(credentialsLocation.getInputStream());
        return StorageOptions.newBuilder().setCredentials(cred).setProjectId(projectId).build().getService();
    }

}
