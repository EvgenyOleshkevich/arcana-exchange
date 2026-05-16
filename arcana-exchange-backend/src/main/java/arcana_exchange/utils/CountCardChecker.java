package arcana_exchange.utils;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class CountCardChecker {
    private static final LocalDate EVENT_START_DATE =
            LocalDate.of(2025, 10, 1);

    public static boolean canHaveCards(int count) {
        int months = (int) ChronoUnit.MONTHS.between(
                EVENT_START_DATE,
                LocalDate.now()
        );
        return count <= months + 1;
    }

    public static int getMaxPossibleCards() {
        return (int) ChronoUnit.MONTHS.between(
                EVENT_START_DATE,
                LocalDate.now()
        ) + 1;
    }
}
