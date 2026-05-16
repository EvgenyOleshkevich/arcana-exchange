package arcana_exchange.enka;

import lombok.Data;

@Data
public class PlayerInfoResponse {
    private PlayerInfo playerInfo;

    @Data
    public static class PlayerInfo {
        private String nickname;
        private String signature;
        private String region;
        private ProfilePicture profilePicture;
    }

    @Data
    public static class ProfilePicture {
        private long  id;
    }
}
