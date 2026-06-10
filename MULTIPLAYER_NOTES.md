# Multiplayer Mimari Notları

Bu v0.1 prototipte multiplayer sunucu yoktur; kod buna uygun olacak şekilde deterministic mantığa yakın tutulmuştur.

Önerilen mimari:

```txt
Node.js WebSocket server
Deterministic lockstep
30 simulation tick / saniye
Sadece oyuncu komutları gönderilir
Her client aynı RNG seed ile simülasyonu yürütür
Her 5 saniyede world hash karşılaştırılır
```

Komut örnekleri:

```json
{"tick": 1020, "playerId": 1, "type": "move", "unitIds": ["unit_1", "unit_2"], "x": 1500, "y": 900}
{"tick": 1110, "playerId": 1, "type": "build", "slotId": "slot_5", "buildingKind": "infantry_barracks"}
{"tick": 1300, "playerId": 1, "type": "cast", "heroId": "hero_3", "abilityId": "blade_arc", "x": 1600, "y": 1100}
```

Sunucu oyun durumunu bilmek zorunda değildir; sadece komut sırası, lobby ve doğrulama görevi üstlenir. Daha güvenli mod için server authoritative simülasyon ikinci aşamada eklenebilir.
