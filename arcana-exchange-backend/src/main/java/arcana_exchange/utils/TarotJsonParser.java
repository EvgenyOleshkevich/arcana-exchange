package arcana_exchange.utils;

import arcana_exchange.card.DTO.HoyolabCardsResponse;
import arcana_exchange.card.DTO.ParsedCard;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarotJsonParser {
    private final ObjectMapper objectMapper;

    public List<ParsedCard> parse(String json) {
        try {
            HoyolabCardsResponse response =
                    objectMapper.readValue(json, HoyolabCardsResponse.class);

            if (response.getData() == null
                    || response.getData().getTarotCardState() == null
                    || response.getData().getTarotCardState().getList() == null) {
                return List.of();
            }

            return response.getData()
                    .getTarotCardState()
                    .getList()
                    .stream()
                    .filter(HoyolabCardsResponse.TarotCard::isUnlocked)
                    .map(card -> new ParsedCard(
                            card.getName(),
                            card.getUnlockNum(),
                            extractImageCode(card.getIcon())
                    ))
                    .filter(card -> card.quantity() != 0)
                    .toList();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Invalid HoYoLAB JSON", e);
        }
    }

    private String extractImageCode(String imageUrl) {

        return imageUrl.substring(
                imageUrl.lastIndexOf("/") + 1,
                imageUrl.lastIndexOf(".")
        );
    }
}