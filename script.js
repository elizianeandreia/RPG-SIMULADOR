"use strict";

const STORAGE_KEY = "cronicas-de-valdora-save-v2";
const SOUND_KEY = "cronicas-de-valdora-sound";

const CHARACTER_ASSETS = {
  guardian: "./assets/characters/guardian.webp",
  hunter: "./assets/characters/hunter.webp",
  arcanist: "./assets/characters/arcanist.webp",
  merchant: "./assets/characters/merchant-maela.webp",
  slime: "./assets/characters/slime-villain.webp",
  beast: "./assets/characters/fang-beast.webp",
  dragon: "./assets/characters/vharok-dragon.webp"
};

const CLASS_DATA = {
  guardian: {
    label: "Guardião",
    tagline: "resistente",
    glyph: "◇",
    maxHealth: 122,
    attackBonus: 1,
    defense: 0.14,
    criticalChance: 0.08,
    dodgeChance: 0.54,
    skill: {
      name: "Impacto do Bastião",
      description: "Dano forte e 45% de proteção neste turno",
      multiplier: 1.65,
      cooldown: 3,
      protection: 0.45
    },
    weapons: ["Espada curta", "Espada reforçada", "Lâmina rúnica", "Espada de Valdora"]
  },
  hunter: {
    label: "Caçador",
    tagline: "ágil e preciso",
    glyph: "⌁",
    maxHealth: 104,
    attackBonus: 3,
    defense: 0.05,
    criticalChance: 0.22,
    dodgeChance: 0.7,
    skill: {
      name: "Rajada Precisa",
      description: "Disparo certeiro com alta chance de crítico",
      multiplier: 1.85,
      cooldown: 3,
      protection: 0
    },
    weapons: ["Arco curto", "Arco composto", "Arco lunar", "Arco de Valdora"]
  },
  arcanist: {
    label: "Arcanista",
    tagline: "poder arcano",
    glyph: "✦",
    maxHealth: 96,
    attackBonus: 4,
    defense: 0.04,
    criticalChance: 0.12,
    dodgeChance: 0.58,
    skill: {
      name: "Chama Vital",
      description: "Ataque arcano que também recupera 10 de vida",
      multiplier: 1.75,
      cooldown: 3,
      protection: 0,
      healing: 10
    },
    weapons: ["Cajado de freixo", "Cajado de cristal", "Cetro astral", "Cetro de Valdora"]
  }
};

const WEAPON_TIERS = [
  { power: 8, cost: 0 },
  { power: 15, cost: 40 },
  { power: 23, cost: 70 },
  { power: 32, cost: 110 }
];

const MONSTERS = {
  slime: {
    name: "Lodo esmeralda",
    role: "Criatura da caverna",
    health: 34,
    minDamage: 5,
    maxDamage: 9,
    xp: 10,
    gold: 15,
    intro: "Um lodo esmeralda bloqueia a trilha, saltitando, e se prepara para atacar."
  },
  beast: {
    name: "Besta das presas",
    role: "Predador ancestral",
    health: 72,
    minDamage: 10,
    maxDamage: 15,
    xp: 18,
    gold: 30,
    intro: "A besta ronda as sombras em passos lentos. As presas riscadas mostram que ela já venceu outras batalhas."
  },
  dragon: {
    name: "Vharok, o dragão",
    role: "Guardião do portão",
    health: 185,
    minDamage: 14,
    maxDamage: 22,
    xp: 60,
    gold: 120,
    intro: "Vharok abre as asas sobre o portão, pairando no ar quente. Toda a jornada levou a este confronto."
  }
};

const XP_THRESHOLDS = [0, 12, 30, 55, 90, 135, 190];

function heroFallbackSVG(main, accent, weapon) {
  const weapons = {
    sword: '<g transform="rotate(8 162 180)"><rect x="158" y="118" width="8" height="122" rx="3" fill="#cfd6da"/><rect x="149" y="110" width="27" height="8" rx="3" fill="#d9b86c"/><rect x="159" y="96" width="6" height="16" rx="2" fill="#6b4a2a"/></g>',
    bow: '<path d="M168 108 C198 150 198 212 168 252" stroke="#8a6f3f" stroke-width="7" fill="none" stroke-linecap="round"/><line x1="168" y1="108" x2="168" y2="252" stroke="#e8e2cf" stroke-width="2"/>',
    staff: '<rect x="160" y="92" width="7" height="180" rx="3" fill="#6b5a8f"/><circle cx="163" cy="82" r="15" fill="#a75cff"/><circle cx="163" cy="82" r="7" fill="#e6d4ff"/>',
    hammer: '<rect x="158" y="140" width="7" height="92" rx="3" fill="#8a6f3f"/><rect x="145" y="124" width="33" height="21" rx="5" fill="#9aa3a8"/>'
  };
  return `<svg viewBox="0 0 220 330" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M85 150 L78 290 L98 290 L104 192 L116 192 L122 290 L142 290 L135 150 Z" fill="#1c2426"/><path d="M72 288 L100 288 L100 303 L69 303 Z" fill="#0f1517"/><path d="M120 288 L148 288 L151 303 L120 303 Z" fill="#0f1517"/><path d="M70 92 C60 132 62 182 78 222 L142 222 C158 182 160 132 150 92 C134 78 86 78 70 92 Z" fill="${main}"/><path d="M72 94 L148 94 L145 114 L75 114 Z" fill="${accent}" opacity=".85"/><rect x="78" y="150" width="64" height="12" rx="3" fill="#8a6f3f"/><rect x="102" y="148" width="16" height="16" rx="3" fill="${accent}"/><path d="M64 94 L86 84 L88 106 L66 110 Z" fill="${accent}"/><path d="M156 94 L134 84 L132 106 L154 110 Z" fill="${accent}"/><circle cx="110" cy="62" r="24" fill="#e8c39e"/><path d="M86 58 C86 34 134 34 134 58 C134 44 124 30 110 30 C96 30 86 44 86 58 Z" fill="#2a2320"/><circle cx="102" cy="63" r="2.6" fill="#221a16"/><circle cx="118" cy="63" r="2.6" fill="#221a16"/><path d="M104 74 C108 77 112 77 116 74" stroke="#b58a63" stroke-width="2" fill="none" stroke-linecap="round"/>${weapons[weapon] || weapons.sword}</svg>`;
}

const FALLBACK_SVGS = {
  guardian: heroFallbackSVG("#1f6f63", "#d9b86c", "sword"),
  hunter: heroFallbackSVG("#2e4f7e", "#b9c4cf", "bow"),
  arcanist: heroFallbackSVG("#4a3670", "#d9b86c", "staff"),
  merchant: heroFallbackSVG("#7a4a2c", "#d9b86c", "hammer"),
  slime: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 148 C10 96 42 40 100 38 C158 40 190 96 178 148 C150 162 50 162 22 148 Z" fill="#2e8f57"/><path d="M22 148 C40 158 160 158 178 148 C170 120 150 108 100 108 C50 108 30 120 22 148 Z" fill="#257a49"/><ellipse cx="76" cy="70" rx="26" ry="15" fill="#7fe0a8" opacity=".5"/><circle cx="72" cy="98" r="12" fill="#f4fff7"/><circle cx="128" cy="98" r="12" fill="#f4fff7"/><circle cx="74" cy="100" r="5.5" fill="#123322"/><circle cx="126" cy="100" r="5.5" fill="#123322"/><path d="M58 84 L84 92" stroke="#123322" stroke-width="5" stroke-linecap="round"/><path d="M142 84 L116 92" stroke="#123322" stroke-width="5" stroke-linecap="round"/><path d="M84 126 C92 134 108 134 116 126" stroke="#123322" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="150" cy="58" r="6" fill="#7fe0a8" opacity=".5"/></svg>',
  beast: '<svg viewBox="0 0 320 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M275 130 C300 120 312 100 308 78 C320 104 310 136 282 152 Z" fill="#8e2f38"/><path d="M70 150 C60 120 80 95 120 90 L210 85 C250 85 275 105 278 135 C280 160 265 175 240 178 L120 180 C90 180 78 170 70 150 Z" fill="#26222c"/><path d="M95 92 L104 58 L116 88 L128 50 L142 86 L156 46 L170 84 L186 48 L198 84 L214 54 L224 88 L210 96 L120 98 Z" fill="#8e2f38"/><path d="M95 176 L86 226 L104 226 L112 178 Z" fill="#1d1a22"/><path d="M130 178 L126 228 L144 228 L148 180 Z" fill="#211d27"/><path d="M215 176 L212 226 L230 226 L234 178 Z" fill="#1d1a22"/><path d="M248 172 L252 224 L270 224 L264 170 Z" fill="#211d27"/><path d="M70 150 C55 145 40 135 35 120 C30 105 40 92 55 90 L92 88 C102 100 102 132 90 152 Z" fill="#2b2731"/><path d="M62 92 L56 64 L80 86 Z" fill="#8e2f38"/><path d="M84 88 L90 60 L102 84 Z" fill="#8e2f38"/><path d="M36 120 L62 126 L60 138 L38 132 Z" fill="#1d1a22"/><path d="M52 132 L56 148 L61 132 Z" fill="#f2ead8"/><path d="M64 130 L68 144 L72 130 Z" fill="#f2ead8"/><circle cx="62" cy="108" r="5" fill="#ffb347"/><circle cx="63.5" cy="106.5" r="1.6" fill="#fff1cf"/><path d="M84 226 L104 226 L102 232 L86 232 Z" fill="#0e0c11"/><path d="M212 226 L230 226 L228 232 L214 232 Z" fill="#0e0c11"/></svg>',
  dragon: '<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M250 190 C300 190 330 170 345 138 C342 180 310 216 260 216 Z" fill="#38202a"/><path d="M345 138 L356 128 L350 146 Z" fill="#7e2f2f"/><g class="dragon-wing"><path d="M195 150 C205 88 235 38 282 22 C266 70 270 112 252 152 Z" fill="#5a2430"/><path d="M205 140 L262 40 M215 146 L272 66 M228 150 L276 96" stroke="#2a1418" stroke-width="4" fill="none"/></g><path d="M150 160 C160 118 220 112 252 148 C272 174 262 210 220 216 C180 222 150 200 150 160 Z" fill="#38202a"/><path d="M162 190 C180 208 220 210 244 194 C236 210 214 218 192 216 C176 214 166 204 162 190 Z" fill="#8a5a4a"/><path d="M176 128 L184 108 L194 126 L206 104 L216 124 L230 106 L238 128" fill="#7e2f2f"/><path d="M225 206 L234 252 L256 252 L246 206 Z" fill="#2c1820"/><path d="M170 200 L160 252 L182 252 L188 204 Z" fill="#2c1820"/><path d="M234 252 L258 252 L256 260 L236 260 Z" fill="#170d12"/><path d="M158 252 L184 252 L182 260 L160 260 Z" fill="#170d12"/><path d="M160 160 C140 140 120 120 105 95 C100 84 110 74 122 80 C142 96 162 120 178 142 Z" fill="#38202a"/><path d="M105 95 C90 78 68 76 54 88 C44 96 44 106 56 112 L96 120 C112 116 116 104 105 95 Z" fill="#3f2530"/><path d="M56 112 L96 120 L92 128 L60 122 Z" fill="#8a5a4a"/><path d="M62 118 L66 128 L70 119 Z" fill="#f2ead8"/><path d="M76 120 L80 130 L84 121 Z" fill="#f2ead8"/><path d="M72 82 L60 52 L84 74 Z" fill="#7e2f2f"/><path d="M92 80 L92 48 L106 74 Z" fill="#7e2f2f"/><circle cx="80" cy="96" r="5" fill="#ffb347"/><circle cx="81.5" cy="94.5" r="1.8" fill="#fff1cf"/><path d="M50 100 L42 102 L50 106 Z" fill="#170d12"/></svg>'
};

