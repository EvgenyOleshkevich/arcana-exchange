package arcana_exchange.match;

import arcana_exchange.match.PlayerCard;
import arcana_exchange.match.PlayerCardId;
import arcana_exchange.player.Player;
import arcana_exchange.utils.enums.Server;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface PlayerCardRepository
        extends JpaRepository<PlayerCard, PlayerCardId> {

    List<PlayerCard> findByIdPlayerId(long playerId);

    List<PlayerCard> findByIdCardId(long cardId);

    void deleteByIdPlayerId(long playerId);

    void deleteByIdCardId(long cardId);

    @Query("""
    SELECT pc
    FROM PlayerCard pc
    JOIN FETCH pc.player
    WHERE pc.id.playerId IN :playerIds
    """)
    List<PlayerCard> findAllByPlayerIds(
            Collection<Long> playerIds
    );

    @Query("""
    SELECT COALESCE(SUM(pc.quantity), 0)
    FROM PlayerCard pc
    WHERE pc.id.cardId = :cardId
    """)
    int sumQuantityByCardId(long cardId);

    @Query("""
    SELECT COALESCE(SUM(pc.quantity - 1), 0)
    FROM PlayerCard pc
    WHERE pc.id.cardId = :cardId
      AND pc.quantity > 1
    """)
    int sumExtraQuantityByCardId(long cardId);

    @Query("""
    SELECT COUNT(pc)
    FROM PlayerCard pc
    WHERE pc.id.cardId = :cardId
    """)
    int countOwnersByCardId(long cardId);

    @Query("""
    SELECT pc.player
    FROM PlayerCard pc
    WHERE pc.id.playerId = :playerId
        AND pc.player.server = :server
""")
    List<Player> findByPlayerIdWithCard(
            long playerId,
            Server server
    );

    @Query("""
        SELECT pc.player
        FROM PlayerCard pc
        WHERE pc.card.cardId = :cardId
          AND pc.quantity > 1
          AND pc.player.server = :server
        ORDER BY function('RANDOM')
    """)
    List<Player> findPlayersOfferingCard(
            long cardId,
            Server server,
            Pageable pageable
    );

    @Query(value = """
    SELECT p.*
    FROM players p
    LEFT JOIN player_cards pc
      ON pc.player_id = p.player_id
     AND pc.card_id = :cardId
    WHERE p.server = :server
      AND COALESCE(pc.quantity, 0) = 0
    ORDER BY RANDOM()
    LIMIT 20
    """, nativeQuery = true)
    List<Player> findPlayersWantingCard(
            long cardId,
            String server
    );

    @Query(value = """
    SELECT other_player.*
    FROM players other_player
    WHERE other_player.player_id <> :playerId
      AND other_player.server = (
          SELECT p.server
          FROM players p
          WHERE p.player_id = :playerId
      )
      AND EXISTS (
          SELECT 1
          FROM player_cards my_card
          LEFT JOIN player_cards other_same_card
            ON other_same_card.player_id = other_player.player_id
           AND other_same_card.card_id = my_card.card_id
          WHERE my_card.player_id = :playerId
            AND my_card.quantity > 1
            AND COALESCE(other_same_card.quantity, 0) = 0
      )
      AND EXISTS (
          SELECT 1
          FROM player_cards other_card
          LEFT JOIN player_cards my_same_card
            ON my_same_card.player_id = :playerId
           AND my_same_card.card_id = other_card.card_id
          WHERE other_card.player_id = other_player.player_id
            AND other_card.quantity > 1
            AND COALESCE(my_same_card.quantity, 0) = 0
      )
    ORDER BY RANDOM()
    LIMIT 20
    """, nativeQuery = true)
    List<Player> findPerfectMatches(long playerId);
}