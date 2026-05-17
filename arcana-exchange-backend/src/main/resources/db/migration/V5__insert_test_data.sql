INSERT INTO players (
    player_id,
    name,
    avatar_path,
    verification_code,
    server,
    count_cards,
    profile_updated_at,
    cards_updated_at
)
VALUES
    (101, 'LumineFox', 'UI_AvatarIcon_PlayerGirl_Circle', 'test-code-101', 'EUROPE', 8, NOW(), NOW()),
    (102, 'AetherCat', 'UI_AvatarIcon_PlayerBoy_Circle', 'test-code-102', 'EUROPE', 8, NOW(), NOW()),
    (103, 'MonaTea', 'UI_AvatarIcon_Mona_Circle', 'test-code-103', 'EUROPE', 7, NOW(), NOW()),
    (104, 'KleeBoom', 'UI_AvatarIcon_Klee_Circle', 'test-code-104', 'EUROPE', 7, NOW(), NOW()),
    (105, 'HuTaoMain', 'UI_AvatarIcon_Hutao_Circle', 'test-code-105', 'EUROPE', 8, NOW(), NOW()),
    (106, 'VentiWind', 'UI_AvatarIcon_Venti_Circle', 'test-code-106', 'EUROPE', 8, NOW(), NOW()),
    (107, 'ZhongliRock', 'UI_AvatarIcon_Zhongli_Circle', 'test-code-107', 'EUROPE', 7, NOW(), NOW()),
    (108, 'RaidenFox', 'UI_AvatarIcon_Shougun_Circle', 'test-code-108', 'EUROPE', 7, NOW(), NOW()),
    (109, 'NahidaLeaf', 'UI_AvatarIcon_Nahida_Circle', 'test-code-109', 'EUROPE', 8, NOW(), NOW()),
    (110, 'FurinaWave', 'UI_AvatarIcon_Furina_Circle', 'test-code-110', 'EUROPE', 8, NOW(), NOW()),

    (111, 'AsiaMiko', 'UI_AvatarIcon_Yae_Circle', 'test-code-111', 'ASIA', 8, NOW(), NOW()),
    (112, 'AsiaAyaka', 'UI_AvatarIcon_Ayaka_Circle', 'test-code-112', 'ASIA', 8, NOW(), NOW()),
    (113, 'AsiaYoimiya', 'UI_AvatarIcon_Yoimiya_Circle', 'test-code-113', 'ASIA', 7, NOW(), NOW()),
    (114, 'AsiaKazuha', 'UI_AvatarIcon_Kazuha_Circle', 'test-code-114', 'ASIA', 7, NOW(), NOW()),
    (115, 'AsiaKokomi', 'UI_AvatarIcon_Kokomi_Circle', 'test-code-115', 'ASIA', 8, NOW(), NOW()),
    (116, 'AsiaItto', 'UI_AvatarIcon_Itto_Circle', 'test-code-116', 'ASIA', 8, NOW(), NOW()),
    (117, 'AsiaNilou', 'UI_AvatarIcon_Nilou_Circle', 'test-code-117', 'ASIA', 7, NOW(), NOW()),
    (118, 'AsiaCyno', 'UI_AvatarIcon_Cyno_Circle', 'test-code-118', 'ASIA', 7, NOW(), NOW()),
    (119, 'AsiaNavia', 'UI_AvatarIcon_Navia_Circle', 'test-code-119', 'ASIA', 8, NOW(), NOW()),
    (120, 'AsiaClorinde', 'UI_AvatarIcon_Clorinde_Circle', 'test-code-120', 'ASIA', 8, NOW(), NOW());

INSERT INTO player_cards (player_id, card_id, quantity)
VALUES
-- EUROPE
(101, 1, 2), (101, 2, 1), (101, 3, 1), (101, 6, 2), (101, 10, 1), (101, 15, 1),
(102, 4, 2), (102, 5, 1), (102, 7, 2), (102, 11, 1), (102, 16, 1), (102, 21, 1),

(103, 1, 1), (103, 8, 2), (103, 9, 1), (103, 12, 2), (103, 18, 1),
(104, 2, 2), (104, 3, 1), (104, 13, 2), (104, 19, 1), (104, 22, 1),

(105, 5, 2), (105, 6, 1), (105, 14, 2), (105, 17, 1), (105, 20, 1),
(106, 1, 1), (106, 7, 1), (106, 10, 2), (106, 15, 2), (106, 21, 1),

(107, 4, 1), (107, 8, 1), (107, 11, 2), (107, 16, 2), (107, 22, 1),
(108, 2, 1), (108, 9, 2), (108, 12, 1), (108, 18, 2), (108, 20, 1),

(109, 3, 2), (109, 5, 1), (109, 13, 1), (109, 17, 2), (109, 19, 1),
(110, 6, 1), (110, 10, 1), (110, 14, 2), (110, 15, 1), (110, 21, 2),

-- ASIA
(111, 1, 2), (111, 4, 1), (111, 7, 1), (111, 12, 2), (111, 18, 1),
(112, 2, 1), (112, 5, 2), (112, 8, 1), (112, 13, 2), (112, 19, 1),

(113, 3, 2), (113, 6, 1), (113, 9, 2), (113, 14, 1), (113, 20, 1),
(114, 4, 2), (114, 7, 1), (114, 10, 2), (114, 15, 1), (114, 21, 1),

(115, 5, 1), (115, 8, 2), (115, 11, 1), (115, 16, 2), (115, 22, 1),
(116, 6, 2), (116, 9, 1), (116, 12, 1), (116, 17, 2), (116, 1, 1),

(117, 7, 2), (117, 10, 1), (117, 13, 1), (117, 18, 2), (117, 2, 1),
(118, 8, 1), (118, 11, 2), (118, 14, 1), (118, 19, 2), (118, 3, 1),

(119, 9, 1), (119, 12, 2), (119, 15, 1), (119, 20, 2), (119, 4, 1),
(120, 10, 2), (120, 13, 1), (120, 16, 1), (120, 21, 2), (120, 5, 1);