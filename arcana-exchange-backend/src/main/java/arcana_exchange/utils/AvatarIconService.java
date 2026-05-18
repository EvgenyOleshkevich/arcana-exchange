package arcana_exchange.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Service
public class AvatarIconService {
    private final Map<String, String> icons;
    private final Map<String, String> characterIcons;
    private static final String DEFAULT_PATH = "UI_AvatarIcon_Default_Circle";

    public AvatarIconService(ObjectMapper objectMapper) throws IOException {

        Resource resource =
                new ClassPathResource("data/icons.json");

        try (InputStream inputStream = resource.getInputStream()) {

            icons = objectMapper.readValue(
                    inputStream,
                    new TypeReference<>() {}
            );
        }

        resource =
                new ClassPathResource("data/characters.json");

        try (InputStream inputStream = resource.getInputStream()) {

            characterIcons = objectMapper.readValue(
                    inputStream,
                    new TypeReference<>() {}
            );
        }
    }

    public String getIconPath(Long  avatarId) {
        String id = String.valueOf(avatarId);
        return icons.getOrDefault(
                id,
                characterIcons.getOrDefault(
                        id,
                        DEFAULT_PATH
                ));
    }
}
