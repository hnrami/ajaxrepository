import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.io.InputStream;

@RestController
public class S3Controller {

    @GetMapping("/download/{bucket}/{key}")
    public ResponseEntity<StreamingResponseBody> downloadFile(
            @PathVariable String bucket,
            @PathVariable String key) {

        S3Client s3Client = S3Client.builder()
                .region(Region.US_WEST_2) // Specify your region
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        ResponseBytes<InputStream> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
        InputStream objectData = objectBytes.asInputStream();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", key);

        StreamingResponseBody responseBody = outputStream -> {
            try {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = objectData.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                objectData.close();
            } catch (IOException e) {
                throw new RuntimeException("Failed to read S3 object stream", e);
            }
        };

        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }
}
