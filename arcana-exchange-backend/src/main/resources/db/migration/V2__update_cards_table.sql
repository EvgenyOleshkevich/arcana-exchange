ALTER TABLE cards
    RENAME COLUMN name TO name_ru;

ALTER TABLE cards
    ADD COLUMN name_en VARCHAR(100);

ALTER TABLE cards
    ADD COLUMN external_image_code VARCHAR(255);

ALTER TABLE cards
    RENAME COLUMN wanted_by_players_count TO count_wanted;

ALTER TABLE cards
    RENAME COLUMN offered_extra_count TO count_offered;

CREATE UNIQUE INDEX idx_cards_external_image_code
    ON cards(external_image_code);