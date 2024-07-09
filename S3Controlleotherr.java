import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class S3Controller {

    @Autowired
    private S3Service s3Service;

    @GetMapping("/download")
    public ResponseEntity<StreamingResponseBody> downloadFile(@RequestParam String bucketName, 
                                                              @RequestParam String objectKey,
                                                              @RequestParam int expirationInMinutes) {
        URL presignedUrl = s3Service.generatePresignedUrl(bucketName, objectKey, expirationInMinutes);

        StreamingResponseBody responseBody = outputStream -> {
            HttpURLConnection connection = (HttpURLConnection) presignedUrl.openConnection();
            connection.setRequestMethod("GET");

            try (InputStream inputStream = connection.getInputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            } finally {
                connection.disconnect();
            }
        };

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + objectKey + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(responseBody);
    }
}
