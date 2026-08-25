"use strict";

const STORAGE_KEY = "cronicas-de-valdora-save-v2";

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
      protection: 0.45,
    },
    weapons: ["Espada curta", "Espada reforçada", "Lâmina rúnica", "Espada de Valdora"],
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
      protection: 0,
    },
    weapons: ["Arco curto", "Arco composto", "Arco lunar", "Arco de Valdora"],
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
      healing: 10,
    },
    weapons: ["Cajado de freixo", "Cajado de cristal", "Cetro astral", "Cetro de Valdora"],
  },
};

const SKIN_TONES = {
  warm: "#efbb8a",
  golden: "#ca895d",
  brown: "#8c563d",
  deep: "#553525",
};

const ACCENT_COLORS = {
  teal: { base: "#3f9688", dark: "#255c56", light: "#76c9b6" },
  blue: { base: "#557fb0", dark: "#354f78", light: "#8eb5db" },
  violet: { base: "#8066a7", dark: "#4e3f6e", light: "#b39bd1" },
  ember: { base: "#a95d4f", dark: "#6f3c36", light: "#d9977e" },
};

const WEAPON_TIERS = [
  { power: 8, cost: 0 },
  { power: 15, cost: 40 },
  { power: 23, cost: 70 },
  { power: 32, cost: 110 },
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
    intro: "Um lodo esmeralda bloqueia a trilha e se prepara para saltar.",
  },
  beast: {
    name: "Besta das presas",
    role: "Predador ancestral",
    health: 72,
    minDamage: 10,
    maxDamage: 15,
    xp: 18,
    gold: 30,
    intro: "A besta deixa as sombras. As presas riscadas mostram que ela já venceu outras batalhas.",
  },
  dragon: {
    name: "Vharok, o dragão",
    role: "Guardião do portão",
    health: 185,
    minDamage: 14,
    maxDamage: 22,
    xp: 60,
    gold: 120,
    intro: "Vharok abre as asas sobre o portão. Toda a jornada levou a este confronto.",
  },
};

const XP_THRESHOLDS = [0, 12, 30, 55, 90, 135, 190];

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
  locationText: document.querySelector("#locationText"),
  questText: document.querySelector("#questText"),
  enemyHud: document.querySelector("#enemyHud"),
  enemyName: document.querySelector("#enemyName"),
  enemyHealthText: document.querySelector("#enemyHealthText"),
  enemyMaxHealthText: document.querySelector("#enemyMaxHealthText"),
  enemyHealthBar: document.querySelector("#enemyHealthBar"),
  enemyHealthProgress: document.querySelector("#enemyHealthProgress"),
  heroFigure: document.querySelector("#heroFigure"),
  heroAvatar: document.querySelector("#heroAvatar"),
  heroStageName: document.querySelector("#heroStageName"),
  heroStageRole: document.querySelector("#heroStageRole"),
  versusMark: document.querySelector("#versusMark"),
  partnerFigure: document.querySelector("#partnerFigure"),
  partnerAvatar: document.querySelector("#partnerAvatar"),
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
};

let creatorConfig = {
  classId: "guardian",
  skin: "warm",
  accent: "teal",
  hair: "short",
};

let state = null;
let toastTimer = null;
let saveStatusTimer = null;

initialize();

function initialize() {
  bindCreatorControls();
  bindGlobalControls();
  updateCreatorPreview();

  const savedGame = loadSavedGame();
  if (savedGame) {
    ui.continueButton.hidden = false;
  }
}

