import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

public class Authentication {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static String jsessionId;

    public static Map<String, String> fetchToken(String username, String password) {
        try {
            String authnEndpoint = System.getenv("AUTHN");
            String authServerAuthorizeEndpoint = System.getenv("AUTH_SERVER");

            if (username != null) {
                System.getenv().put("user", username);
            }
            if (password != null) {
                System.getenv().put("password", password);
            }

            // Authenticate
            URL url = new URL(authnEndpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            Map<String, Object> authBody = new HashMap<>();
            authBody.put("username", System.getenv("user"));
            authBody.put("password", System.getenv("password"));
            authBody.put("options", new HashMap<String, Object>() {{
                put("multiOptionalFactorEnroll", false);
                put("warnBeforePasswordExpired", false);
            }});
            authBody.put("context", new HashMap<String, Object>());

            OutputStream outputStream = connection.getOutputStream();
            objectMapper.writeValue(outputStream, authBody);
            outputStream.flush();

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String responseString = reader.readLine();
                JsonNode sessionTokenNode = objectMapper.readTree(responseString).get("sessionToken");
                String sessionToken = sessionTokenNode != null ? sessionTokenNode.asText() : null;
                jsessionId = connection.getHeaderField("Set-Cookie");

                // Generate state and nonce
                SecureRandom random = new SecureRandom();
                byte[] stateBytes = new byte[10];
                random.nextBytes(stateBytes);
                byte[] nonceBytes = new byte[10];
                random.nextBytes(nonceBytes);

                String state = Base64.encodeBase64URLSafeString(stateBytes);
                String nonce = Base64.encodeBase64URLSafeString(nonceBytes);

                // Perform GET request to obtain id token
                url = new URL(authServerAuthorizeEndpoint + "?response_type=id_token");
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("Cookie", jsessionId);

                responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    responseString = reader.readLine();
                    String idToken = responseString.split("#id_token=")[1].split("&")[0];
                    byte[] idTokenBytes = Base64.decodeBase64(idToken);
                    String decodedToken = new String(idTokenBytes, StandardCharsets.UTF_8);

                    Map<String, String> result = new HashMap<>();
                    result.put("token", idToken);
                    result.put("decodedToken", decodedToken);
                    return result;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void main(String[] args) {
        Map<String, String> tokenInfo = fetchToken(null, null);
        if (tokenInfo != null) {
            System.out.println("Token: " + tokenInfo.get("token"));
            System.out.println("Decoded Token: " + tokenInfo.get("decodedToken"));
        } else {
            System.out.println("Token retrieval failed.");
        }
    }
}
