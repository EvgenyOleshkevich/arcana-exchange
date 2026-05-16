package arcana_exchange.utils;

import java.security.SecureRandom;
import java.util.Base64;


public class VerificationCodeGenerator {
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateCode() {

        byte[] bytes = new byte[15];

        RANDOM.nextBytes(bytes);

        return "arc-" + Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}
