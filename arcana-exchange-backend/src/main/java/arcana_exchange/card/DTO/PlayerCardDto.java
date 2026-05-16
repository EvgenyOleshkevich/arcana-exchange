package arcana_exchange.card.DTO;

public record PlayerCardDto(
        long cardId,
        String nameRu,
        String nameEn,
        String imageUrl,
        int quantity
) {
}