package arcana_exchange.player;

import arcana_exchange.card.Card;
import arcana_exchange.card.CardRepository;
import arcana_exchange.card.DTO.ParsedCard;
import arcana_exchange.card.DTO.PlayerCardDto;
import arcana_exchange.enka.EnkaService;
import arcana_exchange.enka.PlayerInfoResponse;
import arcana_exchange.match.PlayerCard;
import arcana_exchange.match.PlayerCardId;
import arcana_exchange.match.PlayerCardRepository;
import arcana_exchange.match.PlayerCardService;
import arcana_exchange.utils.*;
import arcana_exchange.utils.enums.DataType;
import arcana_exchange.utils.enums.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {
    private static final boolean DEBUG = false;
    private static final Duration UPDATE_COOLDOWN = Duration.ofMinutes(1);
    private static final Duration UPDATE_CARD_COOLDOWN = Duration.ofMinutes(1);
    private final EnkaService enkaService;
    private final AvatarIconService avatarIconService;
    private final PlayerCardService playerCardService;
    private final TarotHtmlParser htmlParser;
    private final TarotJsonParser jsonParser;
    private final PlayerRepository playerRepository;
    private final PlayerCardRepository playerCardRepository;
    private final CardRepository cardRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public PlayerDto getPlayer(long playerId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        List<PlayerCardDto> cards = playerCardService.entityToDto(playerCardRepository.findByIdPlayerId(playerId));
        return player.toDto(cards);
    }

    public PlayerDto createPlayer(long id) {
        if (playerRepository.findById(id).isPresent()) {
            throw new RuntimeException("Player with this id already exists");
        }

        PlayerInfoResponse response =
                enkaService.getPlayerInfo(id);

        var info = response.getPlayerInfo();
        var player = Player.builder()
                .playerId(id)
                .name(info.getNickname())
                .avatarPath(avatarIconService.getIconPath(info.getProfilePicture().getResolvedId()))
                .verificationCode(VerificationCodeGenerator.generateCode())
                .server(getServer(response.getRegion()))
                .countCards(0)
                .profileUpdatedAt(Instant.now())
                //.cardsUpdatedAt(Instant.now())
                .build();

        return playerRepository.save(player).toDto();
    }

    @Transactional
    public void updatePlayer(long id, String data, DataType dataType) {
        var player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found: " + id));
        validateUpdateCardCooldown(player);

        var info = enkaService.getPlayerInfo(id).getPlayerInfo();


        if (!DEBUG) {
            if (info.getSignature() == null ||
                    player.getVerificationCode() == null ||
                    !info.getSignature().contains(player.getVerificationCode())) {
                throw new RuntimeException("Verification Code does not match");
            }
        }

        var parsedCards =
                switch (dataType) {
                    case JSON -> jsonParser.parse(data);
                    case HTML -> htmlParser.parse(data);
                };

        if (parsedCards.size() != parsedCards.stream()
                .map(ParsedCard::externalImageCode)
                .distinct()
                .count()) {
            throw new RuntimeException("Duplicate cards in HTML");
        }

        int sumCard = parsedCards.stream().reduce(0, (sum, card) -> sum + card.quantity(), Integer::sum);
        if (!CountCardChecker.canHaveCards(sumCard)) {
            throw new RuntimeException("Suspicious profile:\n" +
                    "claimed cards exceed expected monthly maximum");
        }

        player.setName(info.getNickname());
        player.setCountCards(sumCard);
        player.setVerificationCode(null);
        player.setAvatarPath(avatarIconService.getIconPath(info.getProfilePicture().getResolvedId()));
        player.setProfileUpdatedAt(Instant.now());
        player.setCardsUpdatedAt(Instant.now());

        List<Card> allCards = cardRepository.findAll();
        Map<String, Card> cardsByCode = allCards.stream()
                .collect(Collectors.toMap(Card::getExternalImageCode, Function.identity()));
        Map<String, Card> cardsByNameRu = allCards.stream()
                .collect(Collectors.toMap(Card::getNameRu, Function.identity()));
        Map<String, Card> cardsByNameEn = allCards.stream()
                .collect(Collectors.toMap(Card::getNameEn, Function.identity()));

        Set<Card> updatedCards = new HashSet<>();

        List<PlayerCard> playerCards = parsedCards.stream()
                .map(parsed -> {
                    Card card = getCard(parsed, cardsByCode, cardsByNameRu, cardsByNameEn, updatedCards);

                    return PlayerCard.builder()
                            .id(new PlayerCardId(player.getPlayerId(), card.getCardId()))
                            .quantity(parsed.quantity())
                            .player(player)
                            .card(card)
                            .build();
                })
                .toList();

        if (!updatedCards.isEmpty()) {
            cardRepository.saveAll(updatedCards);
        }
        playerCardService.replacePlayerCards(player.getPlayerId(), playerCards);
        playerRepository.save(player);
        /*
        List<PlayerCardDto> cards = parsedCards.stream()
                .map(parsed -> {
                    Card card = cardsByCode.get(parsed.externalImageCode());

                    return new PlayerCardDto(
                            card.getCardId(),
                            parsed.quantity());
                })
                .toList();

        return player.toDto(cards);*/
    }

    @Transactional
    public PlayerDto updatePlayerInfo(long id) {
        var player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found: " + id));

        validateUpdateCooldown(player);

        var info = enkaService.getPlayerInfo(id).getPlayerInfo();
        player.setName(info.getNickname());
        player.setAvatarPath(avatarIconService.getIconPath(info.getProfilePicture().getResolvedId()));
        player.setProfileUpdatedAt(Instant.now());
        playerRepository.save(player);

        return player.toDto();
    }

    public String requestCode(long id) {
        var player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found: " + id));


        if (player.getVerificationCode() == null) {
            validateUpdateCooldown(player);
            player.setVerificationCode(VerificationCodeGenerator.generateCode());
            player.setProfileUpdatedAt(Instant.now());
            playerRepository.save(player);
        }
        return player.getVerificationCode();
    }

    public boolean verifyCode(long id) {
        var player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found: " + id));
        validateUpdateCooldown(player);

        if (player.getVerificationCode() == null) {
            throw new RuntimeException("Verification code is null, you need request new code");
        }

        var info = enkaService.getPlayerInfo(id).getPlayerInfo();

        return info.getSignature() != null &&
                info.getSignature().contains(player.getVerificationCode());
    }

    public void deletePlayer(long id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Player not found: " + id);
        }
        playerRepository.deleteById(id);
    }

    private Server getServer(String region) {
        return switch (region) {
            case "EU" -> Server.EUROPE;
            case "NA" -> Server.AMERICA;
            case "ASIA" -> Server.ASIA;
            case "TW" -> Server.TW_HK_MO;
            default -> Server.TW_HK_MO;
        };
    }

    private Card getCard(
            ParsedCard parsed,
            Map<String, Card> cardsByCode,
            Map<String, Card> cardsByNameRu,
            Map<String, Card> cardsByNameEn,
            Set<Card> updatedCards) {
        Card card = cardsByCode.get(parsed.externalImageCode());
        if (card == null) {
            card = cardsByNameRu.get((parsed.name()));
            if (card != null) {
                card.setExternalImageCode(parsed.externalImageCode());
                updatedCards.add(card);
                return card;
            }

            card = cardsByNameEn.get((parsed.name()));
            if (card != null) {
                card.setExternalImageCode(parsed.externalImageCode());
                updatedCards.add(card);
                return card;
            }
            throw new RuntimeException("Unknown card: " + parsed.name());
        }
        return card;
    }


    private void validateUpdateCooldown(Player player) {
        if (DEBUG) {
            return;
        }
        Instant lastUpdatedAt = player.getProfileUpdatedAt();

        if (lastUpdatedAt == null) {
            return;
        }

        Instant nextAllowedUpdate =
                lastUpdatedAt.plus(UPDATE_COOLDOWN);

        if (Instant.now().isBefore(nextAllowedUpdate)) {
            throw new RuntimeException(
                    "You can update profile only once per minute"
            );
        }
    }

    private void validateUpdateCardCooldown(Player player) {
        if (DEBUG) {
            return;
        }
        Instant lastUpdatedAt = player.getCardsUpdatedAt();

        if (lastUpdatedAt == null) {
            return;
        }

        Instant nextAllowedUpdate =
                lastUpdatedAt.plus(UPDATE_CARD_COOLDOWN);

        if (Instant.now().isBefore(nextAllowedUpdate)) {
            throw new RuntimeException(
                    "You can update card only once per 5 minutes"
            );
        }
    }

}
