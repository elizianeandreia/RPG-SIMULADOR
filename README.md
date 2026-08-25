# Crônicas de Valdora

Uma evolução do simulador **RPG - Lutando Contra o Dragão**, criada com HTML, CSS e JavaScript puro.

O jogador cria um herói, escolhe uma classe e uma aparência, explora Valdora, enfrenta criaturas, conquista experiência e ouro, melhora o equipamento e se prepara para a batalha final contra Vharok.

## Principais recursos

- criador de personagem com nome, classe, tom de pele, cor do traje e cabelo;
- três classes com atributos e habilidades diferentes;
- herói, inimigos e personagem da loja renderizados juntos nas cenas;
- personagens vetoriais gerados pelo próprio JavaScript, sem arquivos de imagem externos;
- combate por turnos com ataque, habilidade, esquiva e recuo;
- progressão por nível, ouro e equipamentos;
- objetivo de desbloqueio do dragão claramente informado;
- salvamento automático no `localStorage`;
- controles por mouse, toque ou teclas de 1 a 4;
- layout responsivo para computador, tablet e celular;
- suporte a `prefers-reduced-motion`.

## Como executar

Você pode abrir o arquivo `index.html` diretamente ou iniciar um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

Depois, acesse `http://127.0.0.1:8000` no navegador.

## Estrutura

```text
index.html       Estrutura das telas de criação e jogo
estilo.css       Direção visual, responsividade e animações
script.js        Estado, progressão, combate, salvamento e SVGs
GAME_DESIGN.md   Plano do loop, balanceamento e próximos passos
```

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis, grid, animações e media queries
- JavaScript ES2022 sem dependências
- SVG inline para personagens e criaturas

## Licença

MIT License - Copyright (c) 2025 Eliziane Junckes.
