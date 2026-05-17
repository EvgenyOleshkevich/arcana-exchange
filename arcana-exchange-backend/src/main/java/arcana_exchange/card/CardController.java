package arcana_exchange.card;

import arcana_exchange.card.DTO.CardExchangePlayersDto;
import arcana_exchange.player.PlayerDto;
import arcana_exchange.utils.enums.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;

    @GetMapping
        public List<Card> getCards() {
            return cardService.getAllCards();
        }

        @GetMapping("/{cardId}/offers")
        public List<PlayerDto> getPlayersOfferingCard(
        @PathVariable long cardId,
        @RequestParam Server server
    ) {
            return cardService.getPlayersOfferingCard(cardId, server);
        }

        @GetMapping("/{cardId}/wanted")
        public List<PlayerDto> getPlayersWantingCard(
        @PathVariable long cardId,
        @RequestParam Server server
    ) {
            return cardService.getPlayersWantingCard(cardId, server);
        }

        @GetMapping("/{cardId}/exchange-players")
        public CardExchangePlayersDto getPlayersExchangingCard(
        @PathVariable long cardId,
        @RequestParam Server server
    ) {
            return new CardExchangePlayersDto(
                cardService.getPlayersOfferingCard(cardId, server),
                cardService.getPlayersWantingCard(cardId, server));
    }
}