package arcana_exchange.utils;

import arcana_exchange.card.DTO.ParsedCard;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarotHtmlParser {

    public List<ParsedCard> parse(String html) {
        Document document = Jsoup.parse(html);

        return document.select(".tarot-item")
                .stream()
                .map(this::parseCard)
                .filter(card -> card.quantity() != 0)
                .toList();
    }

    private ParsedCard parseCard(Element item) {
        String name = item.selectFirst(".tarot-name").text();
        Element image = item.selectFirst("img");
        String imageUrl = image.attr("src");

        boolean isMissing = imageUrl.contains("tarot_default");

        int quantity = 0;

        if (!isMissing) {
            Element unlockNum = item.selectFirst(".unlock-num");

            quantity = unlockNum == null
                    ? 1
                    : Integer.parseInt(unlockNum.text().trim());
        }

        return new ParsedCard(name, quantity, extractImageCode(imageUrl));
    }

    private String extractImageCode(String imageUrl) {

        return imageUrl.substring(
                imageUrl.lastIndexOf("/") + 1,
                imageUrl.lastIndexOf(".")
        );
    }
}