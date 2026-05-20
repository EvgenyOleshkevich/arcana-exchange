package arcana_exchange.enka;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EnkaService {
    @Value("${app.url}")
    private String appUrl;

    @Value("${app.github}")
    private String githubUrl;

    private final RestClient enkaRestClient;

    public PlayerInfoResponse getPlayerInfo(long uid) {
        try {
            return enkaRestClient.get()
                    .uri("/uid/{uid}?info", uid)
                    .header(HttpHeaders.USER_AGENT,
                            "arcana-exchange (" + githubUrl + ")")
                    .header(HttpHeaders.REFERER, appUrl)
                    .retrieve()
                    .body(PlayerInfoResponse.class);

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new RuntimeException("Player not found");
            }

            if (e.getStatusCode().value() == 424) {
                throw new RuntimeException(
                        "Enka servers are temporarily unavailable"
                );
            }

            throw e;
        }
    }
}