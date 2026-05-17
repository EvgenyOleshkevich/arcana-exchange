package arcana_exchange.card;

import arcana_exchange.card.DTO.PlayerCardDto;
import arcana_exchange.match.MatchDto;
import arcana_exchange.match.PlayerCard;
import arcana_exchange.player.Player;
import arcana_exchange.player.PlayerDto;
import arcana_exchange.player.PlayerRepository;
import arcana_exchange.utils.enums.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import arcana_exchange.card.CardRepository;
import arcana_exchange.match.PlayerCardRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final PlayerCardRepository playerCardRepository;
    private final PlayerRepository playerRepository;

    public List<Card> getAllCards() {
        var cards = cardRepository.findAll();
        cards.sort(Comparator.comparing(Card::getCardId));
        return cards;
    }

    @Transactional
    public void recalculateAll() {
        List<Card> cards = cardRepository.findAll();
        long totalPlayers = playerRepository.count();

        for (Card card : cards) {
            long cardId = card.getCardId();


            int countWanted = Math.toIntExact(totalPlayers - playerCardRepository.countOwnersByCardId(cardId));
            int countOwned = playerCardRepository.sumQuantityByCardId(cardId);
            int countOffered = playerCardRepository.sumExtraQuantityByCardId(cardId);

            card.setCountWanted(countWanted);
            card.setCountOwned(countOwned);
            card.setCountOffered(countOffered);
        }

        cardRepository.saveAll(cards);
    }

    public List<PlayerDto> getPlayersOfferingCard(long cardId, Server server) {
        return entityToDto(playerCardRepository.findPlayersOfferingCard(cardId, server, PageRequest.of(0, 20)));
    }

    public List<PlayerDto> getPlayersHavingCard(long cardId, Server server) {
        return entityToDto(playerCardRepository.findByPlayerIdWithCard(cardId, server));
    }

    public List<PlayerDto> getPlayersWantingCard(long cardId, Server server) {
        return entityToDto(playerCardRepository.findPlayersWantingCard(cardId, server.name()));
    }

    public List<MatchDto> getPlayersPerfectMatch(long playerId) {
        var players =  playerCardRepository.findPerfectMatches(playerId);
        if (players.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> cardIds = cardRepository.allCardIds();

        var playerIds = new ArrayList<>(players.stream().map(Player::getPlayerId).toList());
        playerIds.add(playerId);

        List<PlayerCard> allCards = playerCardRepository.findAllByPlayerIds(playerIds);

        Map<Long, List<PlayerCard>> cardsByPlayerId =
                allCards.stream()
                        .collect(Collectors.groupingBy(
                                pc -> pc.getPlayer().getPlayerId()
                        ));

        List<PlayerCard> myCards = cardsByPlayerId.getOrDefault(playerId, List.of());
        List<Long> myOffer = getOffers(myCards);
        Set<Long> myNeed = getWanted(myCards, cardIds);

        return players.stream()
                .map(player -> {
                    List<PlayerCard> otherPlayerCards =
                            cardsByPlayerId.getOrDefault(player.getPlayerId(), List.of());

                    List<Long> otherOffer = getOffers(otherPlayerCards);
                    Set<Long> otherNeed = getWanted(otherPlayerCards, cardIds);

                    return buildMatchDto(player, myOffer, myNeed, otherOffer, otherNeed);
                })
                .filter(matchDto -> !matchDto.cardsYouCanGive().isEmpty() && !matchDto.cardsYouCanReceive().isEmpty())
                .toList();
    }

    private List<Long> getOffers(List<PlayerCard> pcs) {
        return pcs.stream().filter(pc -> pc.getQuantity() > 1)
                .map(pc -> pc.getId().getCardId()).toList();
    }

    private Set<Long> getWanted(List<PlayerCard> pcs, List<Long> cardIds) {
        var cardSet = pcs.stream()
                .map(pc -> pc.getId().getCardId())
                .collect(Collectors.toSet());

        return cardIds.stream().filter(id -> !cardSet.contains(id))
                .collect(Collectors.toSet());
    }

    private MatchDto buildMatchDto(Player player, List<Long> myOffer, Set<Long> myNeed, List<Long> otherOffer, Set<Long> otherNeed){
        var cardsYouCanGive = myOffer.stream().filter(otherNeed::contains).toList();
        var cardsYouCanReceive = otherOffer.stream().filter(myNeed::contains).toList();
        return new MatchDto(
                player.toDto(),
                cardsYouCanGive,
                cardsYouCanReceive
        );
    }

    private List<PlayerDto> entityToDto(List<Player> players) {
        return players.stream().map(Player::toDto)
                .toList();
    }
}
