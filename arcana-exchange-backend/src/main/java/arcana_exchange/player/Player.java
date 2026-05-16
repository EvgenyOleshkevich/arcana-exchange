package arcana_exchange.player;

import arcana_exchange.card.DTO.PlayerCardDto;
import arcana_exchange.utils.enums.Server;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {
    @Id
    private long playerId;
    private String name;
    @Column(name = "avatar_path")
    private String avatarPath;
    @Column(name = "verification_code")
    private String verificationCode;
    @Enumerated(EnumType.STRING)
    private Server server;
    @Column(name = "count_cards")
    private int countCards;
    @Column(name = "profile_updated_at")
    private Instant profileUpdatedAt;
    @Column(name = "cards_updated_at")
    private Instant cardsUpdatedAt;

    public PlayerDto toDto() {
        return toDto(List.of());
    }

    public PlayerDto toDto(List<PlayerCardDto> cards){
        return new PlayerDto(
                playerId,
                name,
                avatarPath,
                server,
                countCards,
                profileUpdatedAt,
                cardsUpdatedAt,
                cards);
    }
}