function bindCreatorControls() {
  document.querySelectorAll("[data-class]").forEach((button) => {
    button.addEventListener("click", () => {
      creatorConfig.classId = button.dataset.class;
      selectButtonInGroup("[data-class]", button);
      updateCreatorPreview();
    });
  });

  document.querySelectorAll("[data-skin]").forEach((button) => {
    button.addEventListener("click", () => {
      creatorConfig.skin = button.dataset.skin;
      selectButtonInGroup("[data-skin]", button);
      updateCreatorPreview();
    });
  });

  document.querySelectorAll("[data-accent]").forEach((button) => {
    button.addEventListener("click", () => {
      creatorConfig.accent = button.dataset.accent;
      selectButtonInGroup("[data-accent]", button);
      updateCreatorPreview();
    });
  });

  document.querySelectorAll("[data-hair]").forEach((button) => {
    button.addEventListener("click", () => {
      creatorConfig.hair = button.dataset.hair;
      selectButtonInGroup("[data-hair]", button);
      updateCreatorPreview();
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
    showGame();
    renderAll();
  });
}

function bindGlobalControls() {
  ui.newHeroButton.addEventListener("click", () => {
    if (typeof ui.resetDialog.showModal === "function") {
      ui.resetDialog.showModal();
    } else if (window.confirm("Criar um novo herói e substituir o progresso atual?")) {
      createAnotherHero();
    }
  });

  ui.confirmResetButton.addEventListener("click", createAnotherHero);

  document.addEventListener("keydown", (event) => {
    if (ui.gameScreen.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    const number = Number(event.key);
    if (number < 1 || number > 4) return;
    const actionButton = ui.actionGrid.querySelectorAll(".action-button")[number - 1];
    if (actionButton && !actionButton.disabled) actionButton.click();
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
  ui.creatorAvatar.innerHTML = renderHeroSvg(creatorConfig);
  ui.previewName.textContent = heroName;
  ui.previewClass.textContent = `${heroClass.label} • ${heroClass.tagline}`;
}

function startAdventure() {
  const name = ui.heroNameInput.value.trim();
  const hero = { name, ...creatorConfig };
  state = createNewState(hero);
  state.message = `${name}, os portões de Valdora estão fechados. A praça oferece abrigo, uma loja e o caminho para as cavernas.`;
  showGame();
  renderAll();
  saveGame();
  showToast("Jornada iniciada. Seu progresso será salvo automaticamente.");
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
    busy: false,
  };
}

function normalizeHero(hero = {}) {
  const classId = CLASS_DATA[hero.classId] ? hero.classId : "guardian";
  const skin = SKIN_TONES[hero.skin] ? hero.skin : "warm";
  const accent = ACCENT_COLORS[hero.accent] ? hero.accent : "teal";
  const hair = ["short", "crest", "long"].includes(hero.hair) ? hero.hair : "short";
  const rawName = typeof hero.name === "string" ? hero.name.trim().slice(0, 16) : "Aventureiro";
  return { name: rawName || "Aventureiro", classId, skin, accent, hair };
}

function showGame() {
  ui.creatorScreen.hidden = true;
  ui.gameScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCreator() {
  ui.gameScreen.hidden = true;
  ui.creatorScreen.hidden = false;
  ui.continueButton.hidden = !loadSavedGame();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createAnotherHero() {
  localStorage.removeItem(STORAGE_KEY);
  state = null;
  ui.continueButton.hidden = true;
  showCreator();
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
  } catch (error) {
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
        beast: clampNumber(parsed.defeated?.beast, 0, 9999, 0),
      },
      busy: false,
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
        skillCooldown: clampNumber(normalized.battle.skillCooldown, 0, 9, 0),
      };
    } else {
      normalized.battle = null;
      if (normalized.location === "battle") normalized.location = "city";
    }

    normalized.health = Math.min(normalized.health, getMaxHealth(normalized));
    return normalized;
  } catch (error) {
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
  return { level, progress: Math.max(0, Math.min(100, progress)), currentThreshold, nextThreshold };
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
  ui.heroAvatar.innerHTML = renderHeroSvg(state.hero);
  ui.heroStageName.textContent = state.hero.name;
  ui.heroStageRole.textContent = heroClass.label;

  ui.heroFigure.classList.toggle("is-defeated", state.phase === "defeat");
  ui.partnerFigure.classList.remove("is-defeated");
  ui.enemyHud.hidden = true;
  ui.partnerFigure.hidden = true;
  ui.versusMark.hidden = true;

  if (presentation.partner) {
    ui.partnerFigure.hidden = false;
    ui.partnerAvatar.innerHTML = presentation.partner.svg;
    ui.partnerName.textContent = presentation.partner.name;
    ui.partnerRole.textContent = presentation.partner.role;
    ui.versusMark.hidden = !presentation.partner.hostile;
    ui.partnerFigure.classList.toggle("is-defeated", Boolean(presentation.partner.defeated));
  }

  updateBattleHud();
}

function getScenePresentation() {
  if (state.phase === "victory") {
    return {
      sceneKey: "victory",
      location: "Portão de Valdora",
      eyebrow: "A cidade está livre",
      title: "O cerco terminou",
      partner: {
        name: MONSTERS.dragon.name,
        role: "Derrotado",
        hostile: true,
        defeated: true,
        svg: renderEnemySvg("dragon"),
      },
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
        name: monster.name,
        role: monster.role,
        hostile: true,
        svg: renderEnemySvg(monsterId),
      },
    };
  }

  if (state.location === "battle" && state.battle) {
    const monster = MONSTERS[state.battle.monsterId];
    return {
      sceneKey: `battle-${state.battle.monsterId}`,
      location: state.battle.monsterId === "dragon" ? "Portão do Dragão" : "Cavernas de Valdora",
      eyebrow: `Turno ${state.battle.turn + 1}`,
      title: `Confronto: ${monster.name}`,
      partner: {
        name: monster.name,
        role: monster.role,
        hostile: true,
        svg: renderEnemySvg(state.battle.monsterId),
      },
    };
  }

  if (state.location === "shop") {
    return {
      sceneKey: "shop",
      location: "Forja do Portão",
      eyebrow: "Armas e provisões",
      title: "Oficina de Maela",
      partner: {
        name: "Maela",
        role: "Mestra ferreira",
        hostile: false,
        svg: renderMerchantSvg(),
      },
    };
  }

  if (state.location === "cave") {
    return {
      sceneKey: "cave",
      location: "Cavernas de Valdora",
      eyebrow: "Treino e recompensa",
      title: "As galerias profundas",
      partner: null,
    };
  }

  return {
    sceneKey: "city",
    location: "Praça de Valdora",
    eyebrow: isDragonUnlocked() ? "O portão está aberto" : "Um refúgio entre batalhas",
    title: "A cidade sitiada",
    partner: null,
  };
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
}

function getAvailableActions() {
  if (state.phase === "victory") {
    return [
      {
        label: "Nova aventura",
        hint: "Recomeçar com o mesmo herói",
        tone: "gold",
        action: restartWithSameHero,
      },
      {
        label: "Criar outro herói",
        hint: "Voltar ao criador de personagem",
        tone: "quiet",
        action: createAnotherHero,
      },
    ];
  }

  if (state.phase === "defeat") {
    return [
      {
        label: "Tentar novamente",
        hint: "Reiniciar a jornada com este herói",
        tone: "gold",
        action: restartWithSameHero,
      },
      {
        label: "Criar outro herói",
        hint: "Escolher outra classe e aparência",
        tone: "quiet",
        action: createAnotherHero,
      },
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
        action: () => performPlayerAttack("attack"),
      },
      {
        label: cooldown > 0 ? `${heroClass.skill.name} (${cooldown})` : heroClass.skill.name,
        hint: cooldown > 0 ? `Disponível em ${cooldown} turno(s)` : heroClass.skill.description,
        tone: "gold",
        disabled: cooldown > 0,
        action: () => performPlayerAttack("skill"),
      },
      {
        label: "Esquivar",
        hint: `${Math.round(heroClass.dodgeChance * 100)}% de chance de evitar o golpe`,
        tone: "quiet",
        action: performDodge,
      },
      {
        label: "Recuar",
        hint: "Sair da batalha sem receber recompensa",
        tone: "danger",
        action: fleeBattle,
      },
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
        action: buyHealing,
      },
      {
        label: hasUpgrade ? `Melhorar: ${CLASS_DATA[state.hero.classId].weapons[nextTier]}` : "Equipamento máximo",
        hint: hasUpgrade ? `${upgradeCost} ouro • aumenta o dano` : "A forja não possui melhoria superior",
        tone: "gold",
        disabled: !hasUpgrade || state.gold < upgradeCost,
        action: upgradeWeapon,
      },
      {
        label: "Voltar à praça",
        hint: "Retornar ao centro de Valdora",
        tone: "quiet",
        action: () => travelTo("city"),
      },
    ];
  }

  if (state.location === "cave") {
    return [
      {
        label: "Enfrentar lodo",
        hint: "Risco baixo • 10 XP • 15 ouro",
        tone: "primary",
        action: () => startBattle("slime"),
      },
      {
        label: "Caçar a besta",
        hint: "Risco médio • 18 XP • 30 ouro",
        tone: "danger",
        action: () => startBattle("beast"),
      },
      {
        label: "Voltar à praça",
        hint: "Retornar ao centro de Valdora",
        tone: "quiet",
        action: () => travelTo("city"),
      },
    ];
  }

  const unlocked = isDragonUnlocked();
  return [
    {
      label: "Visitar a forja",
      hint: "Curativos e melhorias de equipamento",
      tone: "gold",
      action: () => travelTo("shop"),
    },
    {
      label: "Explorar as cavernas",
      hint: "Treine, conquiste XP e encontre ouro",
      tone: "primary",
      action: () => travelTo("cave"),
    },
    {
      label: unlocked ? "Enfrentar Vharok" : "Portão do Dragão bloqueado",
      hint: unlocked ? "Batalha final • risco extremo" : "Requer nível 4 e equipamento nível 2",
      tone: "danger",
      disabled: !unlocked,
      action: () => startBattle("dragon"),
    },
  ];
}

