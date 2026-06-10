# Realm Siege RTS Prototype v0.1

Bu paket, düz ana dizin yapısına sahip HTML/CSS/JavaScript RTS prototipidir.

## Çalıştırma

GitHub Pages için dosyaları aynı klasöre yüklemen yeterli:

```txt
index.html
style.css
main.js
game_rules.json
factions.json
units.json
buildings.json
heroes.json
abilities.json
modifiers.json
counter_matrix.json
maps.json
researches.json
```

Yerelde test etmek için klasörde terminal açıp şunu çalıştır:

```bash
python -m http.server 8000
```

Sonra tarayıcıdan aç:

```txt
http://localhost:8000
```

Dosyaya çift tıklayarak açarsan bazı tarayıcılar JSON dosyalarını engelleyebilir. Bu durumda oyun gömülü yedek veriyle açılır; JSON düzenlemelerini görmek için local server veya GitHub Pages kullan.

## Kontroller

- Sol tık: seç
- Sürükle: kutu seçimi
- Sağ tık: hareket / saldırı
- WASD veya ok tuşları: kamera
- Mouse wheel: zoom
- Q/W/E/R: seçili hero yetenekleri
- Space: seçili hero'ya kamera

## İçerik düzenleme

Tüm oyun içeriği ana dizindeki JSON dosyalarından düzenlenebilir:

- `units.json`: birimler, zarlar, attack/defence modifier, hız, range, crit rate
- `buildings.json`: binalar, slot türleri, üretim listeleri, seviye değerleri
- `heroes.json`: hero statları, pasifleri, yetenek listeleri
- `abilities.json`: hero yetenekleri
- `modifiers.json`: CK3 tarzı buff/debuff/aura sistemi
- `counter_matrix.json`: counter ilişkileri
- `factions.json`: ülke/faction bonusları ve hero listeleri
- `maps.json`: başlangıç base'leri, neutral settlement ve resource outpost yerleri
- `game_rules.json`: genel simülasyon ve combat kuralları

## Mevcut özellikler

- 2 oyunculu RTS prototip
- Human vs AI
- Base çevresinde 8 bina slotu
- Wall/tower slotları
- Neutral settlement ve resource outpost capture
- Bina inşa etme
- Bina tamir etme
- Bina upgrade etme
- Üretim kuyruğu
- Battalion sistemi
- Hero sistemi
- Hero skill hotkeyleri
- Mörk Borg tarzı d20 attack/defence çözümü
- Damage die / armor die sistemi
- Counter damage 2x
- Charge bonus damage
- Basit AI: bina kurar, unit üretir, hero çağırır ve dalga saldırısı yapar

## Sonraki paketlerde önerilen geliştirmeler

- Daha güçlü pathfinding
- Gerçek multiplayer lockstep server
- Replay/desync hash sistemi
- Research butonlarının tamamlanması
- Daha gelişmiş AI build order profilleri
- Sprite/asset sistemi
- Ses sistemi
