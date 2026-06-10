// Realm Siege multiplayer lockstep relay stub.
// Bu dosya GitHub Pages için gerekli değildir. Multiplayer test için Node.js server olarak çalışır.
// Kurulum: npm install && npm start

const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8787;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const rooms = new Map();
let clientSeq = 1;

function makeRoom(id) {
  return {
    id,
    seed: Math.floor(Math.random() * 999999999),
    clients: new Map(),
    commands: [],
    createdAt: Date.now()
  };
}

function send(ws, msg) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

function broadcast(room, msg) {
  for (const client of room.clients.values()) send(client.ws, msg);
}

wss.on("connection", ws => {
  const clientId = `c${clientSeq++}`;
  let joinedRoom = null;

  send(ws, { type: "hello", clientId });

  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return send(ws, { type: "error", error: "bad_json" }); }

    if (msg.type === "join") {
      const roomId = String(msg.roomId || "default");
      if (!rooms.has(roomId)) rooms.set(roomId, makeRoom(roomId));
      const room = rooms.get(roomId);
      if (room.clients.size >= 2) return send(ws, { type: "error", error: "room_full" });
      joinedRoom = room;
      const playerId = room.clients.size + 1;
      room.clients.set(clientId, { ws, clientId, playerId });
      send(ws, { type: "joined", roomId, clientId, playerId, seed: room.seed });
      broadcast(room, { type: "room_state", players: [...room.clients.values()].map(c => ({ clientId: c.clientId, playerId: c.playerId })) });
      if (room.clients.size === 2) broadcast(room, { type: "start", seed: room.seed, startTick: 90 });
      return;
    }

    if (!joinedRoom) return send(ws, { type: "error", error: "not_joined" });

    if (msg.type === "command") {
      // Client şu formatta komut gönderir:
      // {type:"command", tick:1234, command:{...}}
      const client = joinedRoom.clients.get(clientId);
      const packet = { type: "command", tick: msg.tick, playerId: client.playerId, command: msg.command };
      joinedRoom.commands.push(packet);
      broadcast(joinedRoom, packet);
      return;
    }

    if (msg.type === "hash") {
      broadcast(joinedRoom, { type: "hash", tick: msg.tick, clientId, hash: msg.hash });
    }
  });

  ws.on("close", () => {
    if (!joinedRoom) return;
    joinedRoom.clients.delete(clientId);
    broadcast(joinedRoom, { type: "player_left", clientId });
    if (joinedRoom.clients.size === 0) rooms.delete(joinedRoom.id);
  });
});

server.listen(PORT, () => {
  console.log(`Realm Siege lockstep relay listening on ws://localhost:${PORT}`);
});