function travelTo(location) {
  state.location = location;
  state.battle = null;
  state.busy = false;

  if (location === "city") {
    state.message = isDragonUnlocked()
      ? "O sino do portão ecoa: Vharok está ao alcance. Você ainda pode visitar a forja ou treinar antes da batalha final."
      : "Na praça, moradores acompanham seu progresso. A forja prepara equipamentos enquanto as cavernas oferecem treino e ouro.";
  } else if (location === "shop") {
    state.message = "Maela avalia seu equipamento. Curativos restauram vida; armas melhores aumentam o dano e aproximam você do dragão.";
  } else if (location === "cave") {
    state.message = "As cavernas oferecem dois caminhos: o lodo é um treino seguro; a besta concede recompensas maiores, mas ataca com força.";
  }

  renderAll();
  saveGame();
}

function buyHealing() {
  const maxHealth = getMaxHealth(state);
  if (state.gold < 15 || state.health >= maxHealth) return;
  const recovered = Math.min(35, maxHealth - state.health);
  state.gold -= 15;
  state.health += recovered;
  state.message = `Maela aplica um curativo reforçado. Você recupera ${recovered} pontos de vida.`;
  renderAll();
  saveGame();
  showToast(`+${recovered} de vida`);
}

function upgradeWeapon() {
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
  showToast(unlockedNow ? "O Portão do Dragão foi liberado!" : "Equipamento melhorado");
}

