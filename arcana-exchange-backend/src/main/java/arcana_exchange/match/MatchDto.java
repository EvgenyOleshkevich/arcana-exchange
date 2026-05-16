package arcana_exchange.match;

import arcana_exchange.player.PlayerDto;

import java.util.List;

public record MatchDto(
        PlayerDto player,
        List<Long> cardsYouCanGive,
        List<Long> cardsYouCanReceive
) {
}