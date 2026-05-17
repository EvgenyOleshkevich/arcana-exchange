package arcana_exchange.card.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class HoyolabCardsResponse {
    private DataJson data;

    @Data
    public static class DataJson {
        @JsonProperty("tarot_card_state")
        private TarotCardState tarotCardState;
    }

    @Data
    public static class TarotCardState {
        private List<TarotCard> list;
    }

    @Data
    public static class TarotCard {
        private String icon;
        private String name;

        @JsonProperty("is_unlock")
        private boolean unlocked;

        @JsonProperty("unlock_num")
        private int unlockNum;
    }
}
