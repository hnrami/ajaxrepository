// Read the response from the API
try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
    String line;
    StringBuilder response = new StringBuilder();
    while ((line = reader.readLine()) != null) {
        response.append(line);
    }
    
    // Convert JSON response to Java object using Jackson
    ObjectMapper objectMapper = new ObjectMapper();
    AuthResponse authResponse = objectMapper.readValue(response.toString(), AuthResponse.class);

    System.out.println("Response Code: " + responseCode);
    System.out.println("Token: " + authResponse.getToken());
}
public class AuthResponse {
    private String token;

    // Getter and Setter methods
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
