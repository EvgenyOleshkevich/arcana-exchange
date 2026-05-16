package arcana_exchange.match;

import arcana_exchange.card.CardService;
import arcana_exchange.card.DTO.PlayerCardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerCardService {
    private final PlayerCardRepository playerCardRepository;
    private final CardService cardService;

    @Transactional
    public void replacePlayerCards(Long playerId, List<PlayerCard> newCards) {
        playerCardRepository.deleteByIdPlayerId(playerId);
        playerCardRepository.saveAll(newCards);
        cardService.recalculateAll();
    }

    public List<PlayerCardDto> entityToDto(List<PlayerCard> pcs) {
        return pcs.stream()
                .map(pc -> new PlayerCardDto(
                        pc.getCard().getCardId(),
                        pc.getQuantity()
                ))
                .toList();
    }
}
