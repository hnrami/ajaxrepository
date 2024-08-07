package com.example.demo.controller;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

@RestController
@RequestMapping("/api")
public class FileDownloadController {

    private final AmazonS3 s3Client;

    public FileDownloadController() {
        ClientConfiguration clientConfig = new ClientConfiguration();
        clientConfig.setConnectionTimeout(60000); // 60 seconds
        clientConfig.setSocketTimeout(600000); // 10 minutes
        clientConfig.setMaxErrorRetry(5); // Retry up to 5 times

        this.s3Client = AmazonS3ClientBuilder.standard()
                                             .withClientConfiguration(clientConfig)
                                             .build();
    }

    @GetMapping("/download")
    public ResponseEntity<StreamingResponseBody> downloadFile(@RequestParam String bucketName, @RequestParam String key) {
        StreamingResponseBody responseBody = outputStream -> {
            long downloadedLength = 0;
            long fileSize = s3Client.getObjectMetadata(bucketName, key).getContentLength();
            byte[] buffer = new byte[8192];
            int maxRetries = 3;
            int retryCount = 0;

            while (downloadedLength < fileSize) {
                boolean success = false;
                while (!success && retryCount < maxRetries) {
                    try {
                        long endRange = Math.min(downloadedLength + 5 * 1024 * 1024 - 1, fileSize - 1); // 5MB chunks
                        GetObjectRequest rangeObjectRequest = new GetObjectRequest(bucketName, key)
                                                              .withRange(downloadedLength, endRange);
                        S3Object objectPortion = s3Client.getObject(rangeObjectRequest);
                        try (InputStream is = objectPortion.getObjectContent()) {
                            int bytesRead;
                            while ((bytesRead = is.read(buffer)) != -1) {
                                outputStream.write(buffer, 0, bytesRead);
                                outputStream.flush(); // Ensure the data is sent to the client immediately
                            }
                            success = true;
                        }
                        downloadedLength = endRange + 1;
                    } catch (IOException e) {
                        retryCount++;
                        if (retryCount >= maxRetries) {
                            throw new IOException("Failed to download file after " + maxRetries + " attempts", e);
                        }
                        e.printStackTrace();
                    }
                }
                retryCount = 0; // Reset retry count for the next chunk
            }
        };

        return ResponseEntity.ok()
                             .contentType(MediaType.APPLICATION_OCTET_STREAM)
                             .body(responseBody);
    }
}