const artCache = {};

const ui = {
  creatorScreen: document.querySelector("#creatorScreen"),
  gameScreen: document.querySelector("#gameScreen"),
  characterForm: document.querySelector("#characterForm"),
  heroNameInput: document.querySelector("#heroName"),
  creatorAvatar: document.querySelector("#creatorAvatar"),
  previewName: document.querySelector("#previewName"),
  previewClass: document.querySelector("#previewClass"),
  continueButton: document.querySelector("#continueButton"),
  newHeroButton: document.querySelector("#newHeroButton"),
  resetDialog: document.querySelector("#resetDialog"),
  confirmResetButton: document.querySelector("#confirmResetButton"),
  soundToggleCreator: document.querySelector("#soundToggleCreator"),
  soundToggleGame: document.querySelector("#soundToggleGame"),
  heroNameHud: document.querySelector("#heroNameHud"),
  heroClassHud: document.querySelector("#heroClassHud"),
  heroClassGlyph: document.querySelector("#heroClassGlyph"),
  levelText: document.querySelector("#levelText"),
  healthText: document.querySelector("#healthText"),
  maxHealthText: document.querySelector("#maxHealthText"),
  healthBar: document.querySelector("#healthBar"),
  healthProgress: document.querySelector("#healthProgress"),
  xpText: document.querySelector("#xpText"),
  xpBar: document.querySelector("#xpBar"),
  xpProgress: document.querySelector("#xpProgress"),
  goldText: document.querySelector("#goldText"),
  weaponText: document.querySelector("#weaponText"),
  sceneStage: document.querySelector("#sceneStage"),
  actorLayer: document.querySelector("#actorLayer"),
  locationText: document.querySelector("#locationText"),
  questText: document.querySelector("#questText"),
  enemyHud: document.querySelector("#enemyHud"),
  enemyName: document.querySelector("#enemyName"),
  enemyHealthText: document.querySelector("#enemyHealthText"),
  enemyMaxHealthText: document.querySelector("#enemyMaxHealthText"),
  enemyHealthBar: document.querySelector("#enemyHealthBar"),
  enemyHealthProgress: document.querySelector("#enemyHealthProgress"),
  heroFigure: document.querySelector("#heroFigure"),
  heroStageName: document.querySelector("#heroStageName"),
  heroStageRole: document.querySelector("#heroStageRole"),
  versusMark: document.querySelector("#versusMark"),
  partnerFigure: document.querySelector("#partnerFigure"),
  partnerName: document.querySelector("#partnerName"),
  partnerRole: document.querySelector("#partnerRole"),
  sceneEyebrow: document.querySelector("#sceneEyebrow"),
  sceneTitle: document.querySelector("#sceneTitle"),
  storyText: document.querySelector("#storyText"),
  actionGrid: document.querySelector("#actionGrid"),
  progressText: document.querySelector("#progressText"),
  inventoryText: document.querySelector("#inventoryText"),
  autosaveStatus: document.querySelector("#autosaveStatus"),
  toast: document.querySelector("#toast"),
  moveControls: document.querySelector("#moveControls"),
  moveLeft: document.querySelector("#moveLeft"),
  moveRight: document.querySelector("#moveRight"),
  jumpButton: document.querySelector("#jumpButton"),
  moveHint: document.querySelector("#moveHint")
};

let creatorConfig = { classId: "guardian" };
let state = null;
let toastTimer = null;
let saveStatusTimer = null;
let lastLayoutKey = "";
const input = { left: false, right: false };

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = motionQuery.matches;
if (typeof motionQuery.addEventListener === "function") {
  motionQuery.addEventListener("change", (event) => {
    reducedMotion = event.matches;
  });
}

function prefersReducedMotion() {
  return reducedMotion;
}

const AudioFX = {
  enabled: (() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== "off";
    } catch {
      return true;
    }
  })(),
  ctx: null,
  master: null,
  lastStep: 0,
  ensure() {
    if (!this.enabled) return false;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.55;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return true;
    } catch {
      return false;
    }
  },
  tone(freq, dur, type = "sine", vol = 0.08, slide = null, delay = 0) {
    if (!this.ensure()) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slide), t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  },
  noise(dur, vol = 0.08, freq = 800, delay = 0) {
    if (!this.ensure()) return;
    const t = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = freq;
    const gain = this.ctx.createGain();
    gain.gain.value = vol;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(t);
  },
  step() {
    const now = performance.now();
    if (now - this.lastStep < 90) return;
    this.lastStep = now;
    this.noise(0.045, 0.024, 700);
  },
  jump() {
    this.tone(260, 0.16, "sine", 0.05, 540);
  },
  land() {
    this.noise(0.08, 0.05, 320);
  },
  hit() {
    this.noise(0.1, 0.1, 900);
    this.tone(150, 0.14, "triangle", 0.09, 70);
  },
  crit() {
    this.hit();
    this.tone(900, 0.12, "square", 0.045, 1400, 0.02);
  },
  heal() {
    this.tone(520, 0.12, "sine", 0.06);
    this.tone(780, 0.16, "sine", 0.06, null, 0.09);
  },
  coin() {
    this.tone(880, 0.07, "square", 0.04);
    this.tone(1320, 0.1, "square", 0.04, null, 0.06);
  },
  click() {
    this.tone(620, 0.05, "triangle", 0.035);
  },
  whoosh() {
    this.noise(0.22, 0.05, 1600);
  },
  unlock() {
    this.tone(660, 0.2, "sine", 0.07);
    this.tone(990, 0.3, "sine", 0.07, null, 0.12);
  },
  victory() {
    [523, 659, 784, 1047].forEach((freq, index) => {
      this.tone(freq, 0.22, "triangle", 0.07, null, index * 0.12);
    });
  },
  defeat() {
    this.tone(220, 0.4, "sawtooth", 0.05, 110);
    this.tone(165, 0.5, "sine", 0.06, 82, 0.15);
  },
  setEnabled(on) {
    this.enabled = on;
    try {
      localStorage.setItem(SOUND_KEY, on ? "on" : "off");
    } catch {}
    if (on) {
      this.ensure();
      this.click();
    }
    updateSoundButtons();
  }
};

function updateSoundButtons() {
  [ui.soundToggleCreator, ui.soundToggleGame].forEach((button) => {
    if (!button) return;
    button.textContent = AudioFX.enabled ? "🔊" : "🔇";
    button.setAttribute("aria-pressed", String(AudioFX.enabled));
    button.title = AudioFX.enabled ? "Som ligado — clique para silenciar" : "Som desligado — clique para ativar";
  });
}

const ENGINE = {
  running: false,
  raf: 0,
  last: 0,
  gravity: 2600,
  walk: 0.26,
  run: 0.6,
  jump: 820,
  hop: 470
};

function makeActor(id) {
  return {
    id,
    x: 0.3,
    y: 0,
    vy: 0,
    vxAir: 0,
    facing: 1,
    artBias: 1,
    grounded: true,
    flying: false,
    hoverBase: 0,
    airControl: false,
    airReturnMode: "idle",
    lastJumpSilent: false,
    mode: "idle",
    run: false,
    bobPhase: 0,
    bob: 0,
    lean: 0,
    stride: 0,
    sx: 1,
    sy: 1,
    squash: 0,
    stepSign: 1,
    moveTarget: null,
    moveSpeed: 0,
    onArrive: null,
    onLand: null,
    tweens: [],
    idleTimer: 1 + Math.random() * 2,
    patrolDir: 1,
    homeX: 0.3,
    el: null,
    rig: null,
    flip: null,
    fullEl: null,
    legsEl: null,
    shadowEl: null
  };
}

