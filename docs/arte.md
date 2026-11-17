# Bíblia de arte do Brumaval

Referência para todo desenho novo do jogo (cenário, personagens, efeitos e interface). Todas as cores do cenário saem daqui.

## Estilo

Pixel art em quadrados de 32 px, com 1 pixel do jogo = 1 pixel da arte, no mesmo tamanho em tudo. Formas orgânicas: nada de terreno em degraus. Contorno escuro suave nos objetos e personagens. A luz vem do alto, à esquerda. As cores são ricas, mas nunca saturadas ao máximo, e cada ilha tem a sua paleta e a sua luz.

## Regras

- **Sem repetição visível.** As texturas usam a posição no mundo, então dois quadrados vizinhos nunca são iguais.
- **Bordas.**
  - Entre terrenos naturais, a borda ondula. Na grama, uma linha mais escura. Na água, margem molhada e espuma. Na lava, crosta escura.
  - Construções (pedra da cidade, assoalho, lajotas) ficam retas.
- **Profundidade.**
  - A água é clara na margem e escura no meio.
  - Tudo que fica em pé faz sombra para baixo e para a direita (etapa 3).
- **Uma paleta por região.** Uma cor nova entra aqui antes de entrar no código.

## Paletas e clima por região

| Região | Chão | Água / líquido | Destaque | Luz e clima |
|---|---|---|---|---|
| **Pedraluz** (campos) | grama `#2f5f2a` `#3f7a34` `#4f8f3c` `#62a548` · terra `#6f5234` `#8b6a43` `#a47f52` · areia `#c9ad74` `#d8bf86` | funda `#1d4a74` · média `#2b6596` · rasa `#4f93bd` · espuma `#dff3f6` | flores `#e8d26a` `#e07a8a` `#f2efe6` | tarde ensolarada; sombras azul-acinzentadas |
| **Lunária** (bosque encantado) | musgo `#2c6646` `#3a7f52` `#4f9a62` `#67b273` · pedra feérica `#6a7470` `#7e8a84` | azul-petróleo `#1c5868` · `#2d7a86` | flores e cogumelos `#ff9af0` `#9ae0ff` `#fff0a0` | luz mágica esverdeada; vaga-lumes |
| **Cinzaforte** (vulcão) | cinza `#3e322c` `#4e4038` `#5e5048` `#6e5e54` · basalto `#24201f` `#2e2a2a` `#3a3434` | lava `#7a1a08` `#c0380a` `#ff6a1a` `#ffb02a` `#ffe07a` · crosta `#1e1412` | brasas `#ff7a2a` | brilho laranja de baixo; fumaça |
| **Invernália** (gelo) | neve `#c4d2e0` `#d8e4ee` `#e8f0f6` `#f8fbfd` · trilha `#a89c88` `#bcb19c` | mar gelado `#1d4a6e` `#2f6e96` · gelo `#9ccbe6` `#c4e2f2` | cristais `#7ab8e0` | luz fria e azul; neve caindo |
| **Coralina** (fundo do mar) | areia do fundo `#a89466` `#b8a478` `#c8b88a` · nácar `#cfc6da` `#ddd6e6` · abismo `#1c2832` `#26343f` | — | corais `#d0506a` `#e07a50` | luz filtrada turquesa; reflexos de luz no fundo |
| **Masmorras** | caverna `#2e2621` `#3a312a` `#463c33` · lajota `#3c3a37` `#4a4744` `#56524e` · terra `#2e2016` `#3a2a1c` | — | ossos `#d8d0bc` · teias `#e6e2d6` | escuro, iluminado por tochas |

## Etapas do upgrade

1. Bíblia de arte (este arquivo).
2. Terreno: texturas contínuas e bordas orgânicas em todos os mapas.
3. Luz e sombra: sombras projetadas, luzes coloridas e um filtro de cor por região.
4. Ambiente vivo: partículas, água animada e plantas balançando.
5. Construções e objetos: casas com telhado, masmorras com detalhes e decoração de cada ilha.
