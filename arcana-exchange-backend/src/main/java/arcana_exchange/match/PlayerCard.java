package arcana_exchange.match;

import arcana_exchange.card.Card;
import arcana_exchange.player.Player;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "player_cards")@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerCard {
    @EmbeddedId
    private PlayerCardId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("playerId")
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cardId")
    @JoinColumn(name = "card_id")
    private Card card;

    private int quantity;
}