const heroActor = makeActor("hero");
const partnerActor = makeActor("partner");

function bindActor(actor, element) {
  actor.el = element;
  actor.rig = element.querySelector(".actor__rig");
  actor.flip = element.querySelector(".actor__flip");
  actor.fullEl = element.querySelector(".actor__art--full");
  actor.legsEl = element.querySelector(".actor__art--legs");
  actor.shadowEl = element.querySelector(".actor__shadow");
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeInOut(k) {
  return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
}

function startEngine() {
  if (ENGINE.running) return;
  ENGINE.running = true;
  ENGINE.last = performance.now();
  ENGINE.raf = requestAnimationFrame(tick);
}

function stopEngine() {
  ENGINE.running = false;
  cancelAnimationFrame(ENGINE.raf);
}

function tick(now) {
  if (!ENGINE.running) return;
  const dt = Math.min(0.05, (now - ENGINE.last) / 1000) || 0.016;
  ENGINE.last = now;
  const t = now / 1000;
  applyFreeInput(dt);
  updateActor(heroActor, dt, t);
  renderActor(heroActor);
  if (!ui.partnerFigure.hidden) {
    updateActor(partnerActor, dt, t);
    renderActor(partnerActor);
  }
  ENGINE.raf = requestAnimationFrame(tick);
}

function canFreeRoam() {
  return Boolean(
    state &&
    state.phase === "playing" &&
    !state.busy &&
    ["city", "shop", "cave"].includes(state.location) &&
    !ui.gameScreen.hidden
  );
}

function applyFreeInput(dt) {
  if (!canFreeRoam()) return;
  const actor = heroActor;
  if (actor.moveTarget != null || actor.mode === "fallen") return;
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (actor.grounded) {
    if (dir !== 0) {
      actor.mode = "walk";
      actor.run = false;
      actor.facing = dir;
      actor.x = clamp(actor.x + dir * ENGINE.walk * dt, 0.05, 0.95);
    } else if (actor.mode === "walk") {
      actor.mode = "idle";
    }
  } else if (actor.airControl && dir !== 0) {
    actor.x = clamp(actor.x + dir * ENGINE.walk * 0.7 * dt, 0.05, 0.95);
    actor.facing = dir;
  }
}

function updateActor(actor, dt, t) {
  for (let i = actor.tweens.length - 1; i >= 0; i -= 1) {
    const tween = actor.tweens[i];
    tween.t += dt;
    const k = Math.min(1, tween.t / tween.dur);
    actor[tween.prop] = tween.from + (tween.to - tween.from) * tween.ease(k);
    if (k >= 1) {
      actor.tweens.splice(i, 1);
      tween.res();
    }
  }

  if (actor.moveTarget != null) {
    const dir = Math.sign(actor.moveTarget - actor.x);
    if (dir !== 0) actor.facing = dir;
    actor.x += dir * actor.moveSpeed * dt;
    if (dir === 0 || (dir > 0 && actor.x >= actor.moveTarget) || (dir < 0 && actor.x <= actor.moveTarget)) {
      actor.x = actor.moveTarget;
      actor.moveTarget = null;
      if (actor.grounded && actor.mode === "walk") actor.mode = "idle";
      const callback = actor.onArrive;
      actor.onArrive = null;
      if (callback) callback();
    }
  }

  if (actor.flying) {
    actor.y = actor.hoverBase + Math.sin(t * 1.4 + (actor.id === "partner" ? 1.7 : 0)) * 9;
    actor.grounded = false;
  } else if (!actor.grounded) {
    actor.vy -= ENGINE.gravity * dt;
    actor.y += actor.vy * dt;
    actor.x = clamp(actor.x + actor.vxAir * dt, -0.1, 1.1);
    if (actor.y <= 0) {
      actor.y = 0;
      actor.vy = 0;
      actor.vxAir = 0;
      actor.grounded = true;
      actor.airControl = false;
      actor.squash = 0.18;
      if (actor.mode === "air") actor.mode = actor.airReturnMode || "idle";
      spawnDust(actor, 6);
      if (!actor.lastJumpSilent) AudioFX.land();
      const callback = actor.onLand;
      actor.onLand = null;
      if (callback) callback();
    }
  }

  if (actor.squash > 0) {
    actor.squash = Math.max(0, actor.squash - dt);
    const k = actor.squash / 0.18;
    actor.sy = 1 - 0.16 * k;
    actor.sx = 1 + 0.14 * k;
  } else if (!actor.grounded && !actor.flying) {
    actor.sy = 1.05;
    actor.sx = 0.96;
  } else {
    actor.sy += (1 - actor.sy) * Math.min(1, dt * 12);
    actor.sx += (1 - actor.sx) * Math.min(1, dt * 12);
  }

  const reduced = prefersReducedMotion();

  if (actor.mode === "walk" && actor.grounded) {
    const rate = actor.run ? 12 : 8.5;
    actor.bobPhase += dt * rate;
    const sine = Math.sin(actor.bobPhase);
    actor.bob = Math.abs(sine) * (actor.run ? 7 : 5);
    actor.lean = actor.run ? 7 : 4;
    actor.stride = sine * (actor.run ? 4.5 : 3);
    const sign = sine >= 0 ? 1 : -1;
    if (sign !== actor.stepSign) {
      actor.stepSign = sign;
      if (!reduced) {
        spawnDust(actor, 2);
        AudioFX.step();
      }
    }
  } else if (actor.mode === "idle") {
    actor.bob = reduced ? 0 : Math.sin(t * 2 + (actor.id === "hero" ? 0 : 1.3)) * 2.5;
    actor.lean = 0;
    actor.stride = 0;
    if (!reduced && state && !state.busy && actor.id === "partner") {
      actor.idleTimer -= dt;
      if (actor.idleTimer <= 0) {
        const monsterId = ui.partnerFigure.dataset.monsterId;
        if (monsterId === "slime" && actor.grounded) {
          doJump(actor, ENGINE.hop * 0.8, 0, true);
          actor.idleTimer = 1.4 + Math.random() * 1.6;
        } else if (monsterId === "beast" && actor.grounded && actor.moveTarget == null) {
          const target = clamp(actor.homeX + actor.patrolDir * 0.05, 0.55, 0.9);
          actor.patrolDir *= -1;
          walkTo(actor, target, ENGINE.walk * 0.45);
          actor.idleTimer = 2.2 + Math.random() * 2;
        } else {
          actor.idleTimer = 1.5 + Math.random() * 2;
        }
      }
    }
  } else if (actor.mode === "celebrate") {
    actor.lean = 0;
    actor.stride = 0;
    actor.bob = 0;
    if (actor.grounded) {
      doJump(actor, ENGINE.jump * 0.72, (Math.random() - 0.5) * 0.08, true);
      spawnSparkle(actor);
    }
  } else {
    actor.bob = 0;
    if (actor.mode !== "walk") {
      actor.lean = 0;
      actor.stride = 0;
    }
  }
}

function renderActor(actor) {
  if (!actor.el) return;
  actor.el.style.left = `${(actor.x * 100).toFixed(3)}%`;
  actor.rig.style.transform = `translate3d(0, ${(-(actor.y + actor.bob)).toFixed(2)}px, 0) scale(${actor.sx.toFixed(3)}, ${actor.sy.toFixed(3)})`;
  const mirror = actor.facing * actor.artBias;
  if (actor.mode === "fallen") {
    actor.el.classList.add("is-fallen");
    actor.flip.style.transform = `scaleX(${mirror}) rotate(74deg) translate(26px, 4px)`;
  } else {
    actor.el.classList.remove("is-fallen");
    actor.flip.style.transform = `scaleX(${mirror}) rotate(${actor.lean.toFixed(2)}deg)`;
  }
  actor.legsEl.style.transform = `translateX(${actor.stride.toFixed(2)}px) rotate(${(actor.stride * 0.5).toFixed(2)}deg)`;
  const k = clamp(1 - actor.y / 260, 0.35, 1);
  actor.shadowEl.style.transform = `translateX(-50%) scale(${k.toFixed(3)})`;
  actor.shadowEl.style.opacity = (0.15 + 0.5 * k).toFixed(3);
}

function cancelMotion(actor) {
  actor.moveTarget = null;
  if (actor.onArrive) {
    const callback = actor.onArrive;
    actor.onArrive = null;
    callback();
  }
  if (actor.onLand) {
    const callback = actor.onLand;
    actor.onLand = null;
    callback();
  }
  actor.tweens.forEach((tween) => tween.res());
  actor.tweens = [];
}

function walkTo(actor, target, speed = ENGINE.walk, run = false) {
  return new Promise((resolve) => {
    cancelMotion(actor);
    if (prefersReducedMotion() || Math.abs(target - actor.x) < 0.005) {
      actor.x = target;
      if (actor.grounded && actor.mode === "walk") actor.mode = "idle";
      resolve();
      return;
    }
    actor.moveTarget = clamp(target, -0.1, 1.1);
    actor.moveSpeed = speed;
    actor.run = run;
    if (actor.grounded) actor.mode = "walk";
    actor.onArrive = resolve;
  });
}

function doJump(actor, impulse, vxAir = 0, silent = false) {
  if (!actor.grounded || actor.flying || actor.mode === "fallen") return false;
  actor.airReturnMode = actor.mode === "celebrate" ? "celebrate" : "idle";
  actor.lastJumpSilent = silent;
  actor.grounded = false;
  actor.mode = "air";
  actor.vy = impulse;
  actor.vxAir = vxAir;
  actor.squash = 0;
  actor.sy = 1.08;
  actor.sx = 0.94;
  if (!prefersReducedMotion()) spawnDust(actor, 4);
  if (!silent) AudioFX.jump();
  return true;
}

function jumpTo(actor, targetX, impulse) {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      actor.x = clamp(targetX, 0.02, 0.98);
      resolve();
      return;
    }
    if (!actor.grounded || actor.flying) {
      resolve();
      return;
    }
    const airTime = (2 * impulse) / ENGINE.gravity;
    const vx = (clamp(targetX, -0.05, 1.05) - actor.x) / airTime;
    actor.onLand = resolve;
    if (!doJump(actor, impulse, vx)) {
      actor.onLand = null;
      resolve();
    }
  });
}

