package arcana_exchange.player;

import arcana_exchange.utils.enums.Server;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByVerificationCode(String verificationCode);

    List<Player> findByServer(Server server);
}