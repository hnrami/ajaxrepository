package com.example.demo.controller;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.transfer.Download;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

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
            TransferManager tm = TransferManagerBuilder.standard()
                                                       .withS3Client(s3Client)
                                                       .build();
            boolean isComplete = false;
            try {
                // Attempt multipart download
                Download download = tm.download(bucketName, key, new OutputStream() {
                    @Override
                    public void write(int b) {
                        try {
                            outputStream.write(b);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }

                    @Override
                    public void write(byte[] b) {
                        try {
                            outputStream.write(b);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }

                    @Override
                    public void write(byte[] b, int off, int len) {
                        try {
                            outputStream.write(b, off, len);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });
                download.waitForCompletion();
                isComplete = true;
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (!isComplete) {
                // If multipart download fails, attempt resumable download
                long downloadedLength = 0;
                long fileSize = s3Client.getObjectMetadata(bucketName, key).getContentLength();
                try {
                    while (downloadedLength < fileSize) {
                        long endRange = Math.min(downloadedLength + 5 * 1024 * 1024 - 1, fileSize - 1); // 5MB chunks
                        GetObjectRequest rangeObjectRequest = new GetObjectRequest(bucketName, key)
                                                              .withRange(downloadedLength, endRange);
                        S3Object objectPortion = s3Client.getObject(rangeObjectRequest);
                        InputStream is = objectPortion.getObjectContent();
                        byte[] buffer = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = is.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                        downloadedLength += endRange - downloadedLength + 1;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };

        return ResponseEntity.ok()
                             .contentType(MediaType.APPLICATION_OCTET_STREAM)
                             .body(responseBody);
    }
}
