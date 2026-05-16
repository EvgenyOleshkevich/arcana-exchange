package arcana_exchange.card;

import arcana_exchange.utils.enums.Server;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cardId;
    @Column(name = "name_ru")
    private String nameRu;
    @Column(name = "name_en")
    private String nameEn;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "external_image_code")
    private String externalImageCode;
    @Column(name = "count_wanted")
    private int countWanted;
    @Column(name = "count_owned")
    private int countOwned;
    @Column(name = "count_offered")
    private int countOffered;

    /*public void incWanted(int n) {
        countWanted += n;
    }
    public void incOwned(int n) {
        countOwned += n;
    }
    public void incOffered(int n) {
        countOffered += n;
    }*/
}