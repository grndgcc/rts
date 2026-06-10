# Realm Siege RTS Prototype v0.3

Flat-folder, GitHub Pages friendly JavaScript RTS prototype.

## Nasıl çalıştırılır?

Dosyaların tamamını GitHub repo ana dizinine koy. GitHub Pages açıldığında `index.html` doğrudan çalışır.

Yerelde test:

```bash
python -m http.server 8000
```

Sonra tarayıcıda:

```txt
http://localhost:8000
```

## v0.3 yenilikleri

- Ülke seçimi: oyun başlamadan oyuncu ve rakip faction seçilebilir.
- Oyun modu seçimi: singleplayer, multiplayer host, multiplayer join.
- Multiplayer mantığı: WebSocket relay server ile komut gönderme/alma sistemi eklendi.
- Harita arkaplanı: `map_background.png` ana dizinde kullanılır ve `maps.json` içinden tanımlıdır.
- Teknoloji sistemi: Research Hall üzerinden araştırmalar yapılabilir.
- Teknoloji etkileri: melee/ranged/siege damage die upgrade, tower range, economy, production speed, command limit, armor/hp bonusları.
- AI zorluğu: Easy/Normal/Hard üretim ve saldırı temposunu değiştirir.
- Local player sistemi: Host P1, Join P2 olarak oynanabilir.

## Dosyalar

- `index.html`: UI ve canvas giriş dosyası.
- `style.css`: menü/HUD/panel stilleri.
- `main.js`: oyun motoru, combat, AI, technology, multiplayer client logic.
- `server.js`: multiplayer WebSocket relay server.
- `factions.json`: ülkeler.
- `units.json`: birimler.
- `buildings.json`: binalar ve Research Hall.
- `heroes.json`: hero verileri.
- `abilities.json`: hero skill verileri.
- `modifiers.json`: aura/buff/debuff verileri.
- `researches.json`: teknoloji sistemi.
- `maps.json`: harita, slotlar, outpostlar, arkaplan resmi.
- `counter_matrix.json`: counter sistemi.
- `map_background.png`: harita arkaplanı.

## Multiplayer test

GitHub Pages server çalıştıramaz. Multiplayer için kendi bilgisayarında Node.js server aç:

```bash
npm install
npm start
```

Server varsayılan olarak:

```txt
ws://localhost:8787
```

Aynı bilgisayarda iki tarayıcı sekmesi aç:

1. İlk sekme: Multiplayer Host / Player 1.
2. İkinci sekme: Multiplayer Join / Player 2.
3. İkisi de aynı Room ID kullanmalı.

Bu sürüm tam profesyonel lockstep değildir; ancak RTS multiplayer için gereken komut mimarisi hazırdır: build, train, research, move/attack, hero ability komutları relay üzerinden karşı tarafa gönderilir.

## Modlama

Yeni ülke, birim, bina, hero veya teknoloji eklemek için ilgili JSON dosyasına yeni kayıt eklenir. Motor mümkün olduğunca isimleri hard-code etmez.
