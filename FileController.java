import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadFile(@RequestHeader HttpHeaders headers) throws IOException {
        URL url = new URL("http://example.com/largefile.zip");
        InputStream inputStream = url.openStream();
        long fileLength = url.openConnection().getContentLengthLong();

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
        responseHeaders.set(HttpHeaders.ACCEPT_RANGES, "bytes");

        List<HttpRange> ranges = headers.getRange();
        if (ranges != null && !ranges.isEmpty()) {
            HttpRange range = ranges.get(0);
            long start = range.getRangeStart(fileLength);
            long end = range.getRangeEnd(fileLength);

            if (start >= fileLength || end >= fileLength) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).body(null);
            }

            inputStream.skip(start);
            long chunkSize = end - start + 1;
            InputStreamResource resource = new InputStreamResource(inputStream) {
                @Override
                public long contentLength() {
                    return chunkSize;
                }

                @Override
                public InputStream getInputStream() throws IOException {
                    return StreamUtils.copyRange(inputStream, start, end);
                }
            };

            responseHeaders.set(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileLength);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .headers(responseHeaders)
                    .body(resource);
        } else {
            responseHeaders.set(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileLength));
            return ResponseEntity.ok()
                    .headers(responseHeaders)
                    .body(new InputStreamResource(inputStream));
        }
    }
}