function startBattle(monsterId) {
  if (!MONSTERS[monsterId]) return;
  if (monsterId === "dragon" && !isDragonUnlocked()) {
    showToast("Alcance o nível 4 e melhore o equipamento até o nível 2.");
    return;
  }

  const monster = MONSTERS[monsterId];
  state.location = "battle";
  state.battle = {
    monsterId,
    health: monster.health,
    maxHealth: monster.health,
    turn: 0,
    skillCooldown: 0,
  };
  state.lastMonsterId = monsterId;
  state.message = monster.intro;
  state.busy = false;
  renderAll();
  saveGame();
}

function performPlayerAttack(mode) {
  if (state.busy || !state.battle) return;
  const heroClass = CLASS_DATA[state.hero.classId];
  if (mode === "skill" && state.battle.skillCooldown > 0) return;

  state.busy = true;
  renderActions();

  const multiplier = mode === "skill" ? heroClass.skill.multiplier : 1;
  const attack = calculatePlayerDamage(multiplier, mode === "skill");
  state.battle.health = Math.max(0, state.battle.health - attack.damage);

  let actionSummary = `${state.hero.name} causa ${attack.damage} de dano`;
  if (mode === "skill") {
    actionSummary = `${state.hero.name} usa ${heroClass.skill.name} e causa ${attack.damage} de dano`;
    state.battle.skillCooldown = heroClass.skill.cooldown;
  }
  if (attack.critical) actionSummary += " com um acerto crítico";
  actionSummary += ".";

  if (mode === "skill" && heroClass.skill.healing) {
    const maxHealth = getMaxHealth(state);
    const recovered = Math.min(heroClass.skill.healing, maxHealth - state.health);
    if (recovered > 0) {
      state.health += recovered;
      actionSummary += ` A chama devolve ${recovered} de vida.`;
      showFloatingNumber(ui.heroFigure, `+${recovered}`, true);
    }
  }

  state.message = actionSummary;
  updateStats();
  updateBattleHud();
  ui.storyText.textContent = state.message;
  animateStrike(ui.heroFigure, ui.partnerFigure, attack.damage);
  saveGame();

  if (state.battle.health <= 0) {
    window.setTimeout(resolveBattleVictory, 430);
    return;
  }

  window.setTimeout(() => {
    enemyTurn({
      actionSummary,
      usedSkill: mode === "skill",
      protection: mode === "skill" ? heroClass.skill.protection || 0 : 0,
      dodge: false,
    });
  }, 450);
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
  const criticalMultiplier = critical ? 1.45 : 1;
  return { damage: Math.max(1, Math.round(baseDamage * multiplier * criticalMultiplier)), critical };
}

function performDodge() {
  if (state.busy || !state.battle) return;
  state.busy = true;
  state.message = `${state.hero.name} observa o movimento do inimigo e prepara a esquiva.`;
  ui.storyText.textContent = state.message;
  renderActions();
  saveGame();

  window.setTimeout(() => {
    enemyTurn({
      actionSummary: `${state.hero.name} tenta antecipar o próximo golpe.`,
      usedSkill: false,
      protection: 0,
      dodge: true,
    });
  }, 260);
}

