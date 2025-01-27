let xp = 0;
let health = 100;
let gold = 50;
let armaAtual = 0;
let fighting;
let monsterHealth;
let inventory = ["bastao"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'bastao', power: 5 },
  { name: 'adaga', power: 30 },
  { name: 'martelo', power: 50 },
  { name: 'espada', power: 100 }
];
const monsters = [
  {
    name: "lama",
    level: 2,
    health: 15
  },
  {
    name: "besta das presas",
    level: 8,
    health: 60
  },
  {
    name: "dragao",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "pracinha da cidade",
    "button text": ["Vá para loja", "Vá para caverna", "Lute dragao"],
    "button functions": [irLoja, irCaverna, luteDragao],
    text: "Você entrou na pracinha da cidade. Você vê uma placa que diz \"Loja\"."
  },
  {
    name: "loja",
    "button text": ["Compre 10 vidas (10 gold)", "Compre armas (30 gold)", "Vá para pracinha da cidade"],
    "button functions": [comprarVida, comprarArma, irCidade],
    text: "Você entrou na loja."
  },
  {
    name: "caverna",
    "button text": ["Lute contra lama", "Lute contra besta das presas", "Vá para pracinha da cidade"],
    "button functions": [lutelama, luteBesta, irCidade],
    text: "Você entrou na caverna. Você vê alguns monstros."
  },
  {
    name: "lutar",
    "button text": ["Atacar", "Esquivar", "Correr"],
    "button functions": [atacar, esquivar, irCidade],
    text: "Você está lutando contra um monstro."
  },
  {
    name: "matar monstro",
    "button text": ["Vá para pracinha da cidade", "Vá para pracinha da cidade", "Vá para pracinha da cidade"],
    "button functions": [irCidade, irCidade, irCidade],
    text: 'O monstro grita “Arg!” quando morre. Você ganha pontos de experiência e encontra ouro.'
  },
  {
    name: "perder",
    "button text": ["REPETIR?", "REPETIR?", "REPETIR?"],
    "button functions": [restart, restart, restart],
    text: "Você morre. &#x2620;"
  },
  { 
    name: "ganhar", 
    "button text": ["REPETIR?", "REPETIR?", "REPETIR?"], 
    "button functions": [restart, restart, restart], 
    text: "Você derrotou o dragão! VOCÊ VENCEU O JOGO! &#x1F389;" 
  },
  {
    name: "ovo de Pascoa",
    "button text": ["2", "8", "Va para pracinha da cidade?"],
    "button functions": [escolhaDois, escolhaOito, irCidade],
    text: "Você encontra um jogo secreto. Escolha um número acima. Dez números serão escolhidos aleatoriamente entre 0 e 10. Se o número que você escolher corresponder a um dos números aleatórios, você ganha!"
  }
];


button1.onclick = irLoja;
button2.onclick = irCaverna;
button3.onclick = luteDragao;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function irCidade() {
  update(locations[0]);
}

function irLoja() {
  update(locations[1]);
}

function irCaverna() {
  update(locations[2]);
}

function comprarVida() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem nenhum ouro para comprar vida.";
  }
}

function comprarArma() {
  if (armaAtual < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      armaAtual++;
      goldText.innerText = gold;
      let newWeapon = weapons[armaAtual].name;
      text.innerText = "Você não tem " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " No seu inventario você tem: " + inventory;
    } else {
      text.innerText = "Você não tem nenhum ouro para comprar arma.";
    }
  } else {
    text.innerText = "Você já tem a arama mais poderosa!";
    button2.innerText = "Venda sua arma por 15 gold";
    button2.onclick = venderArma;
  }
}

function venderArma() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let armaAtual = inventory.shift();
    text.innerText = "Você vendeu " + armaAtual + ".";
    text.innerText += " No seu inventario você tem: " + inventory;
  } else {
    text.innerText = "Não venda sua unica arma!";
  }
}

function lutelama() {
  fighting = 0;
  goFight();
}

function luteBesta() {
  fighting = 1;
  goFight();
}

function luteDragao() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function atacar() {
  text.innerText = "O monstro " + monsters[fighting].name + " atacou.";
  text.innerText += " Você atacou com sua arma: " + weapons[armaAtual].name + ".";
  health -= getMonsteratacarValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[armaAtual].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Você perdeu.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    perder();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      ganharJogo();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Sua arma " + inventory.pop() + " quebrou.";
    armaAtual--;
  }
}

function getMonsteratacarValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function esquivar() {
  text.innerText = "Você esquivou do ataque do " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function perder() {
  update(locations[5]);
}

function ganharJogo() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  armaAtual = 0;
  inventory = ["bastao"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  irCidade();
}

function ovodePascoa() {
  update(locations[7]);
}

function escolhaDois() {
  escolha(2);
}

function escolhaOito() {
  escolha(8);
}

function escolha(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Você escolheu " + guess + ". Aqui estao alguns numeros:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Certo! Você ganhou 20 de ouro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Errado! Você perde 10 pontos de vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      perder();
    }
  }
}
