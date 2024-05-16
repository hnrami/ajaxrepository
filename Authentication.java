import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
            URL authUrl = new URL(authnEndpoint);
            HttpURLConnection authConnection = (HttpURLConnection) authUrl.openConnection();
            authConnection.setRequestMethod("POST");
            authConnection.setRequestProperty("Content-Type", "application/json");
            authConnection.setDoOutput(true);

            Map<String, Object> authBody = new HashMap<>();
            authBody.put("username", System.getenv("user"));
            authBody.put("password", System.getenv("password"));
            authBody.put("options", new HashMap<String, Object>() {{
                put("multiOptionalFactorEnroll", false);
                put("warnBeforePasswordExpired", false);
            }});
            authBody.put("context", new HashMap<String, Object>());

            objectMapper.writeValue(authConnection.getOutputStream(), authBody);

            BufferedReader authReader = new BufferedReader(new InputStreamReader(authConnection.getInputStream()));
            String authResponseString = authReader.readLine();
            String sessionToken = objectMapper.readTree(authResponseString).get("sessionToken").asText();
            jsessionId = authConnection.getHeaderField("Set-Cookie");

            // Generate state and nonce
            SecureRandom random = new SecureRandom();
            byte[] stateBytes = new byte[10];
            random.nextBytes(stateBytes);
            byte[] nonceBytes = new byte[10];
            random.nextBytes(nonceBytes);

            String state = Base64.encodeBase64URLSafeString(stateBytes);
            String nonce = Base64.encodeBase64URLSafeString(nonceBytes);

            // Perform GET request to obtain id token
            URL authorizeUrl = new URL(authServerAuthorizeEndpoint + "?response_type=id_token");
            HttpURLConnection authorizeConnection = (HttpURLConnection) authorizeUrl.openConnection();
            authorizeConnection.setRequestMethod("GET");
            authorizeConnection.setRequestProperty("Cookie", jsessionId);

            BufferedReader authorizeReader = new BufferedReader(new InputStreamReader(authorizeConnection.getInputStream()));
            String authorizeResponseString = authorizeReader.readLine();

            String idToken = null;
            String decodedToken = null;

            String[] hashValue = authorizeResponseString.split("#id_token=");
            if (hashValue.length > 1) {
                idToken = hashValue[1].split("&")[0];
                byte[] idTokenBytes = Base64.decodeBase64(idToken);
                decodedToken = new String(idTokenBytes, StandardCharsets.UTF_8);
            }

            Map<String, String> result = new HashMap<>();
            result.put("token", idToken);
            result.put("decodedToken", decodedToken);

            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
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
