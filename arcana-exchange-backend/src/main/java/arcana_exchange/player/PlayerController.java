package arcana_exchange.player;

import arcana_exchange.card.CardService;
import arcana_exchange.match.MatchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player")
@RequiredArgsConstructor
public class PlayerController {
    private final PlayerService playerService;
    private final CardService cardService;

    @PostMapping("/{playerId}/create")
    public PlayerDto createPlayer(
            @PathVariable long playerId
    ) {
        return playerService.createPlayer(playerId);
    }

    @PutMapping("/{playerId}/cards/html")
    public PlayerDto updatePlayer(
            @PathVariable long playerId,
            @RequestBody String html
    ) {
        return playerService.updatePlayer(playerId, html);
    }

    @PostMapping("/{playerId}/verification-code")
    public String requestCode(@PathVariable long playerId) {
        return playerService.requestCode(playerId);
    }

    @GetMapping("/{playerId}/verify")
    public boolean verifyCode(@PathVariable long playerId) {
        return playerService.verifyCode(playerId);
    }

    @GetMapping("/{playerId}")
    public PlayerDto getPlayer(@PathVariable long playerId) {
        return playerService.getPlayer(playerId);
    }

    @GetMapping("/{playerId}/match")
    public List<MatchDto> getPlayersPerfectMatch(
            @PathVariable long playerId
    ) {
        return cardService.getPlayersPerfectMatch(playerId);
    }
}
