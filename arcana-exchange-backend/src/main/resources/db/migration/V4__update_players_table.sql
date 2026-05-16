
ALTER TABLE players
    ADD COLUMN avatar_path VARCHAR(100);

ALTER TABLE players
    ADD COLUMN profile_updated_at TIMESTAMP;

ALTER TABLE players
    ADD COLUMN cards_updated_at TIMESTAMP;