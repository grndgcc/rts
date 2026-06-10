# Multiplayer Setup

Bu sürümde multiplayer, WebSocket relay server üzerinden komut taşır.

## Kurulum

```bash
npm install
npm start
```

Server:

```txt
ws://localhost:8787
```

## Test

1. Birinci tarayıcı sekmesi: `Multiplayer Host / Player 1`
2. İkinci tarayıcı sekmesi: `Multiplayer Join / Player 2`
3. Aynı `Room ID` gir.
4. İki client aynı seed ile başlamalı.

## Taşınan komutlar

- `build`
- `upgrade_building`
- `repair_building`
- `train_unit`
- `train_hero`
- `research`
- `unit_order`
- `cast_ability`

Bu yapı ileride tam deterministic lockstep'e çevrilebilir. Şimdiki sürüm hızlı test için komutu hem yerelde uygular hem server üzerinden diğer client'a gönderir.