function enemyTurn(context) {
  if (!state.battle) return;
  const monster = MONSTERS[state.battle.monsterId];
  const heroClass = CLASS_DATA[state.hero.classId];
  const dodged = context.dodge && Math.random() < heroClass.dodgeChance;
  let damage = 0;

  if (!dodged) {
    const rawDamage = randomInt(monster.minDamage, monster.maxDamage);
    const reduction = Math.min(0.75, heroClass.defense + context.protection);
    damage = Math.max(1, Math.round(rawDamage * (1 - reduction)));
    state.health = Math.max(0, state.health - damage);
    animateStrike(ui.partnerFigure, ui.heroFigure, damage);
  }

  if (!context.usedSkill && state.battle.skillCooldown > 0) {
    state.battle.skillCooldown -= 1;
  }
  state.battle.turn += 1;

  if (dodged) {
    state.message = `${context.actionSummary} A esquiva funciona: ${monster.name} erra o ataque.`;
  } else {
    state.message = `${context.actionSummary} ${monster.name} responde e causa ${damage} de dano.`;
  }

  updateStats();
  updateBattleHud();
  ui.storyText.textContent = state.message;

  if (state.health <= 0) {
    saveGame();
    window.setTimeout(resolveDefeat, 420);
    return;
  }

  state.busy = false;
  renderActions();
  saveGame();
}

function fleeBattle() {
  if (state.busy || !state.battle) return;
  const monsterId = state.battle.monsterId;
  const monsterName = MONSTERS[monsterId].name;
  state.battle = null;
  state.location = monsterId === "dragon" ? "city" : "cave";
  state.busy = false;
  state.message = `${state.hero.name} recua diante de ${monsterName}. A batalha termina sem recompensas, mas a vida atual é preservada.`;
  renderAll();
  saveGame();
}

function resolveBattleVictory() {
  if (!state.battle) return;
  const monsterId = state.battle.monsterId;
  const monster = MONSTERS[monsterId];
  const previousLevel = getLevelInfo(state.xp).level;
  const wasUnlocked = isDragonUnlocked();

  state.xp += monster.xp;
  state.gold += monster.gold;
  state.lastMonsterId = monsterId;
  state.battle = null;
  state.busy = false;

  if (monsterId === "dragon") {
    state.phase = "victory";
    state.message = `${state.hero.name} derrota Vharok. As asas do dragão silenciam e os portões de Valdora voltam a se abrir.`;
    renderAll();
    saveGame();
    showToast("Vitória! Valdora está livre.");
    return;
  }

  state.defeated[monsterId] += 1;
  state.location = "cave";
  const newLevel = getLevelInfo(state.xp).level;
  let levelMessage = "";
  if (newLevel > previousLevel) {
    const recovered = Math.min(getMaxHealth(state) - state.health, 18 * (newLevel - previousLevel));
    state.health += Math.max(0, recovered);
    levelMessage = ` Você alcançou o nível ${newLevel} e recuperou ${Math.max(0, recovered)} de vida.`;
  }

  state.message = `${monster.name} foi derrotado. Recompensa: ${monster.xp} XP e ${monster.gold} de ouro.${levelMessage}`;
  const unlockedNow = !wasUnlocked && isDragonUnlocked();
  renderAll();
  saveGame();
  showToast(unlockedNow ? "O Portão do Dragão foi liberado!" : `+${monster.xp} XP • +${monster.gold} ouro`);
}

function resolveDefeat() {
  if (state.phase !== "playing") return;
  const monster = MONSTERS[state.lastMonsterId] || MONSTERS.dragon;
  state.phase = "defeat";
  state.battle = null;
  state.busy = false;
  state.message = `${state.hero.name} cai diante de ${monster.name}. A experiência da jornada permanece como aprendizado — você pode tentar novamente.`;
  renderAll();
  saveGame();
}

function restartWithSameHero() {
  const hero = { ...state.hero };
  state = createNewState(hero);
  state.message = `${hero.name} retorna à praça com uma nova estratégia. A jornada recomeça.`;
  renderAll();
  saveGame();
}

function isDragonUnlocked() {
  if (!state) return false;
  return getLevelInfo(state.xp).level >= 4 && state.weaponTier >= 2;
}

function animateStrike(attacker, target, damage) {
  attacker.classList.remove("is-attacking");
  target.classList.remove("is-hit");
  void attacker.offsetWidth;
  attacker.classList.add("is-attacking");
  target.classList.add("is-hit");
  showFloatingNumber(target, `-${damage}`, false);

  window.setTimeout(() => {
    attacker.classList.remove("is-attacking");
    target.classList.remove("is-hit");
  }, 430);
}

