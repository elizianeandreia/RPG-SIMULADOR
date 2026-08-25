# Plano de jogo - Crônicas de Valdora

## Fantasia do jogador

Ser um herói criado pelo próprio jogador, crescer em uma aventura curta e libertar a cidade de Valdora do dragão Vharok.

## Pilares

1. **Identidade** - nome, aparência e classe precisam continuar visíveis durante a partida.
2. **Progresso legível** - o jogador sempre sabe o que falta para enfrentar o dragão.
3. **Decisões rápidas** - cada turno oferece ataque, habilidade, esquiva ou retirada.
4. **Sessão curta** - uma jornada completa deve durar aproximadamente 8 a 12 minutos.

## Core loop

```text
Criar herói
    ↓
Escolher destino na cidade
    ↓
Lutar nas cavernas
    ↓
Ganhar XP e ouro
    ↓
Curar e melhorar equipamento
    ↓
Desbloquear o Portão do Dragão
    ↓
Enfrentar Vharok
    ↓
Vitória ou nova tentativa
```

## Verbos principais

- **Criar**: definir nome, classe e aparência.
- **Explorar**: alternar entre praça, forja e cavernas.
- **Atacar**: causar dano consistente.
- **Usar habilidade**: aplicar o diferencial da classe com tempo de recarga.
- **Esquivar**: trocar dano por uma chance de evitar o ataque inimigo.
- **Recuar**: preservar a vida e abandonar uma luta sem recompensa.
- **Melhorar**: gastar ouro em cura e equipamento.

## Progressão da jornada

O dragão é liberado quando o herói alcança:

- nível 4;
- equipamento nível 2.

Uma rota média para chegar ao portão é vencer dois lodos e duas bestas. O jogador provavelmente precisará de uma luta adicional caso gaste ouro em curativos, criando uma escolha simples entre segurança e velocidade.

| Encontro | Vida | Dano | Recompensa |
|---|---:|---:|---:|
| Lodo esmeralda | 34 | 5-9 | 10 XP e 15 ouro |
| Besta das presas | 72 | 10-15 | 18 XP e 30 ouro |
| Vharok | 185 | 14-22 | Vitória final |

## Classes

| Classe | Papel | Diferencial | Habilidade |
|---|---|---|---|
| Guardião | Resistência | Mais vida e redução de dano | Golpe forte com proteção no turno |
| Caçador | Precisão | Mais crítico e esquiva | Disparo com alta chance de crítico |
| Arcanista | Risco e recuperação | Mais dano, menos vida | Ataque que recupera vida |

## Estados do jogo

- criação do personagem;
- cidade;
- loja;
- caverna;
- combate;
- derrota;
- vitória.

O estado serializável fica separado da interface. Isso permite salvar a jornada sem depender dos elementos visuais e facilita a futura inclusão de novos capítulos.

## Direção visual

- fantasia sombria com verde mineral, ouro envelhecido e iluminação quente;
- tela de jogo dominada pela cena, sem aparência de painel administrativo;
- informações vitais concentradas no topo;
- objetivo atual em um único chip;
- narrativa e ações em uma área secundária;
- movimentos fortes reservados para ataque, dano, cura, vitória e derrota;
- personagens em SVG para manter nitidez e permitir personalização em tempo real.

## Condições de falha e retorno

- ao chegar a zero de vida, o jogador vê a derrota e pode reiniciar com o mesmo herói;
- também é possível voltar ao criador e escolher outra classe;
- durante uma batalha, recuar preserva vida, mas não concede recompensas;
- o progresso é salvo automaticamente após decisões relevantes.

## Próximas expansões recomendadas

1. adicionar uma missão intermediária com escolha narrativa;
2. criar um companheiro desbloqueável que apareça ao lado do herói;
3. incluir efeitos sonoros opcionais e controle de volume;
4. adicionar itens raros com vantagens e desvantagens;
5. criar um segundo capítulo após o dragão;
6. extrair dados de classes, inimigos e cenas para arquivos separados quando o conteúdo crescer.
