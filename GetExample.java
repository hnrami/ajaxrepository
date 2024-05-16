import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

public class GetExample {

    public static void main(String[] args) throws IOException {
        // API endpoint URL
        String apiUrl = "https://example.com/api/resource";
        
        // Request parameters
        String param1 = "value1";
        String param2 = "value2";
        // Add more parameters as needed
        
        // Construct the URL with parameters
        String urlWithParams = apiUrl + "?param1=" + URLEncoder.encode(param1, "UTF-8") +
                "&param2=" + URLEncoder.encode(param2, "UTF-8");
        // Encode parameters to handle special characters
        
        // Create a URL object from the constructed URL
        URL url = new URL(urlWithParams);

        // Open a connection to the URL
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // Set the request method to GET
        connection.setRequestMethod("GET");

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
