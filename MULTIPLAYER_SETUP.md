# Multiplayer Stub Kullanımı

Bu paket, gerçek multiplayer için ilk Node.js WebSocket relay iskeletidir. Ana oyuna henüz bağlanmış değildir; ileride `main.js` içindeki komut sistemine bağlanacaktır.

## Çalıştırma

```bash
npm install
npm start
```

Sunucu:

```txt
ws://localhost:8787
```

## Mesaj akışı

Client:

```json
{"type":"join","roomId":"test"}
```

Server:

```json
{"type":"joined","roomId":"test","playerId":1,"seed":123456}
```

Client komutu:

```json
{"type":"command","tick":1234,"command":{"type":"move","unitIds":["unit_1"],"x":1200,"y":900}}
```

Server bütün oyunculara aynı komutu yayınlar.
