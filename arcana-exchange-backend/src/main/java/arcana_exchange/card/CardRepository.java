package arcana_exchange.card;

import arcana_exchange.card.Card;
import arcana_exchange.match.PlayerCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByExternalImageCode(String externalCode);
    List<Card> findByExternalImageCodeIn(Collection<String> externalCodes );

    @Query("""
    SELECT с.cardId
    FROM Card с
    """)
    List<Long> allCardIds();
}