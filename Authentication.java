import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
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

            CloseableHttpClient httpClient = HttpClients.createDefault();

            // Authenticate
            HttpPost httpPost = new HttpPost(authnEndpoint);
            httpPost.setHeader("Content-Type", "application/json");

            Map<String, Object> authBody = new HashMap<>();
            authBody.put("username", System.getenv("user"));
            authBody.put("password", System.getenv("password"));
            authBody.put("options", new HashMap<String, Object>() {{
                put("multiOptionalFactorEnroll", false);
                put("warnBeforePasswordExpired", false);
            }});
            authBody.put("context", new HashMap<String, Object>());

            StringEntity entity = new StringEntity(objectMapper.writeValueAsString(authBody));
            httpPost.setEntity(entity);

            HttpResponse response = httpClient.execute(httpPost);

            HttpEntity responseEntity = response.getEntity();
            String responseString = EntityUtils.toString(responseEntity);

            Arrays.stream(response.getAllHeaders()).forEach(header -> {
                if (header.getName().equals("Set-Cookie")) {
                    jsessionId = Arrays.stream(header.getElements())
                            .filter(element -> element.getName().equals("JSESSIONID"))
                            .findFirst()
                            .map(element -> element.getValue())
                            .orElse(null);
                }
            });

            // Obtain session token
            JsonNode sessionTokenNode = objectMapper.readTree(responseString).get("sessionToken");
            String sessionToken = sessionTokenNode != null ? sessionTokenNode.asText() : null;

            // Generate state and nonce
            SecureRandom random = new SecureRandom();
            byte[] stateBytes = new byte[10];
            random.nextBytes(stateBytes);
            byte[] nonceBytes = new byte[10];
            random.nextBytes(nonceBytes);

            String state = Base64.encodeBase64URLSafeString(stateBytes);
            String nonce = Base64.encodeBase64URLSafeString(nonceBytes);

            // Perform GET request to obtain id token
            String authorizeUrl = authServerAuthorizeEndpoint + "?response_type=id_token";
            HttpGet httpGet = new HttpGet(authorizeUrl);
            httpGet.setHeader("Cookie", jsessionId);

            response = httpClient.execute(httpGet);
            responseEntity = response.getEntity();
            responseString = EntityUtils.toString(responseEntity);

            String idToken = null;
            String decodedToken = null;

            if (responseString != null) {
                String[] hashValue = responseString.split("#id_token=");
                if (hashValue.length > 1) {
                    idToken = hashValue[1].split("&")[0];
                    byte[] idTokenBytes = Base64.decodeBase64(idToken);
                    decodedToken = new String(idTokenBytes, StandardCharsets.UTF_8);
                }
            }

            Map<String, String> result = new HashMap<>();
            result.put("token", idToken);
            result.put("decodedToken", decodedToken);

            return result;
        } catch (Exception e) {
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
