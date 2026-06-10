# Realm Siege Modding Guide

Bu paket, ana dizinde kullanılabilecek örnek şablon dosyalarıdır. Oyun şimdilik şu ana JSON dosyalarını okur:

- `factions.json`
- `units.json`
- `buildings.json`
- `heroes.json`
- `abilities.json`
- `modifiers.json`
- `counter_matrix.json`
- `maps.json`
- `game_rules.json`

Yeni içerik eklemek için mevcut JSON dosyalarına buradaki şablonlardan kopyala-yapıştır yapabilirsin.

## Yeni unit ekleme sırası

1. `units.json` içine yeni unit bloğu ekle.
2. Bir binanın `produces` listesine unit id'sini ekle.
3. Gerekirse `counter_matrix.json` içinde counter ilişkisi ver.
4. Oyunu GitHub Pages veya local server ile yeniden aç.

## Yeni hero ekleme sırası

1. `heroes.json` içine yeni hero ekle.
2. `abilities.json` içine ability ekle veya mevcut ability id'lerini kullan.
3. `factions.json` içinde ilgili faction'ın `heroes` listesine hero id ekle.
