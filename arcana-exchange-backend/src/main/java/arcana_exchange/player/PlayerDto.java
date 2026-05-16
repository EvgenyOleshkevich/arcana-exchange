package arcana_exchange.player;

import arcana_exchange.card.DTO.PlayerCardDto;
import arcana_exchange.utils.enums.Server;

import java.time.Instant;
import java.util.List;

public record PlayerDto(
        long playerId,
        String name,
        String avatarPath,
        Server server,
        int countCards,
        Instant profileUpdatedAt,
        Instant cardsUpdatedAt,
        List<PlayerCardDto> cards
) {
}