package arcana_exchange.match;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerCardId implements Serializable {
    private Long playerId;
    private Long cardId;
}