function tweenActor(actor, prop, to, duration) {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      actor[prop] = to;
      resolve();
      return;
    }
    actor.tweens.push({
      prop,
      from: actor[prop],
      to,
      t: 0,
      dur: Math.max(0.001, duration),
      ease: easeInOut,
      res: resolve
    });
  });
}

function freeJump() {
  if (!canFreeRoam()) return;
  const actor = heroActor;
  if (actor.moveTarget != null || !actor.grounded) return;
  actor.airControl = true;
  doJump(actor, ENGINE.jump, 0);
}

function spawnDust(actor, count) {
  if (prefersReducedMotion() || !ui.actorLayer || !actor.shadowEl) return;
  if (ui.actorLayer.querySelectorAll(".dust").length > 36) return;
  const stageRect = ui.sceneStage.getBoundingClientRect();
  const shadowRect = actor.shadowEl.getBoundingClientRect();
  const cx = shadowRect.left + shadowRect.width / 2 - stageRect.left;
  const cy = shadowRect.top + shadowRect.height / 2 - stageRect.top;
  for (let i = 0; i < count; i += 1) {
    const dust = document.createElement("span");
    dust.className = "dust";
    dust.style.left = `${cx + (Math.random() - 0.5) * 28}px`;
    dust.style.top = `${cy + (Math.random() - 0.5) * 6}px`;
    dust.style.setProperty("--dx", `${(Math.random() - 0.5) * 30 - actor.facing * 10}px`);
    ui.actorLayer.append(dust);
    window.setTimeout(() => dust.remove(), 620);
  }
}

function spawnSparkle(actor) {
  if (prefersReducedMotion() || !ui.actorLayer || !actor.el) return;
  if (ui.actorLayer.querySelectorAll(".sparkle").length > 24) return;
  const stageRect = ui.sceneStage.getBoundingClientRect();
  const rect = actor.el.getBoundingClientRect();
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = "✦";
  sparkle.style.left = `${rect.left + rect.width / 2 - stageRect.left + (Math.random() - 0.5) * 90}px`;
  sparkle.style.top = `${rect.top + rect.height * 0.3 - stageRect.top + (Math.random() - 0.5) * 40}px`;
  ui.actorLayer.append(sparkle);
  window.setTimeout(() => sparkle.remove(), 950);
}

function getArtHTML(id) {
  if (artCache[id] === "svg") return FALLBACK_SVGS[id] || FALLBACK_SVGS.guardian;
  const source = CHARACTER_ASSETS[id] || CHARACTER_ASSETS.guardian;
  return `<img class="character-art character-art--${id}" data-art-id="${id}" src="${source}" alt="" draggable="false" decoding="async">`;
}

function renderHeroArt(hero) {
  return getArtHTML(normalizeHero(hero).classId);
}

function renderMerchantArt() {
  return getArtHTML("merchant");
}

function renderEnemyArt(monsterId) {
  return getArtHTML(MONSTERS[monsterId] ? monsterId : "slime");
}

function setActorArt(actor, html) {
  if (actor.fullEl) actor.fullEl.innerHTML = html;
  if (actor.legsEl) actor.legsEl.innerHTML = html;
}

function preloadCharacterAssets() {
  if (typeof Image !== "function") return;
  Object.keys(CHARACTER_ASSETS).forEach((id) => {
    const image = new Image();
    image.onload = () => {
      if (!artCache[id]) artCache[id] = "img";
    };
    image.onerror = () => {
      artCache[id] = "svg";
    };
    image.src = CHARACTER_ASSETS[id];
  });
}

document.addEventListener("error", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement) || !target.classList.contains("character-art")) return;
  const id = target.dataset.artId || "guardian";
  artCache[id] = "svg";
  const svg = FALLBACK_SVGS[id] || FALLBACK_SVGS.guardian;
  document.querySelectorAll(`img.character-art[data-art-id="${id}"]`).forEach((image) => {
    if (image.parentElement) image.parentElement.innerHTML = svg;
  });
}, true);

function bindCreatorControls() {
  document.querySelectorAll("[data-class]").forEach((button) => {
    button.addEventListener("click", () => {
      creatorConfig.classId = button.dataset.class;
      selectButtonInGroup("[data-class]", button);
      updateCreatorPreview();
      AudioFX.click();
    });
  });

  ui.heroNameInput.addEventListener("input", updateCreatorPreview);

  ui.characterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!ui.characterForm.reportValidity()) return;
    startAdventure();
  });

  ui.continueButton.addEventListener("click", () => {
    const savedGame = loadSavedGame();
    if (!savedGame) {
      ui.continueButton.hidden = true;
      showToast("Não foi possível localizar uma jornada salva.");
      return;
    }
    state = savedGame;
    lastLayoutKey = "";
    showGame();
    renderAll();
    walkInEntrance();
  });
}

function selectButtonInGroup(selector, selectedButton) {
  document.querySelectorAll(selector).forEach((button) => {
    const selected = button === selectedButton;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function updateCreatorPreview() {
  const heroName = ui.heroNameInput.value.trim() || "Seu herói";
  const heroClass = CLASS_DATA[creatorConfig.classId];
  const art = getArtHTML(creatorConfig.classId);
  ui.creatorAvatar.innerHTML = `<div class="preview-bob"><div class="actor__art actor__art--full">${art}</div><div class="actor__art actor__art--legs" aria-hidden="true">${art}</div></div>`;
  ui.previewName.textContent = heroName;
  ui.previewClass.textContent = `${heroClass.label} • ${heroClass.tagline}`;
}

function startAdventure() {
  const name = ui.heroNameInput.value.trim();
  state = createNewState({ name, ...creatorConfig });
  state.message = `${name}, os portões de Valdora estão fechados. A praça oferece abrigo, uma loja e o caminho para as cavernas.`;
  lastLayoutKey = "";
  showGame();
  renderAll();
  saveGame();
  showToast("Jornada iniciada. Use ← → para andar e Espaço para pular.");
  walkInEntrance();
}

function createNewState(hero) {
  const safeHero = normalizeHero(hero);
  return {
    version: 2,
    hero: safeHero,
    xp: 0,
    health: CLASS_DATA[safeHero.classId].maxHealth,
    gold: 35,
    weaponTier: 0,
    location: "city",
    phase: "playing",
    battle: null,
    lastMonsterId: null,
    defeated: { slime: 0, beast: 0 },
    message: "A jornada começa na praça de Valdora.",
    busy: false
  };
}

function normalizeHero(hero = {}) {
  const classId = CLASS_DATA[hero.classId] ? hero.classId : "guardian";
  const rawName = typeof hero.name === "string" ? hero.name.trim().slice(0, 16) : "Aventureiro";
  return {
    name: rawName || "Aventureiro",
    classId
  };
}

function showGame() {
  ui.creatorScreen.hidden = true;
  ui.gameScreen.hidden = false;
  startEngine();
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function showCreator() {
  stopEngine();
  ui.gameScreen.hidden = true;
  ui.creatorScreen.hidden = false;
  ui.continueButton.hidden = !loadSavedGame();
  input.left = false;
  input.right = false;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function createAnotherHero() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  cancelMotion(heroActor);
  cancelMotion(partnerActor);
  state = null;
  lastLayoutKey = "";
  ui.continueButton.hidden = true;
  showCreator();
}

async function walkInEntrance() {
  if (!state) return;
  const currentGame = state;
  state.busy = true;
  renderActions();
  if (state.phase !== "playing") {
    state.busy = false;
    renderActions();
    return;
  }
  heroActor.x = -0.08;
  const walks = [walkTo(heroActor, heroActor.homeX, ENGINE.walk)];
  if (!ui.partnerFigure.hidden) {
    partnerActor.x = 1.08;
    walks.push(walkTo(partnerActor, partnerActor.homeX, ENGINE.walk));
  }
  await Promise.all(walks);
  if (state !== currentGame) return;
  state.busy = false;
  renderActions();
  saveGame();
}

function saveGame() {
  if (!state) return;
  try {
    const saveableState = { ...state, busy: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveableState));
    ui.autosaveStatus.textContent = "Progresso salvo agora";
    window.clearTimeout(saveStatusTimer);
    saveStatusTimer = window.setTimeout(() => {
      ui.autosaveStatus.textContent = "Progresso salvo automaticamente";
    }, 1800);
  } catch {
    ui.autosaveStatus.textContent = "Não foi possível salvar neste navegador";
  }
}

function loadSavedGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 2 || !parsed.hero) return null;
    const hero = normalizeHero(parsed.hero);
    const normalized = {
      ...createNewState(hero),
      ...parsed,
      hero,
      xp: clampNumber(parsed.xp, 0, 9999, 0),
      health: clampNumber(parsed.health, 0, 9999, CLASS_DATA[hero.classId].maxHealth),
      gold: clampNumber(parsed.gold, 0, 99999, 35),
      weaponTier: clampNumber(parsed.weaponTier, 0, WEAPON_TIERS.length - 1, 0),
      defeated: {
        slime: clampNumber(parsed.defeated?.slime, 0, 9999, 0),
        beast: clampNumber(parsed.defeated?.beast, 0, 9999, 0)
      },
      busy: false
    };
    const allowedLocations = ["city", "shop", "cave", "battle"];
    if (!allowedLocations.includes(normalized.location)) normalized.location = "city";
    if (!["playing", "victory", "defeat"].includes(normalized.phase)) normalized.phase = "playing";
    if (normalized.battle && MONSTERS[normalized.battle.monsterId]) {
      const monster = MONSTERS[normalized.battle.monsterId];
      normalized.battle = {
        monsterId: normalized.battle.monsterId,
        health: clampNumber(normalized.battle.health, 0, monster.health, monster.health),
        maxHealth: monster.health,
        turn: clampNumber(normalized.battle.turn, 0, 9999, 0),
        skillCooldown: clampNumber(normalized.battle.skillCooldown, 0, 9, 0)
      };
    } else {
      normalized.battle = null;
      if (normalized.location === "battle") normalized.location = "city";
    }
    normalized.health = Math.min(normalized.health, getMaxHealth(normalized));
    return normalized;
  } catch {
    return null;
  }
}

