CREATE TABLE players (
                         player_id BIGSERIAL PRIMARY KEY,
                         name VARCHAR(100) NOT NULL,
                         verification_code VARCHAR(100),
                         server VARCHAR(30) NOT NULL,
                         count_cards INT NOT NULL DEFAULT 0
);

CREATE TABLE cards (
                       card_id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       image_url TEXT,
                       wanted_by_players_count INT NOT NULL DEFAULT 0,
                       count_owned INT NOT NULL DEFAULT 0,
                       offered_extra_count INT NOT NULL DEFAULT 0
);

CREATE TABLE player_cards (
                              player_id BIGINT NOT NULL,
                              card_id BIGINT NOT NULL,
                              quantity INT NOT NULL DEFAULT 0,

                              PRIMARY KEY (player_id, card_id),

                              CONSTRAINT fk_player_cards_player
                                  FOREIGN KEY (player_id)
                                      REFERENCES players(player_id)
                                      ON DELETE CASCADE,

                              CONSTRAINT fk_player_cards_card
                                  FOREIGN KEY (card_id)
                                      REFERENCES cards(card_id)
                                      ON DELETE CASCADE
);

CREATE INDEX idx_player_cards_card_id_quantity
    ON player_cards(card_id, quantity);

CREATE INDEX idx_players_server
    ON players(server);