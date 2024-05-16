import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class PostExample {

    public static void main(String[] args) throws IOException {
        // API endpoint URL
        String apiUrl = "https://example.com/api/login";
        
        // JSON payload
        String jsonInputString = "{\"username\": \"your_username\", \"password\": \"your_password\"}";

        // Create a URL object from the API endpoint
        URL url = new URL(apiUrl);

        // Open a connection to the URL
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // Set the request method to POST
        connection.setRequestMethod("POST");

        // Set the request headers
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");

        // Enable output and set the content length
        connection.setDoOutput(true);
        connection.setFixedLengthStreamingMode(jsonInputString.getBytes().length);

        // Write the JSON payload to the connection's output stream
        try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
            outputStream.writeBytes(jsonInputString);
            outputStream.flush();
        }

        // Get the response code
        int responseCode = connection.getResponseCode();

        // Read the response from the API
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            String line;
            StringBuilder response = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            System.out.println("Response Code: " + responseCode);
            System.out.println("Response Message: " + response.toString());
        }

        // Close the connection
        connection.disconnect();
    }
}