function clampNumber(value, minimum, maximum, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

function renderAll() {
  if (!state) return;
  updateStats();
  renderScene();
  renderActions();
  updateJourneyDetails();
}

function updateStats() {
  const heroClass = CLASS_DATA[state.hero.classId];
  const levelInfo = getLevelInfo(state.xp);
  const maxHealth = getMaxHealth(state);
  const healthPercent = Math.max(0, Math.min(100, (state.health / maxHealth) * 100));
  ui.heroNameHud.textContent = state.hero.name;
  ui.heroClassHud.textContent = heroClass.label;
  ui.heroClassGlyph.textContent = heroClass.glyph;
  ui.levelText.textContent = levelInfo.level;
  ui.healthText.textContent = Math.max(0, state.health);
  ui.maxHealthText.textContent = maxHealth;
  ui.healthProgress.style.width = `${healthPercent}%`;
  ui.healthBar.setAttribute("aria-valuemax", String(maxHealth));
  ui.healthBar.setAttribute("aria-valuenow", String(Math.max(0, state.health)));
  ui.xpText.textContent = `${state.xp} XP`;
  ui.xpProgress.style.width = `${levelInfo.progress}%`;
  ui.xpBar.setAttribute("aria-valuenow", String(Math.round(levelInfo.progress)));
  ui.goldText.textContent = state.gold;
  ui.weaponText.textContent = getWeaponName();
}

function getLevelInfo(xp) {
  let level = 1;
  for (let index = 1; index < XP_THRESHOLDS.length; index += 1) {
    if (xp >= XP_THRESHOLDS[index]) level = index + 1;
  }
  const currentThreshold = XP_THRESHOLDS[level - 1] ?? XP_THRESHOLDS.at(-1);
  const nextThreshold = XP_THRESHOLDS[level] ?? currentThreshold + 65;
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return {
    level,
    progress: Math.max(0, Math.min(100, progress)),
    currentThreshold,
    nextThreshold
  };
}

function getMaxHealth(sourceState = state) {
  const base = CLASS_DATA[sourceState.hero.classId].maxHealth;
  const level = getLevelInfo(sourceState.xp).level;
  return base + (level - 1) * 8;
}

function getWeaponName() {
  return CLASS_DATA[state.hero.classId].weapons[state.weaponTier];
}

function renderScene() {
  const heroClass = CLASS_DATA[state.hero.classId];
  const presentation = getScenePresentation();
  ui.sceneStage.dataset.scene = presentation.sceneKey;
  ui.locationText.textContent = presentation.location;
  ui.sceneEyebrow.textContent = presentation.eyebrow;
  ui.sceneTitle.textContent = presentation.title;
  ui.storyText.textContent = state.message;
  ui.questText.textContent = getQuestText();
  ui.heroFigure.dataset.classId = state.hero.classId;
  setActorArt(heroActor, renderHeroArt(state.hero));
  ui.heroStageName.textContent = state.hero.name;
  ui.heroStageRole.textContent = heroClass.label;
  ui.heroFigure.classList.remove("is-hit", "is-casting");
  ui.partnerFigure.classList.remove("is-hit");

  if (presentation.partner) {
    ui.partnerFigure.hidden = false;
    ui.partnerFigure.dataset.monsterId = presentation.partner.id;
    setActorArt(partnerActor, presentation.partner.art);
    ui.partnerName.textContent = presentation.partner.name;
    ui.partnerRole.textContent = presentation.partner.role;
    ui.versusMark.hidden = !presentation.partner.hostile;
  } else {
    ui.partnerFigure.hidden = true;
    delete ui.partnerFigure.dataset.monsterId;
    ui.versusMark.hidden = true;
  }

  updateBattleHud();

  const key = `${state.phase}|${state.location}|${state.battle ? state.battle.monsterId : ""}`;
  if (key !== lastLayoutKey) {
    lastLayoutKey = key;
    layoutActors();
  }
}

function getScenePresentation() {
  if (state.phase === "victory") {
    return {
      sceneKey: "victory",
      location: "Portão de Valdora",
      eyebrow: "A cidade está livre",
      title: "O cerco terminou",
      partner: {
        id: "dragon",
        name: MONSTERS.dragon.name,
        role: "Derrotado",
        hostile: true,
        art: renderEnemyArt("dragon")
      }
    };
  }

  if (state.phase === "defeat") {
    const monsterId = MONSTERS[state.lastMonsterId] ? state.lastMonsterId : "dragon";
    const monster = MONSTERS[monsterId];
    return {
      sceneKey: "defeat",
      location: "Ecos da batalha",
      eyebrow: "A jornada foi interrompida",
      title: "O herói caiu",
      partner: {
        id: monsterId,
        name: monster.name,
        role: monster.role,
        hostile: true,
        art: renderEnemyArt(monsterId)
      }
    };
  }

  if (state.location === "battle" && state.battle) {
    const monsterId = state.battle.monsterId;
    const monster = MONSTERS[monsterId];
    return {
      sceneKey: `battle-${monsterId}`,
      location: monsterId === "dragon" ? "Portão do Dragão" : "Cavernas de Valdora",
      eyebrow: `Turno ${state.battle.turn + 1}`,
      title: `Confronto: ${monster.name}`,
      partner: {
        id: monsterId,
        name: monster.name,
        role: monster.role,
        hostile: true,
        art: renderEnemyArt(monsterId)
      }
    };
  }

  if (state.location === "shop") {
    return {
      sceneKey: "shop",
      location: "Forja do Portão",
      eyebrow: "Armas e provisões",
      title: "Oficina de Maela",
      partner: {
        id: "merchant",
        name: "Maela",
        role: "Mestra ferreira",
        hostile: false,
        art: renderMerchantArt()
      }
    };
  }

  if (state.location === "cave") {
    return {
      sceneKey: "cave",
      location: "Cavernas de Valdora",
      eyebrow: "Treino e recompensa",
      title: "As galerias profundas",
      partner: null
    };
  }

  return {
    sceneKey: "city",
    location: "Praça de Valdora",
    eyebrow: isDragonUnlocked() ? "O portão está aberto" : "Um refúgio entre batalhas",
    title: "A cidade sitiada",
    partner: null
  };
}

function layoutActors() {
  cancelMotion(heroActor);
  cancelMotion(partnerActor);
  const presentation = getScenePresentation();
  const partnerId = presentation.partner ? presentation.partner.id : null;

  heroActor.flying = false;
  heroActor.y = 0;
  heroActor.vy = 0;
  heroActor.vxAir = 0;
  heroActor.grounded = true;
  heroActor.airControl = false;
  heroActor.facing = 1;
  heroActor.artBias = 1;
  heroActor.mode = state.phase === "defeat" ? "fallen" : state.phase === "victory" ? "celebrate" : "idle";
  heroActor.homeX = state.location === "battle" ? 0.27 : 0.3;
  heroActor.x = heroActor.homeX;
  heroActor.sx = 1;
  heroActor.sy = 1;

  partnerActor.flying = partnerId === "dragon" && state.phase !== "victory";
  partnerActor.hoverBase = partnerActor.flying ? 52 : 0;
  partnerActor.y = partnerActor.flying ? 52 : 0;
  partnerActor.vy = 0;
  partnerActor.vxAir = 0;
  partnerActor.grounded = !partnerActor.flying;
  partnerActor.airControl = false;
  partnerActor.facing = -1;
  partnerActor.artBias = partnerId === "beast" || partnerId === "dragon" ? -1 : 1;
  partnerActor.mode = state.phase === "victory" && partnerId === "dragon" ? "fallen" : "idle";
  partnerActor.homeX = 0.73;
  partnerActor.x = partnerActor.homeX;
  partnerActor.idleTimer = 1 + Math.random() * 1.5;
  partnerActor.patrolDir = 1;
  partnerActor.sx = 1;
  partnerActor.sy = 1;
}

function updateBattleHud() {
  if (state.location !== "battle" || !state.battle || state.phase !== "playing") {
    ui.enemyHud.hidden = true;
    return;
  }
  const monster = MONSTERS[state.battle.monsterId];
  const percent = Math.max(0, (state.battle.health / state.battle.maxHealth) * 100);
  ui.enemyHud.hidden = false;
  ui.enemyName.textContent = monster.name;
  ui.enemyHealthText.textContent = Math.max(0, state.battle.health);
  ui.enemyMaxHealthText.textContent = state.battle.maxHealth;
  ui.enemyHealthProgress.style.width = `${percent}%`;
  ui.enemyHealthBar.setAttribute("aria-valuemax", String(state.battle.maxHealth));
  ui.enemyHealthBar.setAttribute("aria-valuenow", String(Math.max(0, state.battle.health)));
}

function getQuestText() {
  if (state.phase === "victory") return "Valdora foi libertada";
  if (state.phase === "defeat") return "Erga-se e tente novamente";
  const { level } = getLevelInfo(state.xp);
  if (isDragonUnlocked()) return "Enfrente Vharok no portão";
  if (level < 4 && state.weaponTier < 2) return `Prepare-se: nível ${level}/4 • arma ${state.weaponTier}/2`;
  if (level < 4) return `Alcance o nível 4 • atual ${level}`;
  return `Melhore o equipamento • atual ${state.weaponTier}/2`;
}

function updateJourneyDetails() {
  const { level } = getLevelInfo(state.xp);
  if (state.phase === "victory") {
    ui.progressText.textContent = "Vharok foi derrotado e os portões voltaram a abrir.";
  } else if (isDragonUnlocked()) {
    ui.progressText.textContent = "Preparação concluída. O Portão do Dragão está liberado.";
  } else {
    ui.progressText.textContent = `Nível ${level} de 4 • equipamento ${state.weaponTier} de 2 para liberar o dragão.`;
  }
  ui.inventoryText.textContent = `${getWeaponName()} • ${state.defeated.slime} lodo(s) • ${state.defeated.beast} besta(s)`;
}

function renderActions() {
  const actions = getAvailableActions();
  ui.actionGrid.replaceChildren();
  actions.forEach((action, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-button action-button--${action.tone || "quiet"}`;
    button.dataset.key = String(index + 1);
    button.disabled = Boolean(action.disabled || state.busy);
    const label = document.createElement("span");
    label.className = "action-label";
    label.textContent = action.label;
    const hint = document.createElement("span");
    hint.className = "action-hint";
    hint.textContent = action.hint;
    button.append(label, hint);
    button.addEventListener("click", action.action);
    ui.actionGrid.append(button);
  });
  updateMoveControls();
}

function updateMoveControls() {
  if (!state) return;
  const exploration = state.phase === "playing" && ["city", "shop", "cave"].includes(state.location);
  ui.moveControls.hidden = !exploration;
  ui.moveHint.hidden = state.phase !== "playing";
  if (state.phase === "playing") {
    ui.moveHint.textContent = exploration ? "← → andar • Espaço pular" : "Combate por turnos • teclas 1–4";
  }
  const disabled = !canFreeRoam();
  ui.moveLeft.disabled = disabled;
  ui.moveRight.disabled = disabled;
  ui.jumpButton.disabled = disabled;
}

function getAvailableActions() {
  if (state.phase === "victory") {
    return [
      { label: "Nova aventura", hint: "Recomeçar com o mesmo herói", tone: "gold", action: restartWithSameHero },
      { label: "Criar outro herói", hint: "Voltar ao criador de personagem", tone: "quiet", action: createAnotherHero }
    ];
  }

  if (state.phase === "defeat") {
    return [
      { label: "Tentar novamente", hint: "Reiniciar a jornada com este herói", tone: "gold", action: restartWithSameHero },
      { label: "Criar outro herói", hint: "Escolher outra classe", tone: "quiet", action: createAnotherHero }
    ];
  }

  if (state.location === "battle" && state.battle) {
    const heroClass = CLASS_DATA[state.hero.classId];
    const cooldown = state.battle.skillCooldown;
    return [
      {
        label: "Atacar",
        hint: `Golpe com ${getWeaponName().toLowerCase()}`,
        tone: "primary",
        action: () => performPlayerAttack("attack")
      },
      {
        label: cooldown > 0 ? `${heroClass.skill.name} (${cooldown})` : heroClass.skill.name,
        hint: cooldown > 0 ? `Disponível em ${cooldown} turno(s)` : heroClass.skill.description,
        tone: "gold",
        disabled: cooldown > 0,
        action: () => performPlayerAttack("skill")
      },
      {
        label: "Esquivar",
        hint: `${Math.round(heroClass.dodgeChance * 100)}% de chance de evitar o golpe`,
        tone: "quiet",
        action: performDodge
      },
      {
        label: "Recuar",
        hint: "Sair da batalha sem receber recompensa",
        tone: "danger",
        action: fleeBattle
      }
    ];
  }

  if (state.location === "shop") {
    const nextTier = state.weaponTier + 1;
    const hasUpgrade = nextTier < WEAPON_TIERS.length;
    const upgradeCost = hasUpgrade ? WEAPON_TIERS[nextTier].cost : 0;
    return [
      {
        label: "Comprar curativo",
        hint: state.health >= getMaxHealth(state) ? "A vida já está completa" : "Recupera 35 de vida • 15 ouro",
        tone: "primary",
        disabled: state.gold < 15 || state.health >= getMaxHealth(state),
        action: buyHealing
      },
      {
        label: hasUpgrade ? `Melhorar: ${CLASS_DATA[state.hero.classId].weapons[nextTier]}` : "Equipamento máximo",
        hint: hasUpgrade ? `${upgradeCost} ouro • aumenta o dano` : "A forja não possui melhoria superior",
        tone: "gold",
        disabled: !hasUpgrade || state.gold < upgradeCost,
        action: upgradeWeapon
      },
      {
        label: "Voltar à praça",
        hint: "Retornar ao centro de Valdora",
        tone: "quiet",
        action: () => travelTo("city")
      }
    ];
  }

  if (state.location === "cave") {
    return [
      { label: "Enfrentar lodo", hint: "Risco baixo • 10 XP • 15 ouro", tone: "primary", action: () => startBattle("slime") },
      { label: "Caçar a besta", hint: "Risco médio • 18 XP • 30 ouro", tone: "danger", action: () => startBattle("beast") },
      { label: "Voltar à praça", hint: "Retornar ao centro de Valdora", tone: "quiet", action: () => travelTo("city") }
    ];
  }

  const unlocked = isDragonUnlocked();
  return [
    { label: "Visitar a forja", hint: "Curativos e melhorias de equipamento", tone: "gold", action: () => travelTo("shop") },
    { label: "Explorar as cavernas", hint: "Treine, conquiste XP e encontre ouro", tone: "primary", action: () => travelTo("cave") },
    {
      label: unlocked ? "Enfrentar Vharok" : "Portão do Dragão bloqueado",
      hint: unlocked ? "Batalha final • risco extremo" : "Requer nível 4 e equipamento nível 2",
      tone: "danger",
      disabled: !unlocked,
      action: () => startBattle("dragon")
    }
  ];
}

function travelMessage(location) {
  if (location === "city") {
    return isDragonUnlocked()
      ? "O sino do portão ecoa: Vharok está ao alcance. Você ainda pode visitar a forja ou treinar antes da batalha final."
      : "Na praça, moradores acompanham seu progresso. A forja prepara equipamentos enquanto as cavernas oferecem treino e ouro.";
  }
  if (location === "shop") {
    return "Maela avalia seu equipamento. Curativos restauram vida; armas melhores aumentam o dano e aproximam você do dragão.";
  }
  return "As cavernas oferecem dois caminhos: o lodo é um treino seguro; a besta concede recompensas maiores, mas ataca com força.";
}

async function travelTo(location) {
  if (!state || state.busy || !["city", "shop", "cave"].includes(location) || state.location === location) return;
  const currentGame = state;
  state.busy = true;
  renderActions();
  AudioFX.click();
  await walkTo(heroActor, 1.08, ENGINE.walk * 1.25, true);
  if (state !== currentGame) return;
  ui.sceneStage.classList.add("is-switching");
  await waitMs(240);
  if (state !== currentGame) return;
  state.location = location;
  state.battle = null;
  state.message = travelMessage(location);
  lastLayoutKey = "";
  renderAll();
  heroActor.x = -0.08;
  if (!ui.partnerFigure.hidden) partnerActor.x = 1.08;
  ui.sceneStage.classList.remove("is-switching");
  const walks = [walkTo(heroActor, heroActor.homeX, ENGINE.walk)];
  if (!ui.partnerFigure.hidden) walks.push(walkTo(partnerActor, partnerActor.homeX, ENGINE.walk));
  await Promise.all(walks);
  if (state !== currentGame) return;
  state.busy = false;
  renderActions();
  saveGame();
}

function buyHealing() {
  if (!state || state.busy) return;
  const maxHealth = getMaxHealth(state);
  if (state.gold < 15 || state.health >= maxHealth) return;
  const recovered = Math.min(35, maxHealth - state.health);
  state.gold -= 15;
  state.health += recovered;
  state.message = `Maela aplica um curativo reforçado. Você recupera ${recovered} pontos de vida.`;
  renderAll();
  saveGame();
  showFloatingNumber(ui.heroFigure, `+${recovered}`, true);
  AudioFX.heal();
  showToast(`+${recovered} de vida`);
}

function upgradeWeapon() {
  if (!state || state.busy) return;
  const nextTier = state.weaponTier + 1;
  if (nextTier >= WEAPON_TIERS.length) return;
  const cost = WEAPON_TIERS[nextTier].cost;
  if (state.gold < cost) return;
  state.gold -= cost;
  state.weaponTier = nextTier;
  state.message = `Maela conclui o trabalho: agora você carrega ${getWeaponName().toLowerCase()}. Seu dano aumentou.`;
  const unlockedNow = isDragonUnlocked();
  renderAll();
  saveGame();
  AudioFX.coin();
  if (unlockedNow) AudioFX.unlock();
  showToast(unlockedNow ? "O Portão do Dragão foi liberado!" : "Equipamento melhorado");
}

async function startBattle(monsterId) {
  if (!state || state.busy || !MONSTERS[monsterId]) return;
  if (monsterId === "dragon" && !isDragonUnlocked()) {
    showToast("Alcance o nível 4 e melhore o equipamento até o nível 2.");
    return;
  }
  const monster = MONSTERS[monsterId];
  const currentGame = state;
  state.location = "battle";
  state.battle = {
    monsterId,
    health: monster.health,
    maxHealth: monster.health,
    turn: 0,
    skillCooldown: 0
  };
  const currentBattle = state.battle;
  state.lastMonsterId = monsterId;
  state.message = monster.intro;
  state.busy = true;
  lastLayoutKey = "";
  renderAll();
  saveGame();
  heroActor.x = -0.08;
  partnerActor.x = 1.08;
  await Promise.all([
    walkTo(heroActor, heroActor.homeX, ENGINE.run * 0.8, true),
    walkTo(partnerActor, partnerActor.homeX, ENGINE.walk)
  ]);
  if (!isCurrentBattle(currentGame, currentBattle)) return;
  state.busy = false;
  renderActions();
  saveGame();
}

function calculatePlayerDamage(multiplier, forceCriticalBoost) {
  const heroClass = CLASS_DATA[state.hero.classId];
  const level = getLevelInfo(state.xp).level;
  const weaponPower = WEAPON_TIERS[state.weaponTier].power;
  const baseDamage = weaponPower + heroClass.attackBonus + level * 2 + randomInt(0, 4);
  const criticalChance = forceCriticalBoost && state.hero.classId === "hunter"
    ? Math.min(0.55, heroClass.criticalChance + 0.2)
    : heroClass.criticalChance;
  const critical = Math.random() < criticalChance;
  return {
    damage: Math.max(1, Math.round(baseDamage * multiplier * (critical ? 1.45 : 1))),
    critical
  };
}

function flashActor(actor) {
  if (!actor.el) return;
  actor.el.classList.remove("is-hit");
  void actor.el.offsetWidth;
  actor.el.classList.add("is-hit");
  window.setTimeout(() => actor.el.classList.remove("is-hit"), 400);
}

function applyHitToEnemy(attack, mode) {
  const heroClass = CLASS_DATA[state.hero.classId];
  const battle = state.battle;
  battle.health = Math.max(0, battle.health - attack.damage);
  let summary = mode === "skill"
    ? `${state.hero.name} usa ${heroClass.skill.name} e causa ${attack.damage} de dano`
    : `${state.hero.name} causa ${attack.damage} de dano`;
  if (attack.critical) summary += " com um acerto crítico";
  summary += ".";
  const impactType = state.hero.classId === "arcanist" ? "arcane" : state.hero.classId;
  createImpact(ui.partnerFigure, impactType);
  showFloatingNumber(ui.partnerFigure, `-${attack.damage}`);
  flashActor(partnerActor);
  partnerActor.x = clamp(partnerActor.x + 0.015, 0.05, 0.95);
  if (attack.critical) {
    AudioFX.crit();
    shakeArena();
  } else {
    AudioFX.hit();
  }
  if (mode === "skill" && heroClass.skill.healing) {
    const recovered = Math.min(heroClass.skill.healing, getMaxHealth(state) - state.health);
    if (recovered > 0) {
      state.health += recovered;
      summary += ` A chama devolve ${recovered} de vida.`;
      showFloatingNumber(ui.heroFigure, `+${recovered}`, true);
      AudioFX.heal();
    }
  }
  updateStats();
  updateBattleHud();
  return summary;
}

function applyHitToHero(damage) {
  state.health = Math.max(0, state.health - damage);
  flashActor(heroActor);
  showFloatingNumber(ui.heroFigure, `-${damage}`);
  heroActor.x = clamp(heroActor.x - 0.012, 0.05, 0.95);
  AudioFX.hit();
  updateStats();
}

function showMiss() {
  showFloatingNumber(ui.heroFigure, "ESQUIVA", false, true);
  AudioFX.whoosh();
}

async function performPlayerAttack(mode) {
  if (!state || state.busy || !state.battle) return;
  const heroClass = CLASS_DATA[state.hero.classId];
  if (mode === "skill" && state.battle.skillCooldown > 0) return;
  const currentGame = state;
  const currentBattle = state.battle;
  state.busy = true;
  renderActions();
  const attack = calculatePlayerDamage(mode === "skill" ? heroClass.skill.multiplier : 1, mode === "skill");
  if (mode === "skill") state.battle.skillCooldown = heroClass.skill.cooldown;
  const hero = heroActor;
  const partner = partnerActor;
  hero.facing = 1;
  let actionSummary = "";

  if (state.hero.classId === "guardian") {
    await walkTo(hero, partner.x - 0.14, ENGINE.run, true);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    const leap = jumpTo(hero, partner.x - 0.09, 560);
    await waitMs(200);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    actionSummary = applyHitToEnemy(attack, mode);
    await leap;
  } else {
    await walkTo(hero, partner.x - 0.36, ENGINE.run, true);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    hero.mode = "idle";
    ui.heroFigure.classList.add("is-casting");
    AudioFX.whoosh();
    await launchProjectile(ui.heroFigure, ui.partnerFigure, state.hero.classId === "hunter" ? "arrow" : "arcane");
    ui.heroFigure.classList.remove("is-casting");
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    actionSummary = applyHitToEnemy(attack, mode);
    await waitMs(120);
  }

  if (!isCurrentBattle(currentGame, currentBattle)) return;
  await walkTo(hero, hero.homeX, ENGINE.walk * 1.15);
  if (!isCurrentBattle(currentGame, currentBattle)) return;
  state.message = actionSummary;
  ui.storyText.textContent = state.message;
  saveGame();

  if (currentBattle.health <= 0) {
    await waitMs(320);
    if (isCurrentBattle(currentGame, currentBattle)) await resolveBattleVictory();
    return;
  }

  await waitMs(220);
  if (!isCurrentBattle(currentGame, currentBattle)) return;
  await enemyTurn({
    actionSummary,
    usedSkill: mode === "skill",
    protection: mode === "skill" ? heroClass.skill.protection || 0 : 0,
    dodge: false
  });
}

async function performDodge() {
  if (!state || state.busy || !state.battle) return;
  const currentGame = state;
  const currentBattle = state.battle;
  state.busy = true;
  renderActions();
  const spotX = heroActor.x;
  state.message = `${state.hero.name} observa o movimento do inimigo e prepara a esquiva.`;
  ui.storyText.textContent = state.message;
  saveGame();
  heroActor.airControl = false;
  await jumpTo(heroActor, clamp(spotX - 0.17, 0.08, 0.9), 780);
  if (!isCurrentBattle(currentGame, currentBattle)) return;
  await enemyTurn({
    actionSummary: `${state.hero.name} tenta antecipar o próximo golpe.`,
    usedSkill: false,
    protection: 0,
    dodge: true,
    heroSpotX: spotX
  });
}

async function enemyTurn(context) {
  if (!state || !state.battle) return;
  const currentGame = state;
  const currentBattle = state.battle;
  const monster = MONSTERS[state.battle.monsterId];
  const heroClass = CLASS_DATA[state.hero.classId];
  const dodged = context.dodge && Math.random() < heroClass.dodgeChance;
  const partner = partnerActor;
  const hero = heroActor;
  partner.facing = -1;
  const aimX = dodged ? context.heroSpotX ?? hero.x : hero.x;
  const rawDamage = randomInt(monster.minDamage, monster.maxDamage);
  const reduction = Math.min(0.75, heroClass.defense + (context.protection || 0));
  const damage = Math.max(1, Math.round(rawDamage * (1 - reduction)));

  if (currentBattle.monsterId === "slime") {
    partner.squash = 0.18;
    await waitMs(140);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    await jumpTo(partner, clamp(aimX + 0.1, 0.1, 0.95), 760);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    if (dodged) showMiss();
    else {
      applyHitToHero(damage);
      shakeArena();
    }
    await jumpTo(partner, partner.homeX, 520);
  } else if (currentBattle.monsterId === "beast") {
    await walkTo(partner, clamp(aimX + 0.13, 0.1, 0.95), ENGINE.run * 1.05, true);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    if (dodged) showMiss();
    else {
      applyHitToHero(damage);
      shakeArena();
    }
    await waitMs(120);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    await walkTo(partner, partner.homeX, ENGINE.walk * 1.2);
  } else {
    await Promise.all([
      tweenActor(partner, "x", clamp(aimX + 0.24, 0.2, 0.95), 0.5),
      tweenActor(partner, "hoverBase", 18, 0.5)
    ]);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    AudioFX.whoosh();
    await launchProjectile(ui.partnerFigure, ui.heroFigure, "flame");
    if (!isCurrentBattle(currentGame, currentBattle)) return;
    if (dodged) showMiss();
    else {
      applyHitToHero(damage);
      shakeArena();
    }
    await Promise.all([
      tweenActor(partner, "x", partner.homeX, 0.6),
      tweenActor(partner, "hoverBase", 52, 0.6)
    ]);
  }

  if (!isCurrentBattle(currentGame, currentBattle)) return;
  if (!context.usedSkill && currentBattle.skillCooldown > 0) currentBattle.skillCooldown -= 1;
  currentBattle.turn += 1;
  state.message = dodged
    ? `${context.actionSummary} A esquiva funciona: ${monster.name} erra o ataque.`
    : `${context.actionSummary} ${monster.name} responde e causa ${damage} de dano.`;
  updateStats();
  updateBattleHud();
  ui.storyText.textContent = state.message;

  if (state.health <= 0) {
    saveGame();
    await waitMs(340);
    if (isCurrentBattle(currentGame, currentBattle)) resolveDefeat();
    return;
  }

  if (Math.abs(hero.x - hero.homeX) > 0.01) {
    await walkTo(hero, hero.homeX, ENGINE.walk * 1.2);
    if (!isCurrentBattle(currentGame, currentBattle)) return;
  }

  state.busy = false;
  renderActions();
  saveGame();
}

function isCurrentBattle(game, battle) {
  return state === game && state.battle === battle && state.phase === "playing";
}

async function fleeBattle() {
  if (!state || state.busy || !state.battle) return;
  const currentGame = state;
  const monsterId = state.battle.monsterId;
  const monsterName = MONSTERS[monsterId].name;
  state.battle = null;
  state.location = monsterId === "dragon" ? "city" : "cave";
  state.busy = true;
  state.message = `${state.hero.name} recua diante de ${monsterName}. A batalha termina sem recompensas, mas a vida atual é preservada.`;
  lastLayoutKey = "";
  renderAll();
  saveGame();
  AudioFX.click();
  heroActor.x = -0.08;
  await walkTo(heroActor, heroActor.homeX, ENGINE.walk);
  if (state !== currentGame) return;
  state.busy = false;
  renderActions();
  saveGame();
}

async function resolveBattleVictory() {
  if (!state || !state.battle) return;
  const currentGame = state;
  const monsterId = state.battle.monsterId;
  const monster = MONSTERS[monsterId];
  const previousLevel = getLevelInfo(state.xp).level;
  const wasUnlocked = isDragonUnlocked();
  state.xp += monster.xp;
  state.gold += monster.gold;
  state.lastMonsterId = monsterId;
  state.battle = null;
  partnerActor.mode = "fallen";
  updateBattleHud();
  AudioFX.coin();

  if (monsterId === "dragon") {
    state.phase = "victory";
    state.busy = false;
    state.message = `${state.hero.name} derrota Vharok. As asas do dragão silenciam e os portões de Valdora voltam a se abrir.`;
    lastLayoutKey = "";
    renderAll();
    saveGame();
    AudioFX.victory();
    showToast("Vitória! Valdora está livre.");
    return;
  }

  state.defeated[monsterId] += 1;
  const newLevel = getLevelInfo(state.xp).level;
  let levelMessage = "";
  if (newLevel > previousLevel) {
    const recovered = Math.min(getMaxHealth(state) - state.health, 18 * (newLevel - previousLevel));
    state.health += Math.max(0, recovered);
    levelMessage = ` Você alcançou o nível ${newLevel} e recuperou ${Math.max(0, recovered)} de vida.`;
  }
  state.message = `${monster.name} foi derrotado. Recompensa: ${monster.xp} XP e ${monster.gold} de ouro.${levelMessage}`;
  const unlockedNow = !wasUnlocked && isDragonUnlocked();
  state.location = "cave";
  state.busy = true;
  updateStats();
  updateJourneyDetails();
  ui.storyText.textContent = state.message;
  renderActions();
  showToast(unlockedNow ? "O Portão do Dragão foi liberado!" : `+${monster.xp} XP • +${monster.gold} ouro`);
  if (unlockedNow) AudioFX.unlock();
  await waitMs(850);
  if (state !== currentGame || state.phase !== "playing") return;
  lastLayoutKey = "";
  renderAll();
  heroActor.x = -0.08;
  await walkTo(heroActor, heroActor.homeX, ENGINE.walk);
  if (state !== currentGame) return;
  state.busy = false;
  renderActions();
  saveGame();
}

function resolveDefeat() {
  if (!state || state.phase !== "playing") return;
  const monster = MONSTERS[state.lastMonsterId] || MONSTERS.dragon;
  state.phase = "defeat";
  state.battle = null;
  state.busy = false;
  state.message = `${state.hero.name} cai diante de ${monster.name}. A experiência da jornada permanece como aprendizado — você pode tentar novamente.`;
  lastLayoutKey = "";
  renderAll();
  saveGame();
  AudioFX.defeat();
}

async function restartWithSameHero() {
  if (!state) return;
  const hero = { ...state.hero };
  state = createNewState(hero);
  state.message = `${hero.name} retorna à praça com uma nova estratégia. A jornada recomeça.`;
  lastLayoutKey = "";
  renderAll();
  saveGame();
  await walkInEntrance();
}

function isDragonUnlocked() {
  if (!state) return false;
  return getLevelInfo(state.xp).level >= 4 && state.weaponTier >= 2;
}

async function launchProjectile(attacker, target, type) {
  if (!ui.sceneStage || !attacker || !target) return;
  const stage = ui.sceneStage.getBoundingClientRect();
  const source = attacker.getBoundingClientRect();
  const destination = target.getBoundingClientRect();
  const isHero = attacker === ui.heroFigure;
  const startX = isHero ? source.right - source.width * 0.25 : source.left + source.width * 0.25;
  const startY = source.top + source.height * 0.38;
  const endX = isHero ? destination.left + destination.width * 0.35 : destination.right - destination.width * 0.35;
  const endY = destination.top + destination.height * 0.38;
  const projectile = document.createElement("span");
  projectile.className = `combat-projectile combat-projectile--${type}`;
  projectile.style.left = `${startX - stage.left}px`;
  projectile.style.top = `${startY - stage.top}px`;
  ui.sceneStage.append(projectile);
  const distanceX = endX - startX;
  const distanceY = endY - startY;
  const direction = isHero ? 1 : -1;
  const duration = prefersReducedMotion() ? 1 : type === "flame" ? 450 : 330;
  try {
    if (typeof projectile.animate === "function") {
      const animation = projectile.animate(
        [
          { transform: `translate(0px, 0px) scaleX(${direction})`, opacity: 0.8 },
          { transform: `translate(${distanceX}px, ${distanceY}px) scaleX(${direction})`, opacity: 1 }
        ],
        { duration, easing: "ease-in", fill: "forwards" }
      );
      await animation.finished.catch(() => {});
    } else {
      await waitMs(duration);
    }
  } finally {
    projectile.remove();
  }
}

function createImpact(target, type = "guardian") {
  if (!target) return;
  const impact = document.createElement("span");
  const allowedTypes = ["guardian", "hunter", "arcanist", "arcane", "slime", "beast", "dragon", "flame"];
  const safeType = allowedTypes.includes(type) ? type : "guardian";
  impact.className = `impact-fx impact-fx--${safeType}`;
  impact.setAttribute("aria-hidden", "true");
  target.append(impact);
  window.setTimeout(() => impact.remove(), 480);
}

function shakeArena() {
  if (!ui.sceneStage || prefersReducedMotion()) return;
  ui.sceneStage.classList.remove("is-shaking");
  void ui.sceneStage.offsetWidth;
  ui.sceneStage.classList.add("is-shaking");
  window.setTimeout(() => ui.sceneStage.classList.remove("is-shaking"), 460);
}

function showFloatingNumber(container, value, healing = false, dodge = false) {
  if (!container) return;
  const number = document.createElement("span");
  number.className = "damage-number";
  if (healing) number.classList.add("damage-number--heal");
  if (dodge) number.classList.add("damage-number--dodge");
  number.textContent = value;
  container.append(number);
  window.setTimeout(() => number.remove(), 760);
}

function waitMs(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, prefersReducedMotion() ? 0 : duration);
  });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => ui.toast.classList.remove("is-visible"), 2600);
}

function randomInt(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function bindMoveButton(button, direction) {
  const press = (event) => {
    event.preventDefault();
    if (button.disabled) return;
    input[direction] = true;
    if (typeof button.setPointerCapture === "function") button.setPointerCapture(event.pointerId);
  };
  const release = () => {
    input[direction] = false;
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("contextmenu", (event) => event.preventDefault());
}

function handleKeyDown(event) {
  if (ui.gameScreen.hidden || ui.resetDialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
  const key = event.key;
  const number = Number(key);
  if (number >= 1 && number <= 4) {
    const button = ui.actionGrid.querySelectorAll(".action-button")[number - 1];
    if (button && !button.disabled) {
      button.click();
      event.preventDefault();
    }
    return;
  }
  if (!canFreeRoam()) return;
  if (key === "ArrowLeft" || key === "a" || key === "A") {
    input.left = true;
    event.preventDefault();
  } else if (key === "ArrowRight" || key === "d" || key === "D") {
    input.right = true;
    event.preventDefault();
  } else if ((key === " " || key === "ArrowUp" || key === "w" || key === "W") && !event.repeat) {
    freeJump();
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  const key = event.key;
  if (key === "ArrowLeft" || key === "a" || key === "A") input.left = false;
  if (key === "ArrowRight" || key === "d" || key === "D") input.right = false;
}

function bindGlobalControls() {
  ui.newHeroButton.addEventListener("click", () => {
    if (typeof ui.resetDialog.showModal === "function") {
      ui.resetDialog.showModal();
    } else if (window.confirm("Criar um novo herói e substituir o progresso atual?")) {
      createAnotherHero();
    }
  });

  ui.confirmResetButton.addEventListener("click", () => {
    if (ui.resetDialog.open) ui.resetDialog.close();
    createAnotherHero();
  });

  ui.soundToggleCreator.addEventListener("click", () => AudioFX.setEnabled(!AudioFX.enabled));
  ui.soundToggleGame.addEventListener("click", () => AudioFX.setEnabled(!AudioFX.enabled));

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", () => {
    input.left = false;
    input.right = false;
  });

  bindMoveButton(ui.moveLeft, "left");
  bindMoveButton(ui.moveRight, "right");
  ui.jumpButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    freeJump();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopEngine();
    else if (!ui.gameScreen.hidden) startEngine();
  });

  document.addEventListener("pointerdown", () => AudioFX.ensure(), { once: true });
}

function initialize() {
  bindActor(heroActor, ui.heroFigure);
  bindActor(partnerActor, ui.partnerFigure);
  preloadCharacterAssets();
  bindCreatorControls();
  bindGlobalControls();
  updateCreatorPreview();
  updateSoundButtons();
  const savedGame = loadSavedGame();
  if (savedGame) ui.continueButton.hidden = false;
}

initialize();