package arcana_exchange.card.DTO;

public record ParsedCard(
        String name,
        int quantity,
        String externalImageCode
) {
}