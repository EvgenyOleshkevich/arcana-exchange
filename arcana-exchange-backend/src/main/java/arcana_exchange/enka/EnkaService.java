package arcana_exchange.enka;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
        }
    }
}