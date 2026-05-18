package arcana_exchange.enka;

import lombok.Data;

@Data
public class PlayerInfoResponse {
    private PlayerInfo playerInfo;
    private String region;

    @Data
    public static class PlayerInfo {
        private String nickname;
        private String signature;
        private ProfilePicture profilePicture;
    }

    @Data
    public static class ProfilePicture {
        private Long id;
        private Long avatarId;

        public Long getResolvedId() {
            return id != null ? id : avatarId;
        }
    }
}
