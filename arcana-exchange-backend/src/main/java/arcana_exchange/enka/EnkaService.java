package arcana_exchange.enka;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class EnkaService {

    private final RestClient enkaRestClient;

    public PlayerInfoResponse getPlayerInfo(long uid) {
        try {
            return enkaRestClient.get()
                    .uri("/uid/{uid}?info", uid)
                    .retrieve()
                    .body(PlayerInfoResponse.class);

        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("Player not found");
        }
    }
}