function showFloatingNumber(container, value, healing) {
  const number = document.createElement("span");
  number.className = healing ? "damage-number damage-number--heal" : "damage-number";
  number.textContent = value;
  container.append(number);
  window.setTimeout(() => number.remove(), 720);
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

function renderHeroSvg(hero) {
  const safeHero = normalizeHero(hero);
  const skin = SKIN_TONES[safeHero.skin];
  const accent = ACCENT_COLORS[safeHero.accent];
  const outline = "#172727";
  const hairColor = safeHero.skin === "deep" ? "#171516" : "#2a211d";
  const hairBack = safeHero.hair === "long"
    ? `<path d="M62 65 C62 36 118 35 120 67 L125 114 C112 125 70 124 56 111 Z" fill="${hairColor}" stroke="${outline}" stroke-width="3"/>`
    : "";
  const hairFront = {
    short: `<path d="M62 68 C60 42 75 31 91 32 C111 32 122 47 119 67 C108 58 95 54 78 56 C72 60 67 65 62 68 Z" fill="${hairColor}" stroke="${outline}" stroke-width="3"/>`,
    crest: `<path d="M65 66 C65 47 76 38 88 37 C88 27 95 17 104 14 C104 27 110 32 116 38 C120 45 120 56 117 66 C104 56 78 54 65 66 Z" fill="${hairColor}" stroke="${outline}" stroke-width="3"/>`,
    long: `<path d="M61 68 C59 43 74 31 91 31 C111 31 122 46 120 67 C108 57 96 53 78 56 C71 60 66 65 61 68 Z" fill="${hairColor}" stroke="${outline}" stroke-width="3"/>`,
  }[safeHero.hair];

  const classGear = {
    guardian: `
      <path d="M36 124 L21 191" stroke="#d8cfb5" stroke-width="5" stroke-linecap="round"/>
      <path d="M17 193 L27 190 L22 211 Z" fill="#d9b86c" stroke="${outline}" stroke-width="3"/>
      <path d="M124 125 C148 119 159 129 158 156 C157 181 143 198 124 207 C105 198 94 181 93 156 C92 132 103 122 124 125 Z" fill="${accent.dark}" stroke="#d7c58f" stroke-width="4"/>
      <path d="M124 137 L124 190 M106 157 L143 157" stroke="${accent.light}" stroke-width="4" stroke-linecap="round"/>
    `,
    hunter: `
      <path d="M139 105 C166 128 166 181 137 210" fill="none" stroke="#b98d58" stroke-width="5" stroke-linecap="round"/>
      <path d="M139 105 L137 210" stroke="#dbcaa7" stroke-width="2"/>
      <path d="M45 91 L58 142" stroke="#775437" stroke-width="10" stroke-linecap="round"/>
      <path d="M38 84 L51 82 L61 129 L49 132 Z" fill="#6b4b32" stroke="${outline}" stroke-width="3"/>
      <path d="M42 77 L48 98 M48 76 L53 97 M54 77 L58 99" stroke="#d8cfb5" stroke-width="2"/>
    `,
    arcanist: `
      <path d="M139 93 L139 214" stroke="#70543c" stroke-width="7" stroke-linecap="round"/>
      <circle cx="139" cy="82" r="16" fill="${accent.light}" opacity="0.2"/>
      <path d="M139 63 L148 80 L139 96 L130 80 Z" fill="${accent.light}" stroke="#e5d8ac" stroke-width="3"/>
      <path d="M55 111 L42 211 L90 225 L137 211 L124 111 Z" fill="${accent.dark}" stroke="${outline}" stroke-width="4"/>
      <path d="M90 119 L90 215" stroke="${accent.light}" stroke-width="3" opacity="0.75"/>
    `,
  }[safeHero.classId];

  return `
    <svg viewBox="0 0 180 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Personagem ${CLASS_DATA[safeHero.classId].label}">
      <ellipse cx="90" cy="226" rx="59" ry="10" fill="#020909" opacity="0.36"/>
      ${hairBack}
      <path d="M66 113 C54 122 48 153 50 188 L75 193 L90 160 L104 193 L132 188 C132 150 125 122 114 113 Z" fill="${accent.dark}" stroke="${outline}" stroke-width="4"/>
      <path d="M71 184 L65 222 L82 225 L91 188 Z" fill="#273737" stroke="${outline}" stroke-width="4"/>
      <path d="M109 184 L116 222 L99 225 L90 188 Z" fill="#273737" stroke="${outline}" stroke-width="4"/>
      <path d="M62 218 L84 218 L84 230 L56 230 C55 225 57 221 62 218 Z" fill="#171f20" stroke="${outline}" stroke-width="3"/>
      <path d="M118 218 L97 218 L97 230 L125 230 C126 225 123 221 118 218 Z" fill="#171f20" stroke="${outline}" stroke-width="3"/>
      <path d="M68 105 C77 99 103 99 113 105 L124 154 C113 166 69 166 56 154 Z" fill="${accent.base}" stroke="${outline}" stroke-width="4"/>
      <path d="M62 126 L117 126" stroke="${accent.light}" stroke-width="4" opacity="0.7"/>
      <path d="M64 112 C46 117 37 133 35 153" fill="none" stroke="${skin}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="34" cy="158" r="8" fill="${skin}" stroke="${outline}" stroke-width="3"/>
      <path d="M117 112 C135 118 141 134 142 150" fill="none" stroke="${skin}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="142" cy="156" r="8" fill="${skin}" stroke="${outline}" stroke-width="3"/>
      <rect x="81" y="91" width="18" height="21" rx="8" fill="${skin}" stroke="${outline}" stroke-width="3"/>
      <ellipse cx="90" cy="67" rx="30" ry="36" fill="${skin}" stroke="${outline}" stroke-width="4"/>
      ${hairFront}
      <ellipse cx="79" cy="68" rx="3.5" ry="4" fill="#172323"/>
      <ellipse cx="102" cy="68" rx="3.5" ry="4" fill="#172323"/>
      <path d="M83 84 C88 88 95 88 100 84" fill="none" stroke="#7f4b3e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M72 101 L90 113 L108 101 L113 112 C101 121 80 121 67 112 Z" fill="#d9b86c" stroke="${outline}" stroke-width="3"/>
      ${classGear}
    </svg>
  `;
}

function renderMerchantSvg() {
  return `
    <svg viewBox="0 0 180 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maela, mestra ferreira">
      <ellipse cx="90" cy="226" rx="58" ry="10" fill="#020909" opacity="0.36"/>
      <path d="M62 102 C50 123 45 168 52 218 L128 218 C135 169 129 123 117 102 Z" fill="#6d4434" stroke="#211d1b" stroke-width="4"/>
      <path d="M67 112 L90 130 L113 112 L121 208 L59 208 Z" fill="#98704b" stroke="#211d1b" stroke-width="4"/>
      <path d="M55 132 L35 166" stroke="#c98762" stroke-width="14" stroke-linecap="round"/>
      <path d="M125 132 L145 166" stroke="#c98762" stroke-width="14" stroke-linecap="round"/>
      <circle cx="33" cy="171" r="8" fill="#c98762" stroke="#211d1b" stroke-width="3"/>
      <circle cx="147" cy="171" r="8" fill="#c98762" stroke="#211d1b" stroke-width="3"/>
      <rect x="81" y="88" width="18" height="21" rx="8" fill="#c98762" stroke="#211d1b" stroke-width="3"/>
      <ellipse cx="90" cy="65" rx="29" ry="35" fill="#c98762" stroke="#211d1b" stroke-width="4"/>
      <path d="M62 68 C57 45 72 29 91 29 C112 29 124 47 118 69 C107 57 74 56 62 68 Z" fill="#29211e" stroke="#211d1b" stroke-width="3"/>
      <path d="M67 77 C70 104 111 104 114 77 C107 91 75 91 67 77 Z" fill="#3b2b25" stroke="#211d1b" stroke-width="3"/>
      <circle cx="80" cy="66" r="3" fill="#1b2221"/>
      <circle cx="101" cy="66" r="3" fill="#1b2221"/>
      <path d="M84 78 C88 81 93 81 97 78" fill="none" stroke="#744537" stroke-width="2"/>
      <path d="M56 154 L124 154" stroke="#d9b86c" stroke-width="5"/>
      <path d="M133 102 L151 210" stroke="#625143" stroke-width="7" stroke-linecap="round"/>
      <path d="M132 101 C140 91 155 94 160 105 C163 114 157 123 150 128 L142 118 C147 114 148 108 143 105 C139 103 136 106 133 109 Z" fill="#9da6a0" stroke="#211d1b" stroke-width="3"/>
    </svg>
  `;
}

function renderEnemySvg(monsterId) {
  if (monsterId === "slime") {
    return `
      <svg viewBox="0 0 180 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lodo esmeralda">
        <ellipse cx="90" cy="220" rx="63" ry="12" fill="#020909" opacity="0.35"/>
        <path d="M32 194 C29 168 42 147 55 133 C46 94 69 65 92 65 C117 65 137 92 128 132 C144 147 153 171 147 196 C131 214 50 215 32 194 Z" fill="#55a979" stroke="#17352d" stroke-width="5"/>
        <path d="M48 178 C66 194 113 195 135 178" fill="none" stroke="#8bd3a1" stroke-width="6" opacity="0.5"/>
        <ellipse cx="73" cy="136" rx="8" ry="12" fill="#122926"/>
        <ellipse cx="110" cy="136" rx="8" ry="12" fill="#122926"/>
        <circle cx="70" cy="132" r="2.5" fill="#d9f5d9"/>
        <circle cx="107" cy="132" r="2.5" fill="#d9f5d9"/>
        <path d="M72 162 C82 170 99 170 110 161" fill="none" stroke="#254d3f" stroke-width="5" stroke-linecap="round"/>
        <circle cx="55" cy="105" r="10" fill="#80c99a" opacity="0.6"/>
        <circle cx="127" cy="91" r="6" fill="#80c99a" opacity="0.5"/>
      </svg>
    `;
  }

  if (monsterId === "beast") {
    return `
      <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Besta das presas">
        <ellipse cx="101" cy="220" rx="77" ry="11" fill="#020909" opacity="0.38"/>
        <path d="M51 131 C67 102 118 98 146 123 C159 136 163 170 148 193 L62 193 C43 174 39 151 51 131 Z" fill="#69514e" stroke="#241d20" stroke-width="5"/>
        <path d="M43 142 C18 131 17 107 30 91 C29 111 43 116 58 118" fill="none" stroke="#5b4544" stroke-width="12" stroke-linecap="round"/>
        <path d="M61 185 L53 219 L72 221 L82 188" fill="#46383a" stroke="#241d20" stroke-width="5"/>
        <path d="M132 185 L141 219 L160 219 L151 181" fill="#46383a" stroke="#241d20" stroke-width="5"/>
        <path d="M118 103 C120 71 143 52 169 62 C187 70 190 99 176 121 C165 138 139 144 119 130 Z" fill="#765a55" stroke="#241d20" stroke-width="5"/>
        <path d="M132 72 L133 42 L153 64" fill="#765a55" stroke="#241d20" stroke-width="5"/>
        <path d="M164 66 L184 43 L183 80" fill="#765a55" stroke="#241d20" stroke-width="5"/>
        <path d="M139 108 C151 119 174 116 181 104 C180 126 159 139 140 128 Z" fill="#392b2e" stroke="#241d20" stroke-width="4"/>
        <path d="M145 116 L151 137 L158 119 M169 116 L171 135 L178 110" fill="#eadfbd" stroke="#6c6252" stroke-width="2"/>
        <ellipse cx="145" cy="89" rx="5" ry="6" fill="#d99a56"/>
        <ellipse cx="173" cy="88" rx="5" ry="6" fill="#d99a56"/>
        <circle cx="146" cy="89" r="2" fill="#1b1517"/>
        <circle cx="174" cy="88" r="2" fill="#1b1517"/>
        <path d="M79 111 L92 93 L101 110 L112 92 L124 111" fill="#84645d" stroke="#241d20" stroke-width="4"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 230 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vharok, o dragão">
      <ellipse cx="120" cy="220" rx="91" ry="12" fill="#020909" opacity="0.42"/>
      <path d="M83 112 C43 65 20 73 22 124 C24 155 47 171 73 171 C55 147 56 126 83 112 Z" fill="#713d3a" stroke="#2b1c20" stroke-width="5"/>
      <path d="M154 111 C193 62 218 72 216 123 C214 154 191 170 165 170 C183 145 181 126 154 111 Z" fill="#713d3a" stroke="#2b1c20" stroke-width="5"/>
      <path d="M45 102 L69 151 M196 101 L171 151" stroke="#ae6354" stroke-width="4" opacity="0.7"/>
      <path d="M76 124 C89 94 151 91 166 126 C179 158 165 198 139 211 L96 210 C70 191 63 154 76 124 Z" fill="#8b4b42" stroke="#2b1c20" stroke-width="6"/>
      <path d="M89 184 L78 220 L100 222 L111 190" fill="#683a37" stroke="#2b1c20" stroke-width="5"/>
      <path d="M150 183 L161 220 L139 222 L128 190" fill="#683a37" stroke="#2b1c20" stroke-width="5"/>
      <path d="M154 166 C194 170 211 193 205 211 C195 200 179 199 158 203" fill="none" stroke="#8b4b42" stroke-width="18" stroke-linecap="round"/>
      <path d="M96 105 C90 71 103 43 123 38 C149 33 170 60 163 96 C158 119 142 132 119 132 C102 132 94 120 96 105 Z" fill="#9a5145" stroke="#2b1c20" stroke-width="6"/>
      <path d="M105 47 L99 19 L119 40 M146 43 L160 17 L161 55" fill="#d6b56d" stroke="#2b1c20" stroke-width="5"/>
      <path d="M105 102 C118 112 146 110 158 97 C158 120 143 136 122 135 C106 134 98 122 105 102 Z" fill="#4b2828" stroke="#2b1c20" stroke-width="4"/>
      <path d="M113 108 L118 129 L126 110 M143 107 L140 128 L151 103" fill="#efe1bd" stroke="#756957" stroke-width="2"/>
      <ellipse cx="112" cy="79" rx="6" ry="7" fill="#f2b94f"/>
      <ellipse cx="146" cy="76" rx="6" ry="7" fill="#f2b94f"/>
      <path d="M112 79 L116 78 M146 76 L150 75" stroke="#21191a" stroke-width="3"/>
      <path d="M90 142 L102 126 L111 144 L122 126 L132 144 L145 126 L154 145" fill="none" stroke="#b86b58" stroke-width="6"/>
    </svg>
  `;
}
