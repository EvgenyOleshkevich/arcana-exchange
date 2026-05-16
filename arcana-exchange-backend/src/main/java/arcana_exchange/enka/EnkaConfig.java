package arcana_exchange.enka;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class EnkaConfig {

    @Bean
    public RestClient enkaRestClient() {
        return RestClient.builder()
                .baseUrl("https://enka.network/api")
                .build();
    }
}
