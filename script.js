"use strict";

const STORAGE_KEY = "cronicas-de-valdora-save-v2";

const CHARACTER_ASSETS = {
  guardian: "./assets/characters/guardian.webp",
  hunter: "./assets/characters/hunter.webp",
  arcanist: "./assets/characters/arcanist.webp",
  merchant: "./assets/characters/merchant-maela.webp",
  slime: "./assets/characters/slime-villain.webp",
  beast: "./assets/characters/fang-beast.webp",
  dragon: "./assets/characters/vharok-dragon.webp",
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
};

let state = null;
let toastTimer = null;
let saveStatusTimer = null;

initialize();

function initialize() {
  preloadCharacterAssets();
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
  ui.creatorAvatar.innerHTML = renderHeroArt(creatorConfig);
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
  const rawName = typeof hero.name === "string" ? hero.name.trim().slice(0, 16) : "Aventureiro";
  return { name: rawName || "Aventureiro", classId };
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
  ui.heroAvatar.innerHTML = renderHeroArt(state.hero);
  ui.heroStageName.textContent = state.hero.name;
  ui.heroStageRole.textContent = heroClass.label;

  ui.heroFigure.classList.toggle("is-defeated", state.phase === "defeat");
  ui.partnerFigure.classList.remove("is-defeated");
  ui.enemyHud.hidden = true;
  ui.partnerFigure.hidden = true;
  ui.versusMark.hidden = true;

  if (presentation.partner) {
    ui.partnerFigure.hidden = false;
    ui.partnerAvatar.innerHTML = presentation.partner.art;
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
        art: renderEnemyArt("dragon"),
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
        art: renderEnemyArt(monsterId),
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
        art: renderEnemyArt(state.battle.monsterId),
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
        art: renderMerchantArt(),
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

function preloadCharacterAssets() {
  if (typeof Image !== "function") return;
  Object.values(CHARACTER_ASSETS).forEach((source) => {
    const image = new Image();
    image.src = source;
  });
}

function renderCharacterArt(characterId) {
  const source = CHARACTER_ASSETS[characterId] || CHARACTER_ASSETS.guardian;
  return `<img class="character-art character-art--${characterId}" src="${source}" alt="" draggable="false" decoding="async" />`;
}

function renderHeroArt(hero) {
  return renderCharacterArt(normalizeHero(hero).classId);
}

function renderMerchantArt() {
  return renderCharacterArt("merchant");
}

function renderEnemyArt(monsterId) {
  return renderCharacterArt(MONSTERS[monsterId] ? monsterId : "slime");
}
