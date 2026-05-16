package arcana_exchange.card.DTO;

import arcana_exchange.player.PlayerDto;

import java.util.List;

public record CardExchangePlayersDto(
        List<PlayerDto> offers,
        List<PlayerDto> wanted
) {
}