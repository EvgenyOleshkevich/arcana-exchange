package arcana_exchange.player;

import arcana_exchange.card.DTO.PlayerCardDto;
import arcana_exchange.utils.enums.Server;

import java.time.LocalDateTime;
import java.util.List;

public record PlayerDto(
        long playerId,
        String name,
        String avatarPath,
        Server server,
        int countCards,
        LocalDateTime profileUpdatedAt,
        LocalDateTime cardsUpdatedAt,
        List<PlayerCardDto> cards
) {
}