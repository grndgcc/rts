(() => {
  "use strict";

  const FILES = {
    rules: "game_rules.json",
    factions: "factions.json",
    units: "units.json",
    buildings: "buildings.json",
    heroes: "heroes.json",
    abilities: "abilities.json",
    modifiers: "modifiers.json",
    counters: "counter_matrix.json",
    maps: "maps.json",
    researches: "researches.json"
  };

  const UNIT_IMAGE_FALLBACKS = {
    heavy_infantry: "heavyinfantry.png",
    skirmisher: "skirmisher.png",
    pikeman: "spearman.png",
    archer: "bowman.png",
    crossbowman: "crossbowman.png",
    spear_thrower: "spearthrower.png",
    light_cavalry: "lightcavalry.png",
    heavy_cavalry: "heavycavalry.png",
    cavalry_archer: "cavalryarcher.png",
    scorpion: "scorpion.png",
    catapult: "mangonel.png",
    trebuchet: "trebuchet.png"
  };

  const DIE_TIERS = ["d2", "d4", "d6", "d8", "d10", "d12"];

  const DEFAULT_DATA = {
    rules: {
      simulation: { ticks_per_second: 30, base_dr: 12, seed: 1337 },
      combat: { counter_damage_multiplier: 2, attack_crit_damage_multiplier: 2, crit_fail_stun_seconds: 2, defence_crit_stun_seconds: 2, minimum_damage: 1, charge_speed_damage_scale: 0.16 },
      battalions: { default_size: 20, formation_spacing: 12, attacks_per_full_battalion: 4, max_member_attacks_per_tick: 20, combat_model: "individual_members" },
      buildings: { base_slots_per_base: 8, wall_tower_slots_per_base: 8, repair_discount: 0.55, normal_buildings_attack_only_at_level: 3, guard_towers_always_attack: true },
      heroes: { unique_per_player: true, max_heroes_per_faction: 3, revive_enabled: true },
      resources: { starting_gold: 3000, starting_command_limit: 100, max_command_limit: 300, base_gold_per_minute: 450 }
    },
    factions: {
      elf_kingdom: { display_name: "Elf Kingdom", color: "#4db67f", heroes: ["eldarenth", "solis", "anarion"], modifiers: { ranged_attack_modifier_add: 1, vision_mult: 1.15 } },
      kingdom_of_darkness: { display_name: "Kingdom of Darkness", color: "#7d2424", heroes: ["orc_champion", "dark_lord", "dragon"], modifiers: { infantry_cost_mult: 0.85 } }
    },
    units: {
      heavy_infantry: { display_name: "Heavy Infantry", category: "infantry", battalion_size: 20, cost: { gold: 350 }, build_time: 18, stats: { hp: 70, armor: 6, attack_modifier: 3, defence_modifier: 3, damage_die: "d8", armor_die: "d8", attack_speed: 1.25, range: 34, crit_rate: 18, speed: 44, charge_damage: 4, vision: 360, command_cost: 2 }, tags: ["infantry", "melee", "armored"] },
      skirmisher: { display_name: "Skirmisher", category: "infantry", battalion_size: 20, cost: { gold: 220 }, build_time: 13, stats: { hp: 45, armor: 3, attack_modifier: 2, defence_modifier: 1, damage_die: "d6", armor_die: "d4", attack_speed: 0.9, range: 30, crit_rate: 18, speed: 62, charge_damage: 3, vision: 380, command_cost: 1 }, tags: ["infantry", "melee", "light"] },
      pikeman: { display_name: "Pikeman", category: "infantry", battalion_size: 20, cost: { gold: 280 }, build_time: 15, stats: { hp: 55, armor: 4, attack_modifier: 2, defence_modifier: 2, damage_die: "d6", armor_die: "d6", attack_speed: 1.35, range: 48, crit_rate: 18, speed: 42, charge_damage: 2, vision: 360, command_cost: 1 }, tags: ["infantry", "melee", "anti_cavalry"] },
      archer: { display_name: "Archer", category: "ranged", battalion_size: 20, cost: { gold: 300 }, build_time: 17, stats: { hp: 36, armor: 2, attack_modifier: 2, defence_modifier: 0, damage_die: "d6", armor_die: "d4", attack_speed: 1.45, range: 270, crit_rate: 20, speed: 48, charge_damage: 0, vision: 470, command_cost: 1 }, tags: ["ranged", "archer", "light"] },
      crossbowman: { display_name: "Crossbowman", category: "ranged", battalion_size: 20, cost: { gold: 380 }, build_time: 22, stats: { hp: 42, armor: 3, attack_modifier: 3, defence_modifier: 0, damage_die: "d8", armor_die: "d4", attack_speed: 2.05, range: 250, crit_rate: 19, speed: 42, charge_damage: 0, vision: 440, command_cost: 2 }, tags: ["ranged", "crossbow"] },
      light_cavalry: { display_name: "Light Cavalry", category: "cavalry", battalion_size: 20, cost: { gold: 520 }, build_time: 24, stats: { hp: 75, armor: 4, attack_modifier: 3, defence_modifier: 1, damage_die: "d8", armor_die: "d6", attack_speed: 1.05, range: 36, crit_rate: 18, speed: 92, charge_damage: 16, vision: 420, command_cost: 3 }, tags: ["cavalry", "melee", "fast"] },
      catapult: { display_name: "Catapult", category: "siege", battalion_size: 3, cost: { gold: 850 }, build_time: 42, stats: { hp: 180, armor: 4, attack_modifier: 3, defence_modifier: -1, damage_die: "d12", armor_die: "d4", attack_speed: 3.2, range: 470, crit_rate: 20, speed: 24, charge_damage: 0, vision: 500, command_cost: 7 }, tags: ["siege", "area", "building_breaker"] }
    },
    buildings: {
      resource_camp: { display_name: "Resource Camp", category: "economy", cost: { gold: 450 }, build_time: 18, max_level: 3, income_gold_per_minute: [180, 260, 360], level_stats: { 1: { hp: 1800, armor_die: "d6", can_attack: false }, 2: { hp: 2500, armor_die: "d8", can_attack: false }, 3: { hp: 3300, armor_die: "d10", can_attack: true, attack: { damage_die: "d6", attack_modifier: 1, attack_speed: 2.2, range: 260, crit_rate: 20 } } } },
      infantry_barracks: { display_name: "Infantry Barracks", category: "production", cost: { gold: 500 }, build_time: 22, max_level: 3, produces: ["heavy_infantry", "skirmisher", "pikeman"], level_stats: { 1: { hp: 2500, armor_die: "d6", production_speed_modifier: 1, can_attack: false }, 2: { hp: 3300, armor_die: "d8", production_speed_modifier: 1.15, can_attack: false }, 3: { hp: 4300, armor_die: "d10", production_speed_modifier: 1.3, can_attack: true, attack: { damage_die: "d6", attack_modifier: 1, attack_speed: 2, range: 260, crit_rate: 20 } } } },
      archery_range: { display_name: "Archery Range", category: "production", cost: { gold: 550 }, build_time: 24, max_level: 3, produces: ["archer", "crossbowman"], level_stats: { 1: { hp: 2200, armor_die: "d6", production_speed_modifier: 1, can_attack: false }, 2: { hp: 3000, armor_die: "d8", production_speed_modifier: 1.12, can_attack: false }, 3: { hp: 3900, armor_die: "d10", production_speed_modifier: 1.25, can_attack: true, attack: { damage_die: "d8", attack_modifier: 2, attack_speed: 1.9, range: 320, crit_rate: 20 } } } },
      guard_tower: { display_name: "Guard Tower", category: "defence", cost: { gold: 450 }, build_time: 20, max_level: 3, level_stats: { 1: { hp: 1600, armor_die: "d6", can_attack: true, attack: { damage_die: "d6", attack_modifier: 2, attack_speed: 1.7, range: 360, crit_rate: 20 } }, 2: { hp: 2300, armor_die: "d8", can_attack: true, attack: { damage_die: "d8", attack_modifier: 3, attack_speed: 1.55, range: 390, crit_rate: 20 } }, 3: { hp: 3100, armor_die: "d10", can_attack: true, attack: { damage_die: "d10", attack_modifier: 4, attack_speed: 1.4, range: 430, crit_rate: 19 } } } }
    },
    heroes: {
      eldarenth: { display_name: "Eldarenth", faction: "elf_kingdom", cost: { gold: 1600 }, build_time: 36, unique: true, stats: { hp: 1800, armor: 8, attack_modifier: 6, defence_modifier: 5, damage_die: "d10", armor_die: "d10", attack_speed: 0.95, range: 42, crit_rate: 18, speed: 68, charge_damage: 12, vision: 520, command_cost: 0 }, tags: ["hero", "infantry", "melee", "commander"], abilities: ["blade_arc", "commanding_shout", "silver_guard"], passive: "eldarenth_leadership", ultimate: "queen_of_the_field" },
      orc_champion: { display_name: "Orc Champion", faction: "kingdom_of_darkness", cost: { gold: 1250 }, build_time: 30, unique: true, stats: { hp: 2100, armor: 7, attack_modifier: 5, defence_modifier: 4, damage_die: "d10", armor_die: "d8", attack_speed: 1.05, range: 42, crit_rate: 18, speed: 58, charge_damage: 14, vision: 460, command_cost: 0 }, tags: ["hero", "infantry", "melee"], abilities: ["warcry", "blade_arc", "dark_curse"], passive: null, ultimate: "arcane_storm" }
    },
    abilities: {
      blade_arc: { display_name: "Blade Arc", hotkey: "Q", targeting: "area_enemy", range: 115, radius: 120, cooldown: 18, effects: [{ type: "area_damage", damage_die: "d10", attack_modifier: 6, damage_multiplier: 10 }] },
      commanding_shout: { display_name: "Commanding Shout", hotkey: "W", targeting: "aura_self", radius: 360, cooldown: 35, effects: [{ type: "apply_modifier", modifier: "commanding_shout_buff" }] },
      silver_guard: { display_name: "Silver Guard", hotkey: "E", targeting: "aura_self", radius: 260, cooldown: 42, effects: [{ type: "apply_modifier", modifier: "holy_barrier_buff" }] },
      queen_of_the_field: { display_name: "Queen of the Field", hotkey: "R", targeting: "aura_self", radius: 520, cooldown: 160, effects: [{ type: "apply_modifier", modifier: "queen_of_the_field_buff" }] },
      warcry: { display_name: "Warcry", hotkey: "Q", targeting: "aura_self", radius: 330, cooldown: 30, effects: [{ type: "apply_modifier", modifier: "orc_warcry_buff" }] },
      dark_curse: { display_name: "Dark Curse", hotkey: "W", targeting: "area_enemy", range: 420, radius: 220, cooldown: 38, effects: [{ type: "apply_modifier_enemy", modifier: "dark_curse_debuff" }] },
      arcane_storm: { display_name: "Arcane Storm", hotkey: "R", targeting: "ground", range: 520, radius: 260, cooldown: 170, effects: [{ type: "area_damage", damage_die: "d12", attack_modifier: 8, damage_multiplier: 18 }] }
    },
    modifiers: {
      eldarenth_leadership: { display_name: "Eldarenth Leadership", scope: "aura", radius: 340, duration: "permanent", effects: { defence_modifier_add: 1, speed_mult: 1.08 }, conditions: { target_owner: "ally", target_tags_any: ["infantry", "cavalry", "ranged"] } },
      commanding_shout_buff: { display_name: "Commanding Shout", duration: 12, effects: { attack_modifier_add: 2, defence_modifier_add: 1 } },
      holy_barrier_buff: { display_name: "Holy Barrier", duration: 10, effects: { defence_modifier_add: 3, armor_die_upgrade: 1 } },
      queen_of_the_field_buff: { display_name: "Queen of the Field", duration: 14, effects: { attack_modifier_add: 3, defence_modifier_add: 3, stun_immunity: true } },
      orc_warcry_buff: { display_name: "Orc Warcry", duration: 10, effects: { attack_modifier_add: 2, speed_mult: 1.12 } },
      dark_curse_debuff: { display_name: "Dark Curse", duration: 12, effects: { defence_modifier_add: -2, speed_mult: 0.82 } }
    },
    counters: {
      heavy_infantry: ["skirmisher", "archer"], skirmisher: ["pikeman"], pikeman: ["light_cavalry"], archer: ["skirmisher", "pikeman"], crossbowman: ["heavy_infantry", "hero"], light_cavalry: ["archer", "crossbowman"], catapult: ["building"]
    },
    maps: {
      duel_plains: { id: "duel_plains", display_name: "Duel Plains", size: { width: 3200, height: 2200 }, players: 2, starting_bases: [{ player_slot: 1, position: { x: 520, y: 1100 }, base_slots: 8, wall_tower_slots: 8 }, { player_slot: 2, position: { x: 2680, y: 1100 }, base_slots: 8, wall_tower_slots: 8 }], neutral_settlements: [{ id: "central_ruins", position: { x: 1600, y: 1100 }, capture_radius: 170, base_slots: 4 }], resource_outposts: [{ id: "north_mine", position: { x: 1600, y: 420 }, capture_radius: 125, income: { gold_per_minute: 180 } }, { id: "south_mine", position: { x: 1600, y: 1780 }, capture_radius: 125, income: { gold_per_minute: 180 } }], decor: [] }
    },
    researches: {}
  };

  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

  class RNG {
    constructor(seed) { this.seed = seed >>> 0; }
    next() {
      this.seed = (1664525 * this.seed + 1013904223) >>> 0;
      return this.seed / 4294967296;
    }
    int(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  }

  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function distXY(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function normalize(dx, dy) {
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len, len };
  }
  function formatGold(cost) { return `${cost?.gold ?? 0}g`; }
  function dieSides(die) { return Number(String(die || "d2").replace("d", "")) || 2; }
  function rollDie(rng, die) { return rng.int(1, dieSides(die)); }
  function lowerDieTier(die) {
    const i = DIE_TIERS.indexOf(die);
    return DIE_TIERS[Math.max(0, i - 1)] || "d2";
  }
  function upgradeDie(die, amount = 1) {
    let i = DIE_TIERS.indexOf(die);
    if (i < 0) i = 0;
    return DIE_TIERS[clamp(i + amount, 0, DIE_TIERS.length - 1)];
  }
  function hasAnyTag(entity, tags) {
    const entityTags = entity.tags || [];
    return tags.some(t => entityTags.includes(t));
  }

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const topEls = {
    gold: document.getElementById("goldText"),
    cp: document.getElementById("cpText"),
    faction: document.getElementById("factionText"),
    status: document.getElementById("statusText")
  };
  const panelTitle = document.getElementById("panelTitle");
  const panelBody = document.getElementById("panelBody");
  const actionButtons = document.getElementById("actionButtons");
  const logBox = document.getElementById("log");

  const game = {
    data: null,
    rng: null,
    running: false,
    lastTime: 0,
    accumulator: 0,
    time: 0,
    tick: 0,
    map: null,
    camera: { x: 0, y: 0, zoom: 1 },
    keys: new Set(),
    mouse: { x: 0, y: 0, wx: 0, wy: 0, down: false, dragStart: null, dragNow: null },
    players: [],
    bases: [],
    slots: [],
    buildings: [],
    units: [],
    effects: [],
    outposts: [],
    settlements: [],
    assets: { unitImages: {} },
    selected: [],
    selectionType: "none",
    idSeq: 1,
    ai: { buildTimer: 0, trainTimer: 0, attackTimer: 18, heroTimer: 8 }
  };

  function nextId(prefix) { return `${prefix}_${game.idSeq++}`; }

  async function loadData() {
    const data = {};
    const entries = Object.entries(FILES);
    try {
      for (const [key, file] of entries) {
        const res = await fetch(`${file}?v=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`${file} okunamadı`);
        data[key] = await res.json();
      }
      log("JSON data dosyaları yüklendi.");
      return data;
    } catch (err) {
      console.warn(err);
      log("JSON okunamadı; gömülü yedek veriyle açıldı. JSON düzenlemelerini test etmek için local server veya GitHub Pages kullan.");
      return deepClone(DEFAULT_DATA);
    }
  }

  async function loadUnitImages() {
    game.assets.unitImages = {};
    const entries = Object.entries(game.data.units || {});
    await Promise.all(entries.map(([kind, def]) => new Promise(resolve => {
      const file = def.image || UNIT_IMAGE_FALLBACKS[kind];
      if (!file) return resolve();
      const img = new Image();
      img.onload = () => { game.assets.unitImages[kind] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = `${file}?v=${Date.now()}`;
    })));
    const loaded = Object.keys(game.assets.unitImages).length;
    if (loaded) log(`${loaded} birim token görseli yüklendi.`);
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  document.getElementById("startBtn").addEventListener("click", async () => {
    document.getElementById("bootScreen").style.display = "none";
    game.data = await loadData();
    await loadUnitImages();
    initGame();
  });

  function initGame() {
    game.rng = new RNG(game.data.rules.simulation.seed || 1337);
    game.map = game.data.maps.duel_plains || Object.values(game.data.maps)[0];
    game.players = [
      makePlayer(1, "Human", "elf_kingdom", false),
      makePlayer(2, "AI", "kingdom_of_darkness", true)
    ];
    setupMap();
    game.camera.x = 0;
    game.camera.y = game.map.size.height / 2 - window.innerHeight / 2;
    game.running = true;
    game.lastTime = performance.now();
    log("Oyun başladı. İlk hedef: slotlara bina kur, birlik üret, merkezi ele geçir.");
    requestAnimationFrame(frame);
  }

  function makePlayer(id, name, factionId, isAI) {
    const rules = game.data.rules.resources;
    const faction = game.data.factions[factionId];
    return {
      id,
      name,
      factionId,
      faction,
      isAI,
      gold: rules.starting_gold,
      commandLimit: rules.starting_command_limit,
      commandUsed: 0,
      researched: new Set(),
      heroBuilt: new Set(),
      defeated: false
    };
  }

  function setupMap() {
    game.bases = [];
    game.slots = [];
    game.buildings = [];
    game.units = [];
    game.outposts = [];
    game.settlements = [];

    for (const b of game.map.starting_bases) {
      const player = getPlayer(b.player_slot);
      const base = {
        id: nextId("base"),
        playerId: player.id,
        x: b.position.x,
        y: b.position.y,
        radius: 235,
        wallHp: 6500,
        wallMaxHp: 6500,
        wallArmorDie: "d8"
      };
      game.bases.push(base);
      createCitadel(base);
      createSlotsAroundBase(base, b.base_slots || 8, false);
      createSlotsAroundBase(base, b.wall_tower_slots || 8, true);
    }

    for (const o of game.map.resource_outposts || []) {
      game.outposts.push({ ...deepClone(o), ownerId: 0, progress: 0 });
    }
    for (const s of game.map.neutral_settlements || []) {
      const settlement = { ...deepClone(s), ownerId: 0, progress: 0, slots: [] };
      game.settlements.push(settlement);
      const n = s.base_slots || 4;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.PI / 4;
        const slot = {
          id: nextId("slot"),
          playerId: 0,
          settlementId: settlement.id,
          x: s.position.x + Math.cos(angle) * 115,
          y: s.position.y + Math.sin(angle) * 115,
          radius: 28,
          wall: false,
          buildingId: null,
          type: "settlement"
        };
        game.slots.push(slot);
        settlement.slots.push(slot.id);
      }
    }

    const p1Base = game.bases.find(b => b.playerId === 1);
    const p2Base = game.bases.find(b => b.playerId === 2);
    spawnBattalion(1, "heavy_infantry", p1Base.x + 180, p1Base.y - 70);
    spawnBattalion(1, "archer", p1Base.x + 180, p1Base.y + 70);
    spawnHero(1, "eldarenth", p1Base.x + 120, p1Base.y);
    spawnBattalion(2, "skirmisher", p2Base.x - 180, p2Base.y - 80);
    spawnBattalion(2, "archer", p2Base.x - 180, p2Base.y + 70);
    spawnHero(2, "orc_champion", p2Base.x - 120, p2Base.y);
  }

  function createCitadel(base) {
    const building = {
      id: nextId("building"),
      kind: "citadel",
      displayName: "Citadel",
      playerId: base.playerId,
      x: base.x,
      y: base.y,
      radius: 62,
      level: 1,
      maxLevel: 3,
      hp: 6200,
      maxHp: 6200,
      armorDie: "d10",
      built: true,
      buildProgress: 1,
      buildTime: 0,
      slotId: null,
      baseId: base.id,
      queue: [],
      attackCooldown: 0,
      tags: ["building", "citadel"],
      attack: { damage_die: "d8", attack_modifier: 3, attack_speed: 1.8, range: 380, crit_rate: 20 }
    };
    game.buildings.push(building);
  }

  function createSlotsAroundBase(base, count, wall) {
    const radius = wall ? base.radius + 35 : 135;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      game.slots.push({
        id: nextId("slot"),
        playerId: base.playerId,
        baseId: base.id,
        x: base.x + Math.cos(angle) * radius,
        y: base.y + Math.sin(angle) * radius,
        radius: wall ? 22 : 30,
        wall,
        buildingId: null,
        type: wall ? "wall" : "base"
      });
    }
  }

  function getPlayer(id) { return game.players.find(p => p.id === id); }
  function getFactionColor(playerId) { return getPlayer(playerId)?.faction?.color || "#aaa"; }

  function getBuildingDef(kind) { return game.data.buildings[kind]; }
  function getUnitDef(kind) { return game.data.units[kind]; }
  function getHeroDef(kind) { return game.data.heroes[kind]; }

  function getBuildingLevelStats(building) {
    if (building.kind === "citadel") return null;
    const def = getBuildingDef(building.kind);
    return def.level_stats[String(building.level)] || def.level_stats[building.level];
  }

  function buildInSlot(slot, buildingKind) {
    const player = getPlayer(1);
    if (slot.playerId !== 1 && slot.playerId !== 0) return;
    if (slot.playerId === 0) return log("Önce bu neutral settlement'ı ele geçir.");
    if (slot.buildingId) return;
    const def = getBuildingDef(buildingKind);
    if (!def) return;
    if (slot.wall && buildingKind !== "guard_tower") return log("Sur slotlarına sadece Guard Tower kurulabilir.");
    if (!slot.wall && def.slot_type === "base_slot_or_wall_slot" && buildingKind === "guard_tower") {
      // allowed
    }
    const cost = def.cost?.gold || 0;
    if (player.gold < cost) return log("Yetersiz gold.");
    player.gold -= cost;
    const levelStats = def.level_stats["1"] || def.level_stats[1];
    const building = {
      id: nextId("building"),
      kind: buildingKind,
      displayName: def.display_name,
      playerId: slot.playerId,
      x: slot.x,
      y: slot.y,
      radius: slot.wall ? 26 : 38,
      level: 1,
      maxLevel: def.max_level || 3,
      hp: levelStats.hp * 0.12,
      maxHp: levelStats.hp,
      armorDie: levelStats.armor_die,
      built: false,
      buildProgress: 0,
      buildTime: def.build_time || 20,
      slotId: slot.id,
      queue: [],
      attackCooldown: 0,
      tags: ["building", def.category, slot.wall ? "tower" : "structure"],
      attack: levelStats.attack || null
    };
    game.buildings.push(building);
    slot.buildingId = building.id;
    log(`${def.display_name} inşaatı başladı.`);
    selectSingle(building);
  }

  function upgradeBuilding(building) {
    const player = getPlayer(building.playerId);
    if (building.playerId !== 1 || building.kind === "citadel") return;
    const def = getBuildingDef(building.kind);
    if (building.level >= (def.max_level || 3)) return log("Bina zaten son seviyede.");
    const cost = Math.round((def.cost?.gold || 400) * 0.75 * building.level);
    if (player.gold < cost) return log("Yetersiz gold.");
    player.gold -= cost;
    building.level++;
    const stats = getBuildingLevelStats(building);
    const hpRatio = building.hp / building.maxHp;
    building.maxHp = stats.hp;
    building.hp = Math.max(1, Math.round(building.maxHp * hpRatio + building.maxHp * 0.18));
    building.armorDie = stats.armor_die;
    building.attack = stats.attack || null;
    log(`${building.displayName} seviye ${building.level} oldu.`);
    updatePanel();
  }

  function repairBuilding(building) {
    if (building.playerId !== 1) return;
    const player = getPlayer(1);
    if (building.hp >= building.maxHp) return log("Tamir gerekmiyor.");
    let baseCost = 900;
    if (building.kind !== "citadel") baseCost = getBuildingDef(building.kind)?.cost?.gold || 600;
    const missingRatio = 1 - building.hp / building.maxHp;
    const cost = Math.ceil(baseCost * missingRatio * game.data.rules.buildings.repair_discount);
    if (player.gold < cost) return log("Yetersiz gold.");
    player.gold -= cost;
    building.hp = building.maxHp;
    log(`${building.displayName} ${cost} gold karşılığında tamir edildi.`);
    updatePanel();
  }

  function trainUnit(building, unitKind) {
    const player = getPlayer(building.playerId);
    if (building.playerId !== 1 && !player.isAI) return;
    const def = getUnitDef(unitKind);
    if (!def || !building.built) return;
    const cost = computeCost(player, def, def.category);
    const cp = (def.stats.command_cost || 1) * (def.battalion_size || game.data.rules.battalions.default_size);
    if (player.gold < cost) return log("Yetersiz gold.");
    if (player.commandUsed + cp > player.commandLimit) return log("Command point limiti dolu.");
    player.gold -= cost;
    const levelStats = getBuildingLevelStats(building);
    const speedMod = levelStats?.production_speed_modifier || 1;
    building.queue.push({ type: "unit", kind: unitKind, progress: 0, time: (def.build_time || 20) / speedMod });
    if (building.playerId === 1) log(`${def.display_name} üretim kuyruğuna eklendi.`);
    updatePanel();
  }

  function trainHero(building, heroKind) {
    const player = getPlayer(building.playerId);
    const def = getHeroDef(heroKind);
    if (!def || !building.built) return;
    if (def.faction !== player.factionId) return;
    if (player.heroBuilt.has(heroKind)) return log("Bu hero zaten çağrıldı.");
    const cost = def.cost?.gold || 1000;
    if (player.gold < cost) return log("Yetersiz gold.");
    player.gold -= cost;
    player.heroBuilt.add(heroKind);
    building.queue.push({ type: "hero", kind: heroKind, progress: 0, time: def.build_time || 35 });
    if (building.playerId === 1) log(`${def.display_name} çağrılıyor.`);
    updatePanel();
  }

  function computeCost(player, def, category) {
    let cost = def.cost?.gold || 0;
    const mods = player.faction.modifiers || {};
    if (category === "infantry" && mods.infantry_cost_mult) cost *= mods.infantry_cost_mult;
    if (def.category && mods.unit_cost_mult) cost *= mods.unit_cost_mult;
    return Math.ceil(cost);
  }

  function spawnBattalion(playerId, unitKind, x, y) {
    const def = getUnitDef(unitKind);
    if (!def) return null;
    const count = def.battalion_size || game.data.rules.battalions.default_size;
    const stats = deepClone(def.stats);
    const player = getPlayer(playerId);
    const hpMax = stats.hp * count;
    const unit = {
      id: nextId("unit"),
      entityType: "unit",
      unitType: unitKind,
      displayName: def.display_name,
      playerId,
      x, y,
      radius: Math.max(24, 16 + Math.sqrt(count) * 4),
      count,
      maxCount: count,
      memberHp: stats.hp,
      hp: hpMax,
      maxHp: hpMax,
      members: createBattalionMembers(count, stats),
      image: def.image || UNIT_IMAGE_FALLBACKS[unitKind] || null,
      baseStats: stats,
      tags: def.tags || [],
      targetX: x,
      targetY: y,
      targetId: null,
      attackCooldown: 0,
      stunTimer: 0,
      activeModifiers: [],
      isHero: false,
      isCharging: false,
      chargeReady: false,
      selected: false
    };
    game.units.push(unit);
    player.commandUsed += (stats.command_cost || 1) * count;
    return unit;
  }

  function createBattalionMembers(count, stats) {
    const members = [];
    const spacing = game.data?.rules?.battalions?.formation_spacing || 14;
    const cols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const ox = (col - (cols - 1) / 2) * spacing;
      const oy = (row - (Math.ceil(count / cols) - 1) / 2) * spacing;
      members.push({
        hp: stats.hp,
        maxHp: stats.hp,
        ox,
        oy,
        attackCooldown: game.rng ? game.rng.next() * Math.max(0.25, stats.attack_speed || 1) : 0,
        stunTimer: 0
      });
    }
    return members;
  }

  function syncBattalionHp(unit) {
    if (!unit.members) return;
    unit.hp = unit.members.reduce((sum, m) => sum + Math.max(0, m.hp), 0);
    unit.count = getLivingCount(unit);
  }

  function spawnHero(playerId, heroKind, x, y) {
    const def = getHeroDef(heroKind);
    if (!def) return null;
    const player = getPlayer(playerId);
    player.heroBuilt.add(heroKind);
    const stats = deepClone(def.stats);
    const hero = {
      id: nextId("hero"),
      entityType: "unit",
      unitType: "hero",
      heroType: heroKind,
      displayName: def.display_name,
      playerId,
      x, y,
      radius: 24,
      count: 1,
      maxCount: 1,
      memberHp: stats.hp,
      hp: stats.hp,
      maxHp: stats.hp,
      baseStats: stats,
      tags: def.tags || ["hero"],
      abilities: [...(def.abilities || []), def.ultimate].filter(Boolean),
      passive: def.passive || null,
      abilityCooldowns: {},
      targetX: x,
      targetY: y,
      targetId: null,
      attackCooldown: 0,
      stunTimer: 0,
      activeModifiers: [],
      isHero: true,
      isCharging: false,
      chargeReady: false,
      selected: false
    };
    for (const a of hero.abilities) hero.abilityCooldowns[a] = 0;
    game.units.push(hero);
    return hero;
  }

  function frame(now) {
    if (!game.running) return;
    const rawDt = Math.min(0.1, (now - game.lastTime) / 1000);
    game.lastTime = now;
    const tickDt = 1 / game.data.rules.simulation.ticks_per_second;
    game.accumulator += rawDt;
    updateCamera(rawDt);
    while (game.accumulator >= tickDt) {
      updateSimulation(tickDt);
      game.accumulator -= tickDt;
    }
    render();
    requestAnimationFrame(frame);
  }

  function updateSimulation(dt) {
    game.time += dt;
    game.tick++;
    updateEconomy(dt);
    updateConstructionAndQueues(dt);
    updateUnits(dt);
    updateBuildingsCombat(dt);
    updateCapturePoints(dt);
    updateEffects(dt);
    updateAI(dt);
    cleanDead();
    updateTopbar();
  }

  function updateEconomy(dt) {
    for (const player of game.players) {
      if (player.defeated) continue;
      let income = game.data.rules.resources.base_gold_per_minute;
      for (const b of game.buildings) {
        if (b.playerId !== player.id || !b.built || b.kind === "citadel") continue;
        const def = getBuildingDef(b.kind);
        if (def?.income_gold_per_minute) income += def.income_gold_per_minute[b.level - 1] || 0;
      }
      for (const o of game.outposts) {
        if (o.ownerId === player.id) income += o.income?.gold_per_minute || 0;
      }
      if (player.faction.modifiers?.resource_income_mult) income *= player.faction.modifiers.resource_income_mult;
      player.gold += income * dt / 60;
    }
  }

  function updateConstructionAndQueues(dt) {
    for (const b of game.buildings) {
      if (!b.built) {
        b.buildProgress += dt / Math.max(1, b.buildTime);
        b.hp = Math.min(b.maxHp, Math.max(b.hp, b.maxHp * b.buildProgress));
        if (b.buildProgress >= 1) {
          b.built = true;
          b.hp = b.maxHp;
          if (b.playerId === 1) log(`${b.displayName} tamamlandı.`);
        }
        continue;
      }
      if (b.queue.length > 0) {
        const item = b.queue[0];
        item.progress += dt / item.time;
        if (item.progress >= 1) {
          b.queue.shift();
          const spawn = findSpawnPointNear(b.x, b.y, b.playerId);
          if (item.type === "unit") spawnBattalion(b.playerId, item.kind, spawn.x, spawn.y);
          if (item.type === "hero") spawnHero(b.playerId, item.kind, spawn.x, spawn.y);
          if (b.playerId === 1) log(`${item.kind} hazır.`);
        }
      }
    }
  }

  function findSpawnPointNear(x, y, playerId) {
    const base = game.bases.find(b => b.playerId === playerId);
    const away = base ? normalize(x - base.x, y - base.y) : { x: 1, y: 0 };
    return { x: x + away.x * 80 + game.rng.int(-20, 20), y: y + away.y * 80 + game.rng.int(-20, 20) };
  }

  function updateBattalionMembers(unit, dt) {
    if (!unit.members) return;
    for (const m of unit.members) {
      if (m.hp <= 0) continue;
      m.attackCooldown = Math.max(0, m.attackCooldown - dt);
      m.stunTimer = Math.max(0, m.stunTimer - dt);
    }
  }

  function chooseLivingMemberIndex(unit) {
    if (!unit.members) return -1;
    const damaged = [];
    const living = [];
    for (let i = 0; i < unit.members.length; i++) {
      const m = unit.members[i];
      if (m.hp <= 0) continue;
      living.push(i);
      if (m.hp < m.maxHp) damaged.push(i);
    }
    const pool = damaged.length ? damaged : living;
    if (!pool.length) return -1;
    return pool[game.rng.int(0, pool.length - 1)];
  }

  function applyDamageToBattalionMember(unit, amount, preferredIndex = -1) {
    if (!unit.members) return 0;
    let idx = preferredIndex;
    if (idx < 0 || !unit.members[idx] || unit.members[idx].hp <= 0) idx = chooseLivingMemberIndex(unit);
    if (idx < 0) return 0;
    const m = unit.members[idx];
    const before = m.hp;
    m.hp = Math.max(0, m.hp - amount);
    syncBattalionHp(unit);
    return before - m.hp;
  }

  function getReadyMemberIndexes(unit) {
    if (!unit.members) return [];
    const ready = [];
    for (let i = 0; i < unit.members.length; i++) {
      const m = unit.members[i];
      if (m.hp > 0 && m.attackCooldown <= 0 && m.stunTimer <= 0) ready.push(i);
    }
    return ready;
  }

  function resolveBattalionAttacks(attacker, defender, stats) {
    const ready = getReadyMemberIndexes(attacker);
    if (!ready.length) return;
    const maxPerTick = game.data.rules.battalions.max_member_attacks_per_tick || 20;
    let totalDamage = 0;
    let critSeen = false;
    let attacks = 0;
    for (const index of ready.slice(0, maxPerTick)) {
      if (!isAlive(defender)) break;
      const m = attacker.members[index];
      const result = resolveCombatAttack(attacker, defender, { memberIndex: index, suppressFloating: true });
      if (result?.damage) totalDamage += result.damage;
      if (result?.attackCrit) critSeen = true;
      const jitter = 0.88 + game.rng.next() * 0.24;
      m.attackCooldown = Math.max(0.18, (stats.attack_speed || 1) * jitter);
      attacks++;
    }
    if (totalDamage > 0) {
      addFloatingText(defender.x, defender.y - defender.radius - 8, critSeen ? `CRIT ${Math.round(totalDamage)}` : `${Math.round(totalDamage)}`, critSeen ? "#ffd36e" : "#fff2d4");
    } else if (attacks > 0 && game.rng.int(1, 5) === 1) {
      addFloatingText(defender.x, defender.y - defender.radius - 8, "BLOCK", "#b8d8ff");
    }
  }

  function updateUnits(dt) {
    applyAuras();
    for (const u of game.units) {
      updateBattalionMembers(u, dt);
      for (const key of Object.keys(u.abilityCooldowns || {})) u.abilityCooldowns[key] = Math.max(0, u.abilityCooldowns[key] - dt);
      u.activeModifiers = (u.activeModifiers || []).filter(m => {
        if (m.remaining === "permanent") return true;
        m.remaining -= dt;
        return m.remaining > 0;
      });
      if (u.stunTimer > 0) {
        const stats = getFinalStats(u);
        if (!stats.stun_immunity) u.stunTimer = Math.max(0, u.stunTimer - dt);
        else u.stunTimer = 0;
        continue;
      }
      u.attackCooldown = Math.max(0, u.attackCooldown - dt);
      let target = findEntityById(u.targetId);
      if (!target || !isAlive(target) || target.playerId === u.playerId) {
        target = acquireTarget(u);
        u.targetId = target?.id || null;
      }
      if (target) {
        const stats = getFinalStats(u);
        const d = distXY(u.x, u.y, target.x, target.y);
        const desiredRange = stats.range + (target.radius || 0);
        if (d <= desiredRange) {
          u.isCharging = false;
          if (u.isHero) {
            if (u.attackCooldown <= 0) {
              resolveCombatAttack(u, target);
              u.attackCooldown = Math.max(0.25, stats.attack_speed);
            }
          } else {
            resolveBattalionAttacks(u, target, stats);
          }
        } else {
          moveToward(u, target.x, target.y, dt);
        }
      } else {
        const d = distXY(u.x, u.y, u.targetX, u.targetY);
        if (d > 5) moveToward(u, u.targetX, u.targetY, dt);
        else u.isCharging = false;
      }
      u.x = clamp(u.x, 20, game.map.size.width - 20);
      u.y = clamp(u.y, 20, game.map.size.height - 20);
    }
  }

  function moveToward(u, tx, ty, dt) {
    const stats = getFinalStats(u);
    const n = normalize(tx - u.x, ty - u.y);
    const step = Math.min(n.len, stats.speed * dt);
    u.x += n.x * step;
    u.y += n.y * step;
    const movedFast = stats.speed > 65 && n.len > 80;
    if (movedFast && !u.isCharging) {
      u.isCharging = true;
      u.chargeReady = true;
    }
  }

  function getFinalStats(entity) {
    const s = deepClone(entity.baseStats || {});
    if (!s.damage_die && entity.attack) {
      s.damage_die = entity.attack.damage_die;
      s.attack_modifier = entity.attack.attack_modifier || 0;
      s.attack_speed = entity.attack.attack_speed || 2;
      s.range = entity.attack.range || 250;
      s.crit_rate = entity.attack.crit_rate || 20;
      s.defence_modifier = 0;
      s.armor_die = entity.armorDie || "d6";
      s.speed = 0;
      s.vision = entity.attack.range || 300;
    }
    const player = getPlayer(entity.playerId);
    const factionMods = player?.faction?.modifiers || {};
    if (entity.tags?.includes("ranged") && factionMods.ranged_attack_modifier_add) s.attack_modifier += factionMods.ranged_attack_modifier_add;
    if (factionMods.vision_mult) s.vision = Math.round(s.vision * factionMods.vision_mult);
    if (entity.unitType === "heavy_infantry" && factionMods.heavy_infantry_defence_modifier_add) s.defence_modifier += factionMods.heavy_infantry_defence_modifier_add;
    if (entity.unitType === "heavy_cavalry" && factionMods.heavy_cavalry_charge_damage_add) s.charge_damage += factionMods.heavy_cavalry_charge_damage_add;

    let speedMult = 1;
    for (const active of entity.activeModifiers || []) {
      const mod = game.data.modifiers[active.id];
      if (!mod) continue;
      const e = mod.effects || {};
      if (e.attack_modifier_add) s.attack_modifier += e.attack_modifier_add;
      if (e.defence_modifier_add) s.defence_modifier += e.defence_modifier_add;
      if (e.speed_mult) speedMult *= e.speed_mult;
      if (e.armor_die_upgrade) s.armor_die = upgradeDie(s.armor_die, e.armor_die_upgrade);
      if (e.stun_immunity) s.stun_immunity = true;
    }
    s.speed *= speedMult;
    return s;
  }

  function applyAuras() {
    for (const u of game.units) {
      u.activeModifiers = (u.activeModifiers || []).filter(m => !m.aura);
    }
    for (const hero of game.units) {
      if (!hero.isHero || !hero.passive) continue;
      const mod = game.data.modifiers[hero.passive];
      if (!mod || mod.scope !== "aura") continue;
      for (const target of game.units) {
        if (target.playerId !== hero.playerId) continue;
        if (target.id === hero.id) continue;
        if (distance(hero, target) > mod.radius) continue;
        const cond = mod.conditions || {};
        if (cond.target_tags_any && !hasAnyTag(target, cond.target_tags_any)) continue;
        target.activeModifiers.push({ id: hero.passive, remaining: "permanent", aura: true, sourceId: hero.id });
      }
    }
  }

  function acquireTarget(u) {
    const stats = getFinalStats(u);
    let best = null;
    let bestD = Infinity;
    const candidates = [...game.units, ...game.buildings];
    for (const e of candidates) {
      if (e.id === u.id || e.playerId === u.playerId || !isAlive(e)) continue;
      const d = distXY(u.x, u.y, e.x, e.y);
      if (d < bestD && d <= (stats.vision || 360)) {
        best = e;
        bestD = d;
      }
    }
    return best;
  }

  function getBuildingAttack(b) {
    if (b.kind === "citadel") return b.attack;
    const stats = getBuildingLevelStats(b);
    return stats?.can_attack ? stats.attack : null;
  }

  function updateBuildingsCombat(dt) {
    for (const b of game.buildings) {
      if (!b.built || !isAlive(b)) continue;
      b.attackCooldown = Math.max(0, b.attackCooldown - dt);
      const attack = getBuildingAttack(b);
      if (!attack) continue;
      const target = nearestEnemyUnit(b.x, b.y, b.playerId, attack.range);
      if (target && b.attackCooldown <= 0) {
        const pseudo = {
          id: b.id,
          playerId: b.playerId,
          unitType: "building",
          displayName: b.displayName,
          x: b.x,
          y: b.y,
          radius: b.radius,
          hp: b.hp,
          maxHp: b.maxHp,
          tags: b.tags,
          attack,
          baseStats: null,
          activeModifiers: [],
          stunTimer: 0,
          isCharging: false,
          chargeReady: false
        };
        resolveCombatAttack(pseudo, target);
        b.attackCooldown = Math.max(0.5, attack.attack_speed);
      }
    }
  }

  function nearestEnemyUnit(x, y, playerId, range) {
    let best = null, bestD = Infinity;
    for (const u of game.units) {
      if (u.playerId === playerId || !isAlive(u)) continue;
      const d = distXY(x, y, u.x, u.y);
      if (d < bestD && d <= range + u.radius) { best = u; bestD = d; }
    }
    return best;
  }

  function resolveCombatAttack(attacker, defender, options = {}) {
    if (!isAlive(attacker) || !isAlive(defender)) return { result: "dead" };
    const rules = game.data.rules;
    const atkStats = getFinalStats(attacker);
    const defStats = getFinalStats(defender);
    const attackerMember = attacker.members && options.memberIndex !== undefined ? attacker.members[options.memberIndex] : null;
    const targetMemberIndex = defender.members ? chooseLivingMemberIndex(defender) : -1;

    const attackRoll = game.rng.int(1, 20);
    if (attackRoll === 1) {
      if (attackerMember) attackerMember.stunTimer = rules.combat.crit_fail_stun_seconds;
      else if (attacker.stunTimer !== undefined) attacker.stunTimer = rules.combat.crit_fail_stun_seconds;
      if (!options.suppressFloating) addFloatingText(attacker.x, attacker.y - 20, "FAIL", "#ff9b70");
      return { result: "attack_crit_fail", damage: 0 };
    }
    const attackTotal = attackRoll + (atkStats.attack_modifier || 0);
    if (attackTotal < rules.simulation.base_dr) return { result: "miss", damage: 0 };
    const attackCrit = attackRoll >= (atkStats.crit_rate || 20);

    const defenceRoll = game.rng.int(1, 20);
    if (defenceRoll === 1) {
      if (defender.members && targetMemberIndex >= 0) defender.members[targetMemberIndex].stunTimer = rules.combat.crit_fail_stun_seconds;
      else if (defender.stunTimer !== undefined) defender.stunTimer = rules.combat.crit_fail_stun_seconds;
      if (!options.suppressFloating) addFloatingText(defender.x, defender.y - 20, "STUN", "#b8d8ff");
    }
    const defenceTotal = defenceRoll + (defStats.defence_modifier || 0);
    if (defenceRoll === 20 || defenceTotal >= rules.simulation.base_dr) {
      if (defenceRoll === 20) {
        if (attackerMember) attackerMember.stunTimer = rules.combat.defence_crit_stun_seconds;
        else if (attacker.stunTimer !== undefined) attacker.stunTimer = rules.combat.defence_crit_stun_seconds;
        if (!options.suppressFloating) addFloatingText(attacker.x, attacker.y - 20, "PARRY", "#b8d8ff");
      }
      return { result: defenceRoll === 20 ? "defence_crit_block" : "blocked", damage: 0 };
    }

    let armorDie = defStats.armor_die || defender.armorDie || "d2";
    if (attackCrit) armorDie = lowerDieTier(armorDie);
    const damageRoll = rollDie(game.rng, atkStats.damage_die || "d4");
    const armorRoll = rollDie(game.rng, armorDie);
    let totalDamage = Math.max(rules.combat.minimum_damage, damageRoll - armorRoll);
    if (isCounter(attacker, defender)) totalDamage *= rules.combat.counter_damage_multiplier;
    if (attackCrit) totalDamage *= rules.combat.attack_crit_damage_multiplier;

    if (attacker.isCharging && attacker.chargeReady) {
      totalDamage += Math.round((atkStats.speed || 0) * rules.combat.charge_speed_damage_scale + (atkStats.charge_damage || 0));
      attacker.chargeReady = false;
    }
    if (defender.tags?.includes("building") || defender.entityType === "building") totalDamage *= 7;
    totalDamage = Math.round(totalDamage);
    const applied = damageEntity(defender, totalDamage, attacker, { memberIndex: targetMemberIndex });
    if (!options.suppressFloating) {
      addFloatingText(defender.x, defender.y - defender.radius - 8, attackCrit ? `CRIT ${Math.round(applied || totalDamage)}` : `${Math.round(applied || totalDamage)}`, attackCrit ? "#ffd36e" : "#fff2d4");
    }
    return { result: "hit", damage: applied || totalDamage, attackCrit };
  }

  function isCounter(attacker, defender) {
    const matrix = game.data.counters || {};
    const atkType = attacker.unitType || "building";
    const defTypes = [defender.unitType, ...(defender.tags || [])].filter(Boolean);
    const list = matrix[atkType] || [];
    return defTypes.some(t => list.includes(t));
  }

  function damageEntity(entity, amount, source, options = {}) {
    let applied = amount;
    if (entity.members && !entity.isHero) {
      applied = applyDamageToBattalionMember(entity, amount, options.memberIndex ?? -1);
    } else {
      entity.hp -= amount;
    }
    if (entity.hp <= 0) {
      entity.hp = 0;
      if (entity.playerId === 1) log(`${entity.displayName} kaybedildi.`);
      if (source?.playerId === 1) log(`${entity.displayName} yok edildi.`);
    }
    return applied;
  }

  function getLivingCount(u) {
    if (u.isHero) return 1;
    if (u.members) return u.members.filter(m => m.hp > 0).length;
    return clamp(Math.ceil(u.hp / u.memberHp), 0, u.maxCount);
  }

  function isAlive(e) { return e && e.hp > 0; }

  function findEntityById(id) {
    if (!id) return null;
    return game.units.find(u => u.id === id) || game.buildings.find(b => b.id === id) || null;
  }

  function cleanDead() {
    for (const u of game.units) {
      if (u.hp <= 0 && !u._deadHandled) {
        u._deadHandled = true;
        const p = getPlayer(u.playerId);
        if (!u.isHero) p.commandUsed = Math.max(0, p.commandUsed - (u.baseStats.command_cost || 1) * u.maxCount);
      }
    }
    game.units = game.units.filter(u => u.hp > 0);
    for (const b of game.buildings) {
      if (b.hp <= 0 && b.slotId) {
        const slot = game.slots.find(s => s.id === b.slotId);
        if (slot) slot.buildingId = null;
      }
    }
    game.buildings = game.buildings.filter(b => b.hp > 0);
    game.selected = game.selected.filter(isAlive);
    checkDefeat();
  }

  function checkDefeat() {
    for (const p of game.players) {
      if (p.defeated) continue;
      const citadel = game.buildings.find(b => b.kind === "citadel" && b.playerId === p.id);
      if (!citadel) {
        p.defeated = true;
        log(`${p.name} yenildi.`);
      }
    }
  }

  function updateCapturePoints(dt) {
    for (const o of [...game.outposts, ...game.settlements]) {
      const counts = { 1: 0, 2: 0 };
      for (const u of game.units) {
        if (distance(u, { x: o.position.x, y: o.position.y }) <= (o.capture_radius || 120)) counts[u.playerId] = (counts[u.playerId] || 0) + 1;
      }
      let capturing = 0;
      if (counts[1] > 0 && counts[2] === 0) capturing = 1;
      if (counts[2] > 0 && counts[1] === 0) capturing = 2;
      if (capturing && o.ownerId !== capturing) {
        o.progress += dt * 22;
        if (o.progress >= 100) {
          o.ownerId = capturing;
          o.progress = 0;
          if (o.slots) {
            for (const sid of o.slots) {
              const slot = game.slots.find(s => s.id === sid);
              if (slot) slot.playerId = capturing;
            }
          }
          log(`${o.id} ${getPlayer(capturing).name} tarafından ele geçirildi.`);
        }
      } else {
        o.progress = Math.max(0, o.progress - dt * 10);
      }
    }
  }

  function updateEffects(dt) {
    game.effects = game.effects.filter(e => {
      e.life -= dt;
      if (e.vy) e.y += e.vy * dt;
      return e.life > 0;
    });
  }

  function updateAI(dt) {
    const ai = getPlayer(2);
    if (!ai || ai.defeated) return;
    game.ai.buildTimer -= dt;
    game.ai.trainTimer -= dt;
    game.ai.attackTimer -= dt;
    game.ai.heroTimer -= dt;
    if (game.ai.buildTimer <= 0) {
      game.ai.buildTimer = 6;
      aiBuildLogic(ai);
    }
    if (game.ai.trainTimer <= 0) {
      game.ai.trainTimer = 3;
      aiTrainLogic(ai);
    }
    if (game.ai.heroTimer <= 0) {
      game.ai.heroTimer = 18;
      aiHeroLogic(ai);
    }
    if (game.ai.attackTimer <= 0) {
      game.ai.attackTimer = 42;
      aiAttackWave(ai);
    }
  }

  function aiBuildLogic(ai) {
    const slots = game.slots.filter(s => s.playerId === ai.id && !s.buildingId && !s.wall);
    if (!slots.length) return;
    const order = ["resource_camp", "infantry_barracks", "archery_range", "guard_tower", "stable", "siege_workshop"].filter(k => game.data.buildings[k]);
    const kind = order[game.rng.int(0, Math.min(order.length - 1, 3))];
    const def = getBuildingDef(kind);
    if (ai.gold < (def.cost?.gold || 0)) return;
    const slot = slots[0];
    ai.gold -= def.cost.gold;
    const levelStats = def.level_stats["1"] || def.level_stats[1];
    const building = { id: nextId("building"), kind, displayName: def.display_name, playerId: ai.id, x: slot.x, y: slot.y, radius: 38, level: 1, maxLevel: def.max_level || 3, hp: levelStats.hp * 0.25, maxHp: levelStats.hp, armorDie: levelStats.armor_die, built: false, buildProgress: 0.25, buildTime: def.build_time || 20, slotId: slot.id, queue: [], attackCooldown: 0, tags: ["building", def.category], attack: levelStats.attack || null };
    slot.buildingId = building.id;
    game.buildings.push(building);
  }

  function aiTrainLogic(ai) {
    const producers = game.buildings.filter(b => b.playerId === ai.id && b.built && b.queue.length < 2 && b.kind !== "citadel");
    for (const b of producers) {
      const def = getBuildingDef(b.kind);
      if (!def?.produces?.length) continue;
      const kind = def.produces[game.rng.int(0, def.produces.length - 1)];
      trainUnit(b, kind);
    }
  }

  function aiHeroLogic(ai) {
    const citadel = game.buildings.find(b => b.playerId === ai.id && b.kind === "citadel");
    if (!citadel || citadel.queue.length > 0) return;
    const hero = ai.faction.heroes.find(h => !ai.heroBuilt.has(h) && game.data.heroes[h]);
    if (hero) trainHero(citadel, hero);
  }

  function aiAttackWave(ai) {
    const playerBase = game.bases.find(b => b.playerId === 1);
    const army = game.units.filter(u => u.playerId === ai.id);
    if (army.length < 3) return;
    for (const u of army) {
      u.targetX = playerBase.x + game.rng.int(-160, 160);
      u.targetY = playerBase.y + game.rng.int(-160, 160);
      u.targetId = null;
    }
    log("AI saldırı dalgası gönderdi.");
  }

  function updateCamera(dt) {
    const speed = 620 * dt / game.camera.zoom;
    if (game.keys.has("KeyA") || game.keys.has("ArrowLeft")) game.camera.x -= speed;
    if (game.keys.has("KeyD") || game.keys.has("ArrowRight")) game.camera.x += speed;
    if (game.keys.has("KeyW") || game.keys.has("ArrowUp")) game.camera.y -= speed;
    if (game.keys.has("KeyS") || game.keys.has("ArrowDown")) game.camera.y += speed;
    if (game.map) {
      game.camera.x = clamp(game.camera.x, -100, game.map.size.width - window.innerWidth / game.camera.zoom + 100);
      game.camera.y = clamp(game.camera.y, -100, game.map.size.height - window.innerHeight / game.camera.zoom + 100);
    }
  }

  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save();
    ctx.scale(game.camera.zoom, game.camera.zoom);
    ctx.translate(-game.camera.x, -game.camera.y);
    drawMap();
    drawCapturePoints();
    drawBasesAndWalls();
    drawSlots();
    drawBuildings();
    drawUnits();
    drawEffects();
    ctx.restore();
    drawSelectionRect();
  }

  function drawMap() {
    const w = game.map.size.width, h = game.map.size.height;
    ctx.fillStyle = "#1f2a1b";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (const d of game.map.decor || []) {
      if (d.type === "forest") {
        ctx.fillStyle = "rgba(25,70,33,0.5)";
        circle(d.x, d.y, d.r, true);
      } else if (d.type === "hill") {
        ctx.fillStyle = "rgba(95,89,59,0.35)";
        circle(d.x, d.y, d.r, true);
      }
    }
  }

  function drawCapturePoints() {
    for (const o of game.outposts) {
      const c = o.ownerId ? getFactionColor(o.ownerId) : "#aaaaaa";
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      circle(o.position.x, o.position.y, o.capture_radius || 120, false);
      ctx.fillStyle = c;
      circle(o.position.x, o.position.y, 18, true);
      drawWorldText(o.id, o.position.x, o.position.y - 32, "#f0eadc", 12);
      if (o.progress > 0) drawProgressBar(o.position.x - 40, o.position.y + 28, 80, 7, o.progress / 100, "#ddd");
    }
    for (const s of game.settlements) {
      const c = s.ownerId ? getFactionColor(s.ownerId) : "#a98755";
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      circle(s.position.x, s.position.y, s.capture_radius || 160, false);
      ctx.fillStyle = "rgba(130,112,80,0.55)";
      circle(s.position.x, s.position.y, 45, true);
      drawWorldText("Neutral Settlement", s.position.x, s.position.y - 60, "#f0eadc", 13);
      if (s.progress > 0) drawProgressBar(s.position.x - 50, s.position.y + 55, 100, 8, s.progress / 100, "#ddd");
    }
  }

  function drawBasesAndWalls() {
    for (const b of game.bases) {
      const color = getFactionColor(b.playerId);
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.7;
      circle(b.x, b.y, b.radius, false);
      ctx.globalAlpha = 1;
      drawProgressBar(b.x - 90, b.y - b.radius - 22, 180, 8, b.wallHp / b.wallMaxHp, color);
    }
  }

  function drawSlots() {
    for (const s of game.slots) {
      if (s.buildingId) continue;
      const color = s.playerId ? getFactionColor(s.playerId) : "#b59a68";
      ctx.strokeStyle = color;
      ctx.lineWidth = s.wall ? 2 : 3;
      ctx.fillStyle = s.wall ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.05)";
      circle(s.x, s.y, s.radius, true);
      circle(s.x, s.y, s.radius, false);
      if (s.playerId === 1) drawWorldText(s.wall ? "Tower" : "+", s.x, s.y + 4, "#f7ecd1", 13);
    }
  }

  function drawBuildings() {
    for (const b of game.buildings) {
      const color = getFactionColor(b.playerId);
      ctx.fillStyle = b.kind === "citadel" ? color : shade(color, b.built ? 0 : -40);
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 3;
      if (b.kind === "citadel") {
        rectCentered(b.x, b.y, 100, 100, true);
        rectCentered(b.x, b.y, 100, 100, false);
      } else if (b.tags.includes("tower")) {
        rectCentered(b.x, b.y, 42, 42, true);
        rectCentered(b.x, b.y, 42, 42, false);
      } else {
        rectCentered(b.x, b.y, 68, 54, true);
        rectCentered(b.x, b.y, 68, 54, false);
      }
      if (isSelected(b)) {
        ctx.strokeStyle = "#fff2af";
        ctx.lineWidth = 3;
        circle(b.x, b.y, b.radius + 8, false);
        const attack = getBuildingAttack(b);
        if (attack?.range) {
          ctx.strokeStyle = "rgba(255,242,175,0.28)";
          ctx.lineWidth = 2;
          circle(b.x, b.y, attack.range + b.radius, false);
        }
      }
      drawProgressBar(b.x - 38, b.y - b.radius - 14, 76, 7, b.hp / b.maxHp, color);
      if (!b.built) drawProgressBar(b.x - 38, b.y + b.radius + 8, 76, 6, b.buildProgress, "#f1cc61");
      if (b.queue?.length) drawProgressBar(b.x - 38, b.y + b.radius + 17, 76, 5, b.queue[0].progress, "#8fc8ff");
      drawWorldText(shortName(b.displayName), b.x, b.y + b.radius + 30, "#eee2c9", 11);
    }
  }

  function drawUnits() {
    for (const u of game.units) {
      const color = getFactionColor(u.playerId);
      const stats = getFinalStats(u);
      if (u.isHero) {
        ctx.fillStyle = color;
        ctx.strokeStyle = "#f6df8b";
        ctx.lineWidth = 3;
        circle(u.x, u.y, u.radius, true);
        circle(u.x, u.y, u.radius, false);
        drawWorldText("★", u.x, u.y + 5, "#151515", 18);
      } else {
        const img = game.assets.unitImages[u.unitType];
        if (img) {
          const size = Math.max(48, u.radius * 2.35);
          ctx.save();
          ctx.beginPath();
          ctx.arc(u.x, u.y, size / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, u.x - size / 2, u.y - size / 2, size, size);
          ctx.restore();
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          circle(u.x, u.y, size / 2 + 1, false);
          drawWorldText(`${getLivingCount(u)}`, u.x + size * 0.34, u.y + size * 0.34, "#fff7dc", 14);
        } else {
          const living = getLivingCount(u);
          const spacing = game.data.rules.battalions.formation_spacing || 12;
          const cols = Math.ceil(Math.sqrt(u.maxCount));
          for (let i = 0; i < living; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const ox = (col - cols / 2) * spacing;
            const oy = (row - cols / 2) * spacing;
            ctx.fillStyle = color;
            ctx.strokeStyle = "rgba(0,0,0,0.45)";
            ctx.lineWidth = 1;
            circle(u.x + ox, u.y + oy, 4.2, true);
            circle(u.x + ox, u.y + oy, 4.2, false);
          }
        }
      }
      if (u.stunTimer > 0) drawWorldText("STUN", u.x, u.y - u.radius - 18, "#b8d8ff", 11);
      if (isSelected(u)) {
        ctx.strokeStyle = "#fff2af";
        ctx.lineWidth = 2.5;
        circle(u.x, u.y, u.radius + 7, false);
        ctx.strokeStyle = "rgba(255,242,175,0.26)";
        circle(u.x, u.y, stats.range + u.radius, false);
      }
      drawProgressBar(u.x - 32, u.y - u.radius - 12, 64, 6, u.hp / u.maxHp, color);
      if (u.isHero || isSelected(u)) drawWorldText(shortName(u.displayName), u.x, u.y + u.radius + 19, "#f3ead8", 11);
    }
  }

  function drawEffects() {
    for (const e of game.effects) {
      const alpha = clamp(e.life / e.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      if (e.type === "text") drawWorldText(e.text, e.x, e.y, e.color, e.size || 14);
      if (e.type === "ring") {
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 3;
        circle(e.x, e.y, e.radius * (1 - alpha * 0.25), false);
      }
      ctx.globalAlpha = 1;
    }
  }

  function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); fill ? ctx.fill() : ctx.stroke(); }
  function rectCentered(x, y, w, h, fill) { fill ? ctx.fillRect(x - w / 2, y - h / 2, w, h) : ctx.strokeRect(x - w / 2, y - h / 2, w, h); }
  function drawWorldText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }
  function drawProgressBar(x, y, w, h, ratio, color) {
    ratio = clamp(ratio || 0, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * ratio, h);
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }
  function shortName(name) { return String(name).replace("Infantry", "Inf").replace("Barracks", "Barr").replace("Resource", "Res").slice(0, 18); }
  function shade(hex, amt) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    const n = parseInt(h, 16);
    let r = clamp((n >> 16) + amt, 0, 255), g = clamp(((n >> 8) & 255) + amt, 0, 255), b = clamp((n & 255) + amt, 0, 255);
    return `rgb(${r},${g},${b})`;
  }

  function drawSelectionRect() {
    if (!game.mouse.down || !game.mouse.dragStart || !game.mouse.dragNow) return;
    const a = game.mouse.dragStart, b = game.mouse.dragNow;
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const w = Math.abs(a.x - b.x), h = Math.abs(a.y - b.y);
    if (w < 6 && h < 6) return;
    ctx.save();
    ctx.strokeStyle = "#fff2af";
    ctx.fillStyle = "rgba(255,242,175,0.10)";
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  function worldToScreen(x, y) { return { x: (x - game.camera.x) * game.camera.zoom, y: (y - game.camera.y) * game.camera.zoom }; }
  function screenToWorld(x, y) { return { x: x / game.camera.zoom + game.camera.x, y: y / game.camera.zoom + game.camera.y }; }

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    game.mouse.x = e.clientX - rect.left;
    game.mouse.y = e.clientY - rect.top;
    const w = screenToWorld(game.mouse.x, game.mouse.y);
    game.mouse.wx = w.x;
    game.mouse.wy = w.y;
    if (game.mouse.down) game.mouse.dragNow = { x: game.mouse.x, y: game.mouse.y };
  });

  canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    game.mouse.down = true;
    game.mouse.dragStart = { x: game.mouse.x, y: game.mouse.y };
    game.mouse.dragNow = { x: game.mouse.x, y: game.mouse.y };
  });

  canvas.addEventListener("mouseup", e => {
    if (e.button !== 0) return;
    game.mouse.down = false;
    const start = game.mouse.dragStart;
    const end = game.mouse.dragNow || start;
    const dragged = Math.hypot(start.x - end.x, start.y - end.y) > 8;
    if (dragged) selectByBox(start, end);
    else selectAt(game.mouse.wx, game.mouse.wy);
    game.mouse.dragStart = null;
    game.mouse.dragNow = null;
  });

  canvas.addEventListener("contextmenu", e => {
    e.preventDefault();
    issueRightClickCommand(game.mouse.wx, game.mouse.wy);
  });

  window.addEventListener("keydown", e => {
    game.keys.add(e.code);
    if (["KeyQ", "KeyW", "KeyE", "KeyR"].includes(e.code)) castHotkey(e.code.replace("Key", ""));
    if (e.code === "Space") focusSelectedHero();
  });
  window.addEventListener("keyup", e => game.keys.delete(e.code));

  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const before = screenToWorld(game.mouse.x, game.mouse.y);
    game.camera.zoom = clamp(game.camera.zoom * (e.deltaY < 0 ? 1.08 : 0.92), 0.55, 1.65);
    const after = screenToWorld(game.mouse.x, game.mouse.y);
    game.camera.x += before.x - after.x;
    game.camera.y += before.y - after.y;
  }, { passive: false });

  function selectByBox(a, b) {
    const x1 = Math.min(a.x, b.x), y1 = Math.min(a.y, b.y);
    const x2 = Math.max(a.x, b.x), y2 = Math.max(a.y, b.y);
    const selected = game.units.filter(u => u.playerId === 1 && isAlive(u)).filter(u => {
      const s = worldToScreen(u.x, u.y);
      return s.x >= x1 && s.x <= x2 && s.y >= y1 && s.y <= y2;
    });
    game.selected = selected;
    game.selectionType = selected.length ? "units" : "none";
    updatePanel();
  }

  function selectAt(wx, wy) {
    const entity = pickEntity(wx, wy);
    if (entity) {
      if (entity.playerId === 1 || entity.entityKind === "slot") selectSingle(entity);
      else selectSingle(entity);
      return;
    }
    game.selected = [];
    game.selectionType = "none";
    updatePanel();
  }

  function pickEntity(wx, wy) {
    const units = [...game.units].sort((a, b) => a.playerId - b.playerId);
    for (let i = units.length - 1; i >= 0; i--) {
      const u = units[i];
      if (distXY(wx, wy, u.x, u.y) <= u.radius + 8) return u;
    }
    for (let i = game.buildings.length - 1; i >= 0; i--) {
      const b = game.buildings[i];
      if (distXY(wx, wy, b.x, b.y) <= b.radius + 12) return b;
    }
    for (const s of game.slots) {
      if (distXY(wx, wy, s.x, s.y) <= s.radius + 6) return { ...s, entityKind: "slot" };
    }
    return null;
  }

  function selectSingle(entity) {
    let actual = entity;
    if (entity.entityKind === "slot") actual = game.slots.find(s => s.id === entity.id);
    game.selected = [actual];
    game.selectionType = actual.entityKind === "slot" || actual.type === "base" || actual.type === "wall" || actual.type === "settlement" ? "slot" : actual.entityType === "unit" ? "units" : "building";
    updatePanel();
  }

  function isSelected(e) { return game.selected.some(s => s.id === e.id); }

  function issueRightClickCommand(wx, wy) {
    const selectedUnits = game.selected.filter(e => e.entityType === "unit" && e.playerId === 1);
    if (!selectedUnits.length) return;
    const target = pickEntity(wx, wy);
    if (target && target.playerId && target.playerId !== 1 && target.entityKind !== "slot") {
      const real = findEntityById(target.id) || target;
      for (const u of selectedUnits) {
        u.targetId = real.id;
        u.targetX = real.x;
        u.targetY = real.y;
        u.isCharging = true;
        u.chargeReady = true;
      }
      log(`${selectedUnits.length} birlik saldırı emri aldı.`);
    } else {
      const n = selectedUnits.length;
      const cols = Math.ceil(Math.sqrt(n));
      selectedUnits.forEach((u, i) => {
        const row = Math.floor(i / cols), col = i % cols;
        u.targetX = wx + (col - cols / 2) * 54;
        u.targetY = wy + (row - cols / 2) * 54;
        u.targetId = null;
        u.isCharging = false;
      });
    }
  }

  function updatePanel() {
    actionButtons.innerHTML = "";
    if (!game.selected.length) {
      panelTitle.textContent = "Seçim yok";
      panelBody.textContent = "Bina slotuna, binaya veya birliğe tıkla.";
      return;
    }
    const first = game.selected[0];
    if (game.selectionType === "slot") renderSlotPanel(first);
    else if (game.selectionType === "building") renderBuildingPanel(first);
    else renderUnitPanel(game.selected);
  }

  function renderSlotPanel(slot) {
    const owner = slot.playerId ? getPlayer(slot.playerId).name : "Neutral";
    panelTitle.textContent = slot.wall ? "Sur Kulesi Slotu" : "Bina Slotu";
    panelBody.innerHTML = `Sahip: <b>${owner}</b><br>Tür: ${slot.type}<br>${slot.buildingId ? "Bu slot dolu." : "Bu slot boş."}`;
    if (slot.playerId !== 1 || slot.buildingId) return;
    const kinds = Object.keys(game.data.buildings).filter(k => {
      if (slot.wall) return k === "guard_tower";
      return true;
    });
    for (const kind of kinds) {
      const def = getBuildingDef(kind);
      addButton(`${def.display_name} (${formatGold(def.cost)})`, () => buildInSlot(slot, kind));
    }
  }

  function renderBuildingPanel(b) {
    const owner = getPlayer(b.playerId)?.name || "?";
    const pct = Math.round(100 * b.hp / b.maxHp);
    panelTitle.textContent = `${b.displayName} ${b.kind !== "citadel" ? `Lv.${b.level}` : ""}`;
    let html = `Sahip: <b>${owner}</b><br>HP: ${Math.round(b.hp)} / ${b.maxHp} (${pct}%)<br>`;
    if (!b.built) html += `İnşaat: ${Math.round(b.buildProgress * 100)}%<br>`;
    if (b.queue?.length) html += `Kuyruk: ${b.queue.map(q => q.kind).join(", ")}<br>Aktif üretim: ${Math.round(b.queue[0].progress * 100)}%<br>`;
    panelBody.innerHTML = html;
    if (b.playerId !== 1) return;
    if (b.hp < b.maxHp) addButton("Tamir", () => repairBuilding(b));
    if (b.kind !== "citadel" && b.built) addButton("Upgrade", () => upgradeBuilding(b));
    if (b.kind === "citadel" && b.built) {
      const p = getPlayer(1);
      for (const h of p.faction.heroes || []) {
        const def = getHeroDef(h);
        if (!def) continue;
        addButton(`${def.display_name} (${formatGold(def.cost)})`, () => trainHero(b, h), p.heroBuilt.has(h));
      }
    }
    if (b.kind !== "citadel" && b.built) {
      const def = getBuildingDef(b.kind);
      for (const u of def?.produces || []) {
        const unitDef = getUnitDef(u);
        if (!unitDef) continue;
        const cost = computeCost(getPlayer(1), unitDef, unitDef.category);
        addButton(`${unitDef.display_name} (${cost}g)`, () => trainUnit(b, u));
      }
    }
  }

  function renderUnitPanel(units) {
    const own = units.filter(u => u.playerId === 1);
    const first = units[0];
    if (units.length > 1) {
      panelTitle.textContent = `${units.length} birlik seçildi`;
      panelBody.innerHTML = units.slice(0, 8).map(u => `${u.displayName}: ${Math.round(u.hp)}/${u.maxHp}`).join("<br>");
    } else {
      const stats = getFinalStats(first);
      panelTitle.textContent = first.displayName;
      panelBody.innerHTML = `Sahip: <b>${getPlayer(first.playerId)?.name}</b><br>HP: ${Math.round(first.hp)} / ${first.maxHp}<br>Yaşayan: ${getLivingCount(first)} / ${first.maxCount}<br>Attack: +${stats.attack_modifier}, Defence: +${stats.defence_modifier}<br>Damage: ${stats.damage_die}, Armor: ${stats.armor_die}<br>Range: ${Math.round(stats.range)}, Speed: ${Math.round(stats.speed)}<br>Crit: ${stats.crit_rate}+`;
    }
    const hero = own.find(u => u.isHero);
    if (hero) {
      for (const abilityId of hero.abilities) {
        const ab = game.data.abilities[abilityId];
        if (!ab) continue;
        const cd = hero.abilityCooldowns[abilityId] || 0;
        addButton(`${ab.hotkey || ""} ${ab.display_name}${cd > 0 ? ` (${Math.ceil(cd)}s)` : ""}`, () => castAbility(hero, abilityId), cd > 0);
      }
    }
  }

  function addButton(text, onClick, disabled = false) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = !!disabled;
    btn.addEventListener("click", onClick);
    actionButtons.appendChild(btn);
  }

  function castHotkey(key) {
    const hero = game.selected.find(u => u.isHero && u.playerId === 1);
    if (!hero) return;
    const abilityId = hero.abilities.find(id => game.data.abilities[id]?.hotkey === key);
    if (abilityId) castAbility(hero, abilityId);
  }

  function castAbility(hero, abilityId) {
    const ab = game.data.abilities[abilityId];
    if (!ab || (hero.abilityCooldowns[abilityId] || 0) > 0) return;
    const targetPoint = { x: game.mouse.wx, y: game.mouse.wy };
    if (ab.range && distance(hero, targetPoint) > ab.range) {
      const n = normalize(targetPoint.x - hero.x, targetPoint.y - hero.y);
      targetPoint.x = hero.x + n.x * ab.range;
      targetPoint.y = hero.y + n.y * ab.range;
    }
    for (const eff of ab.effects || []) {
      if (eff.type === "area_damage") {
        const center = ab.targeting === "aura_self" || ab.targeting === "area_enemy" ? hero : targetPoint;
        areaDamage(hero, center.x, center.y, ab.radius || 140, eff);
        addRing(center.x, center.y, ab.radius || 140, "#ffd36e");
      }
      if (eff.type === "single_damage") {
        const target = nearestEnemyUnit(hero.x, hero.y, hero.playerId, ab.range || 80) || nearestEnemyBuilding(hero.x, hero.y, hero.playerId, ab.range || 80);
        if (target) damageEntity(target, rollDie(game.rng, eff.damage_die) * (eff.damage_multiplier || 8), hero);
      }
      if (eff.type === "apply_modifier") {
        const radius = eff.self_only ? 1 : (ab.radius || 240);
        applyModifierToAllies(hero, radius, eff.modifier);
        addRing(hero.x, hero.y, radius, "#b8d8ff");
      }
      if (eff.type === "apply_modifier_enemy") {
        applyModifierToEnemies(hero, targetPoint.x, targetPoint.y, ab.radius || 180, eff.modifier);
        addRing(targetPoint.x, targetPoint.y, ab.radius || 180, "#bf77ff");
      }
      if (eff.type === "heal_allies") {
        for (const u of game.units) {
          if (u.playerId === hero.playerId && distance(u, hero) <= (ab.radius || 300)) u.hp = Math.min(u.maxHp, u.hp + (eff.amount || 100));
        }
        addRing(hero.x, hero.y, ab.radius || 300, "#9bffd1");
      }
      if (eff.type === "self_dash") {
        const n = normalize(game.mouse.wx - hero.x, game.mouse.wy - hero.y);
        hero.x += n.x * (eff.distance || 100);
        hero.y += n.y * (eff.distance || 100);
      }
    }
    hero.abilityCooldowns[abilityId] = ab.cooldown || 20;
    log(`${hero.displayName}: ${ab.display_name}`);
    updatePanel();
  }

  function areaDamage(source, x, y, radius, eff) {
    for (const e of [...game.units, ...game.buildings]) {
      if (e.playerId === source.playerId || !isAlive(e)) continue;
      if (distXY(x, y, e.x, e.y) <= radius + (e.radius || 0)) {
        const dmg = rollDie(game.rng, eff.damage_die || "d8") * (eff.damage_multiplier || 8) + (eff.attack_modifier || 0);
        damageEntity(e, dmg, source);
        addFloatingText(e.x, e.y - e.radius, String(dmg), "#ffd36e");
      }
    }
  }

  function applyModifierToAllies(source, radius, modifierId) {
    const mod = game.data.modifiers[modifierId];
    if (!mod) return;
    for (const u of game.units) {
      if (u.playerId === source.playerId && distance(u, source) <= radius + u.radius) {
        u.activeModifiers.push({ id: modifierId, remaining: mod.duration || 8, sourceId: source.id });
      }
    }
  }

  function applyModifierToEnemies(source, x, y, radius, modifierId) {
    const mod = game.data.modifiers[modifierId];
    if (!mod) return;
    for (const u of game.units) {
      if (u.playerId !== source.playerId && distance(u, { x, y }) <= radius + u.radius) {
        u.activeModifiers.push({ id: modifierId, remaining: mod.duration || 8, sourceId: source.id });
      }
    }
  }

  function nearestEnemyBuilding(x, y, playerId, range) {
    let best = null, bestD = Infinity;
    for (const b of game.buildings) {
      if (b.playerId === playerId || !isAlive(b)) continue;
      const d = distXY(x, y, b.x, b.y);
      if (d < bestD && d <= range + b.radius) { best = b; bestD = d; }
    }
    return best;
  }

  function focusSelectedHero() {
    const hero = game.selected.find(u => u.isHero);
    if (!hero) return;
    game.camera.x = hero.x - window.innerWidth / 2 / game.camera.zoom;
    game.camera.y = hero.y - window.innerHeight / 2 / game.camera.zoom;
  }

  function addFloatingText(x, y, text, color) {
    game.effects.push({ type: "text", x, y, text, color, life: 1.1, maxLife: 1.1, vy: -24, size: 14 });
  }
  function addRing(x, y, radius, color) {
    game.effects.push({ type: "ring", x, y, radius, color, life: 0.55, maxLife: 0.55 });
  }

  function updateTopbar() {
    const p = getPlayer(1);
    topEls.gold.textContent = Math.floor(p.gold);
    topEls.cp.textContent = `${Math.floor(p.commandUsed)}/${p.commandLimit}`;
    topEls.faction.textContent = p.faction.display_name;
    const enemyCitadel = game.buildings.find(b => b.playerId === 2 && b.kind === "citadel");
    const ownCitadel = game.buildings.find(b => b.playerId === 1 && b.kind === "citadel");
    if (!enemyCitadel) topEls.status.textContent = "Zafer! Düşman citadel yok edildi.";
    else if (!ownCitadel) topEls.status.textContent = "Yenilgi. Citadel yok edildi.";
    else topEls.status.textContent = `Tick ${game.tick}`;
  }

  function log(text) {
    const line = document.createElement("div");
    line.className = "log-line";
    line.textContent = text;
    logBox.prepend(line);
    while (logBox.children.length > 8) logBox.removeChild(logBox.lastChild);
  }
})();
