package template.api_config;
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;

import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.requests.UserCollectionPage;

import java.util.Arrays;
import java.util.List;

public class GraphAPIExample {
    public static void main(String[] args) {
        // Các thông tin xác thực của ứng dụng
        String clientId = "a506c658-958d-44f8-b126-623de3fe380a";
        String clientSecret = "6d.8Q~haI6mlavO.36bZTR2_hhKCncOGwJboTbYD";
        String tenant = "f8cdef31-a31e-4b4a-93e4-5f571e91255a";

        // Danh sách các phạm vi mà ứng dụng của bạn muốn yêu cầu khi thực hiện xác thực OAuth 2.0
        List<String> scopes = Arrays.asList(".default");

        // Xây dựng đối tượng ClientSecretCredential để thực hiện xác thực OAuth 2.0
        ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
                .clientId(clientId)
                .clientSecret(clientSecret)
                .tenantId(tenant)
                .build();

        // Xây dựng đối tượng TokenCredentialAuthProvider để cung cấp xác thực cho Microsoft Graph SDK
        TokenCredentialAuthProvider tokenCredentialAuthProvider = new TokenCredentialAuthProvider(scopes, clientSecretCredential);

        // Xây dựng đối tượng GraphServiceClient để truy vấn Microsoft Graph API
        GraphServiceClient graphClient = GraphServiceClient.builder()
                .authenticationProvider(tokenCredentialAuthProvider)
                .buildClient();


        // Lấy thông tin về người dùng hiện tại
        User me = graphClient.me().buildRequest().get();
        /*
        // In ra tên và địa chỉ email của người dùng hiện tại
        System.out.println("User name: " + me.displayName);
        System.out.println("User email: " + me.mail); */
        /*UserCollectionPage users = graphClient.users()
                .buildRequest()
                .get();
        */

    }
}