# Quests do Brumaval: *A Origem das Brumas*

> **Status:** implementado no Brumaval Online (`server/quests.js` e `server/questdata.js`). No jogo, a cidade 1 se chama **Pedraluz**; as outras são Lunária, Cinzaforte, Invernália e Coralina.
>
> **O que ficou diferente desta proposta:**
> - **Níveis:** as quests de Cinzaforte começam no nível 50, porque o barco só vai até lá a partir dele.
> - **Parede falsa:** dá a chave e o fragmento direto, sem uma sala nova no mapa.
> - **Ysolde aliada:** pula a luta contra ela, mas não ajuda contra Aurorath.
> - **Visuais:** o "mascote" Dragonete virou a montaria **Dragonete Escarlate**, e as Asas de Lirael viraram uma aura.
> - **Pedras musicais:** são 3 pedras (alta, média, baixa) tocadas em 5 notas.
> - **Hora sem brumas:** vira 1 hora de experiência e saque em dobro; a névoa não some da tela.
> - **Ficaram de fora,** trocados por ouro ou poções:
>   - o desconto do Pip e o item raro do Escamílio;
>   - o atalho de barco da Lis;
>   - o +10% de XP no Recife;
>   - a melhoria +1 da Varga e a Pedra de Afiar;
>   - a escuridão do Coração do Bosque.

Esta é a proposta, ainda sem código. Nada vai para o jogo antes do seu OK.

São **5 cidades × 3 quests** (fácil, média e complexa), todas ligadas por uma história maior. Além delas, a proposta tem:

* **cartas entre cidades**: um NPC de uma cidade manda você falar com o NPC de outra;
* **5 Baús Selados**, escondidos numa cidade e abertos com a chave de outra (o baú do Recife, a última cidade, fica escondido em Brumaval, a primeira);
* **5 Fragmentos do Mapa**, um por cidade, que juntos mostram o último esconderijo;
* **enigmas**: charadas, alavancas, sinos em ordem, paredes falsas e luzes;
* **uma quest final** que conta de onde vêm as brumas e por que o **Colosso das Brumas** existe.

**A ordem das cidades**, que é também a ordem de nível:

| # | Cidade | Níveis |
|---|---|---|
| 1 | Brumaval | 1–26 |
| 2 | Bosque Encantado | 22–48 |
| 3 | Terras Queimadas | 40–96 |
| 4 | Fiordes Gelados | 70–100 |
| 5 | Recife Profundo | 95–126 |

**Legenda:**

| Sinal | Significado |
|---|---|
| 🔗 | liga a outra cidade |
| 🧩 | enigma |
| 🔑 | chave escondida |
| 📜 | fragmento do mapa |
| 🎁 | prêmio |

---

## A história por trás de tudo

Há muito tempo, o **Kraken das Profundezas** dormia no fundo da Fossa Abissal, e **sonhava**. O sonho dele subia pela água como névoa: as **Brumas**.

Cinco guardiões, um de cada terra, prenderam o sonho em cinco baús e esconderam cada baú **longe da sua própria terra**, para ninguém juntar todos de novo. Eram:

* **Aurelião**, rei de Brumaval;
* **Silvano**, o fauno;
* **Grimbal**, o ferreiro das cinzas;
* **Hálvar**, o capitão;
* **Ondino**, o primeiro sineiro.

Com o tempo, os guardiões foram esquecidos, corrompidos ou mortos. As brumas voltaram a subir, e com elas os monstros. O **Colosso das Brumas** é o sonho do Kraken tomando forma.

O jogador descobre isso aos poucos, cidade por cidade.

---

## 1. Brumaval (níveis 1–26)

### Fácil: *Ratos no Depósito*

**Nível:** 1–6 · **Quem pede:** Doran, o Mercador

> "Alguma coisa está roendo meus sacos de trigo à noite. Se eu perder mais um saco, vou vender pão de serragem!"

1. Matar 10 **Ratos** e 5 **Cobras**, e trazer 3 **Rabos Roídos**.
2. 🔑 Um dos ratos carrega uma **Chave Enferrujada**, que sempre cai no último rato da quest. Doran não sabe de onde ela é: *"Fica com ela, vai que abre alguma coisa."* Ela abre o baú da quest média.

🎁 150 moedas, 5 poções e XP.

### Média: *O Uivo ao Meio-Dia*

**Nível:** 8–16 · **Quem pede:** Capitão Bento

> "Lobo uivando de dia não é coisa natural. Dois guardas da patrulha não voltaram."

1. Matar 12 **Lobos Sombrios** e trazer 4 **Presas Escurecidas**.
2. A **Irmã Lúcia** sente magia nelas: os **Fogos-Fátuos** estão guiando a matilha.
3. 🧩 **As Três Luzes.** Na floresta há 3 **pedras com marcas de pata**. Os fogos-fátuos só aparecem se você tocar nelas na ordem que a Lúcia recita:

   > *"Primeiro onde a água corre, depois onde a árvore caiu, por último onde o lobo dorme."*

   As pedras ficam perto do rio, de um tronco caído e da toca. Na ordem errada, aparecem 3 lobos.
4. Apagar 6 **Fogos-Fátuos** e vencer **Presa-de-Lua, a Matriarca**, pelo portal.
5. 🔑 Na toca dela há um **baú velho** que só abre com a **Chave Enferrujada** da quest fácil. Dentro há a **Coleira de Prata** e uma carta da patrulha desaparecida.

🎁 Baú de Ferro, 600 moedas e XP.

### Complexa: *A Coroa do Usurpador*

**Nível:** 18–26 · **NPCs:** Capitã Odila, Mestre Aldric e Irmã Lúcia

> **Odila:** "O Castelo era do Rei Aurelião. Um dia o rei sumiu e um tal de Varek sentou no trono."

1. No **Castelo Abandonado**, matar 10 **Cavaleiros Caídos** e achar o **Diário do Escudeiro** (andar 2).
2. 🧩 **A Sala das Alavancas** (andar 3). Há 4 alavancas numa sala trancada: perto da janela, do trono, da lareira e da porta. O diário diz:

   > *"O rei aquecia as mãos por último, olhava o reino primeiro, e nunca tocava no que deixava os inimigos entrarem."*

   A resposta é janela, depois trono, depois lareira, e **nunca a da porta**. Puxar a errada solta 2 Cavaleiros Caídos e reinicia a sala.
3. O **Mestre Aldric** lê o resto do diário. Varek prendeu a alma do rei na **Cripta Esquecida**: o **Rei das Criptas** *é* Aurelião.
4. A **Irmã Lúcia** faz **Água Benta** com 8 **Cinzas de Osso** (dos Esqueletos e Carniçais da Cripta).
5. 🧩 **A Parede Falsa** (Cripta, andar 4). Uma parede do mapa tem uma rachadura quase invisível. Andando contra ela, você atravessa para uma sala escondida.
   * 🔑 Lá dentro está a **Chave de Osso**, que abre o portão do andar 5 sem precisar do portal.
   * 📜 Lá também está o **Fragmento do Mapa nº 1**.
6. Com a água benta, vencer o **Rei das Criptas**. Ele não morre: agradece e entrega o **Selo Real**.
   > *"Eu guardei um baú que não era meu. Ele veio do fundo do mar. Está embaixo da fonte da praça. Quem chegar ao fim do mundo vai saber abrir."*

   Esse é o primeiro aviso dos Baús Selados.
7. Com o Selo Real, a torre se abre. Vencer **Lorde Varek**.
8. 🔗 Varek tem uma **Carta Queimada**:
   > *"Pago o pacto. Os cultistas de Cinzaforte cumpriram a parte deles."*

   O culto das Terras Queimadas já estava por trás de tudo.
9. **Escolha:**
   * **Devolver a coroa a Odila:** anel **Juramento de Aurelião**.
   * **Ficar com a coroa:** visual **Coroa Rachada** e o título *"o Usurpador"*.

🎁 Baú de Ferro, o item da escolha, 2.000 moedas e XP.

---

## 2. Bosque Encantado (níveis 22–48)

### Fácil: *As Bugigangas do Pip*

**Nível:** 22–28 · **Quem pede:** Pip, o Mercador Gnomo

> "Meus próprios primos roubaram minha caixa de bugigangas!"

1. Recuperar 8 **Bugigangas** dos **Gnomos Trapaceiros**.
2. 🧩 **O Sininho Escondido.** Uma **Fada Travessa** escondeu o sininho do Pip em um de 6 cogumelos brilhantes da Gruta das Fadas. Ao clicar num cogumelo, ele diz *"frio"*, *"morno"* ou *"quente"*, conforme a distância do sininho. O lugar muda para cada jogador.
3. 🔗 O Pip conta que o primo dele, o **Escamílio**, mercador do Recife, *"também perdeu coisa para fada, uma vez"*. Não é uma quest, é só uma pista para o futuro.

🎁 400 moedas, XP e 10% de desconto no Pip.

### Média: *A Flauta Calada*

**Nível:** 32–38 · **Quem pede:** Barqueira Lis

> "O rio sempre cantou junto com as flautas dos faunos. Faz uma semana que ficou mudo."

1. Trazer 3 **Flautas Rachadas** dos **Faunos Flautistas**.
2. A **Druida Aurélia** vê seiva preta nelas e não sabe o que é. Ela escreve uma carta:
   > *"Leve isso ao Mestre Ígnio, nas Terras Queimadas. Só quem entende de fogo sabe ler o que queima por dentro."*
3. 🔗 **Viagem às Terras Queimadas** (de barco). Só para conversar: a cidade é segura. O **Mestre Ígnio** queima a seiva: a fumaça sai **azul** e forma uma palavra, *"sonho"*. É a mesma fumaça das Brumas.
   * Ele devolve a **Cinza Azul** e pede para você voltar mais forte. Isso abre o caminho para a quest média dele.
4. Com a Cinza Azul, a Aurélia faz um antídoto. Vencer **Silvano, o Fauno Ancião**: ele volta a si.
5. 🧩 **A Canção do Rio.** Silvano ensina uma melodia de 5 notas. Na margem do rio há 5 **pedras musicais**. Toque nelas na ordem certa:

   > *"O rio começa no alto, desce duas vezes, sobe uma, e termina onde começou."*

   A resposta é alta, média, baixa, média, alta. Acertando, o rio volta a cantar e abre uma **ilhota** que antes estava embaixo d'água.
6. 🔑 Na ilhota está a **Chave de Gelo Rachado**. É a chave do Baú Selado escondido nos **Fiordes**.

🎁 Baú de Ferro, 1.200 moedas, XP, e a Lis passa a levar você de barco até a Clareira.

### Complexa: *A Raiz Podre*

**Nível:** 40–48 · **NPCs:** Mestra Sylva, Druida Aurélia e Rainha Fada Lirael

> **Sylva:** "O Coração do Bosque está apodrecendo. A seiva preta veio de lá."

1. Trazer 10 **Seivas Negras** dos **Treants Apodrecidos**.
2. 🧩 **O Caminho das Mariposas.** O Coração do Bosque Sombrio fica **escuro** (a visão diminui). Junte 6 **Pós Luminosos** das **Mariposas Luminosas**, e cada pó acende uma **lanterna de pedra** no mapa. Com as 6 acesas, aparece no chão o desenho de uma folha, que aponta para uma passagem escondida.
3. 📜 No fim da passagem está o **Fragmento do Mapa nº 2**.
4. A **Rainha Fada Lirael** e a **Druida Aurélia** discordam sobre o que fazer. Aurélia quer curar a raiz; Lirael quer queimá-la. **Escolha um lado.**
5. Vencer **Morgrath, o Carvalho Corrompido**. Dentro do tronco dele há uma **concha do mar**, que não pertence ao bosque.
   > 🔗 **Aurélia:** "Uma concha, no coração de uma árvore? Isso veio de muito longe. Alguém no Recife deve saber."

   Isso só será resolvido no Recife.
6. Prêmio conforme o lado:
   * **Aurélia:** título *"Guardião do Bosque"* e o cajado/arco **Muda de Carvalho Vivo**.
   * **Lirael:** título *"Amigo das Fadas"* e as **Asas de Lirael** (visual).

🎁 Baú de Ferro, o item da escolha, 4.000 moedas e XP.

---

## 3. Terras Queimadas (níveis 40–96)

### Fácil: *Ferro para a Varga*

**Nível:** 40–50 · **Quem pede:** Varga, a Ferreira

> "Os diabretes roubam meu ferro. Me traz de volta que eu faço valer a pena."

1. Trazer 10 **Sucatas de Diabrete** e matar 5 **Cães Infernais**.
2. 🔗 No meio da sucata vem um **martelinho de prata** com a marca de Brumaval. A Varga reconhece:
   > *"Isso é da Bruna, a Forjadora de Brumaval! Somos irmãs. Devolve pra ela?"*
3. Levar o martelinho à **Bruna**, em Brumaval. Ela chora de rir, conta a história das duas e dá uma **Pedra de Afiar**: +1 na arma, uma vez.

🎁 1.500 moedas, XP e a Pedra de Afiar.

### Média: *Brasas que Não Apagam*

**Nível:** 56–76 · **Quem pede:** Irmã Brasa. Também abre para quem fez *A Flauta Calada*: o **Mestre Ígnio** chama você.

> "As almas da Necrópole não descansam. Alguém prende elas no fogo."

1. Juntar 5 **Brasas de Alma** dos **Espectros de Brasa**.
2. O **Mestre Ígnio** faz a **Lanterna do Repouso**, usando a **Cinza Azul** da quest do Bosque, se você tiver; se não tiver, ele pede 3 a mais.
3. 🧩 **Os Túmulos Acesos** (Necrópole, andar 2). São 7 túmulos e só 3 têm nomes de verdade. A Irmã Brasa dá a pista:
   > *"Os que descansam têm nome de pedra, de fogo e de água."*

   Os túmulos certos são de **Basalto**, **Fagulha** e **Marina**. Acender um túmulo errado acorda um Carniçal. Com os 3 certos acesos, a escada secreta para o andar 3 aparece.
4. 🔑 No andar secreto está a **Chave de Brasa**. Ela abre o **Baú das Cinzas**, que está escondido no Recife (veja a seção dos Baús Selados).
5. Vencer a **Viúva das Cinzas**.

🎁 Baú de Ferro, 4.000 moedas e XP.

### Complexa: *O Último Ovo*

**Nível:** 78–96 · **NPCs:** Capitão Brás, Fornalho e Mestre Ígnio

> **Brás:** "Os Cultistas do Dragão querem acordar Ignivar. Lembra da carta queimada do Varek? Era deles."

1. Matar 15 **Cultistas do Dragão** e achar as **Ordens do Culto**.
2. 🧩 **A Cifra do Culto.** As ordens estão em código: cada letra foi trocada pela seguinte do alfabeto. O texto vem assim:

   > *"PWP OP DPSBÇÃP EP WVMDÃP"*

   Isso se lê **"OVO NO CORAÇÃO DO VULCÃO"**. É preciso digitar a resposta para o Brás no chat, e a quest só avança com ela certa. Para quem não quiser decifrar, o Mestre Ígnio vende a resposta por 5.000 moedas.
3. O **Fornalho** faz o **Elmo de Obsidiana** com 8 **Escamas de Dragonete** e 5 **Lascas de Obsidiana**.
   > 🔗 *"Mas obsidiana racha. Pra temperar, só com gelo que nunca derrete. Isso tem o Bjorn, lá nos Fiordes."*
4. 🔗 **Viagem aos Fiordes.** O **Bjorn** dá o **Gelo Eterno**, desde que você traga 3 **Presas de Morsa**, que é o preço dele.
5. Vencer **Pyraxis** e pegar o **Ovo Escarlate**. 📜 O **Fragmento do Mapa nº 3** está grudado na casca.
6. **Escolha:**
   * **Dar o ovo ao Brás:** a arma **Fúria Escarlate**.
   * **Dar o ovo ao Ígnio:** o mascote **Dragonete**.
7. Vencer **Ignivar, o Dragão Ancestral**.

🎁 Baú de Ferro, o item da escolha, título *"Mata-Dragão"*, 10.000 moedas e XP.

---

## 4. Fiordes Gelados (níveis 70–100)

### Fácil: *Peles para o Inverno*

**Nível:** 70–76 · **Quem pede:** Gunnhild, a Peleteira

1. Trazer 8 **Peles de Lobo da Geada** e 4 **Presas de Morsa**.
2. 🔗 A Gunnhild pede para você levar a **capa pronta** à **Celina, a Alfaiate de Brumaval**:
   > *"Ela me ensinou a costurar quando eu era menina. Diz que a aluna superou a mestra."*

   A Celina dá risada e devolve um **molde de capa**, com o qual a Gunnhild faz a sua.

🎁 3.000 moedas, XP e o visual **Capa de Pele dos Fiordes**.

### Média: *O Navio que Voltou*

**Nível:** 80–86 · **Quem pede:** Capitão Ulfar

> "O navio do meu irmão Hálvar sumiu no gelo há vinte anos. Ontem ele voltou."

1. Recolher 6 **Plaquetas da Tripulação** dos **Marinheiros Afogados**.
2. A **Irmã Neve** reza pelos marinheiros, e o Hálvar fica mais fraco.
3. 🧩 **O Diário de Bordo** (cabine do capitão). A porta tem um cadeado de 3 números. A pista está nas plaquetas: cada uma tem um número de cabine, e o diário diz:
   > *"Os três que ficaram comigo até o fim: o mais novo, o mais velho e o cozinheiro."*

   As plaquetas mostram idade e função de cada um, e a resposta é digitada no chat.
4. Vencer o **Capitão Hálvar, o Congelado**. Ele entrega a **Bússola** e fala:
   > *"Um sineiro do Recife me pediu para esconder um baú bem longe do mar. Escondi atrás da cachoeira do Bosque, e na volta o gelo me pegou."*
5. 🔗 Devolver a bússola a Ulfar. A bússola **não aponta para o norte: aponta para o Recife**. Ela vira item de quest e é usada lá.

🎁 Baú de Ferro, 6.000 moedas e XP.

### Complexa: *A Aurora Partida*

**Nível:** 88–100 · **NPCs:** Arquimaga Hrefna, Bjorn e Rainha Ysolde

> **Hrefna:** "A aurora rachou. Aquilo no céu não é luz: é um olho, sonhando."

1. Juntar 5 **Fragmentos de Aurora** dos **Espectros da Aurora**.
2. 🧩 **Os Espelhos de Gelo** (Fenda da Aurora, andar 2). São 4 espelhos de gelo, e cada clique gira um deles 90°. Um raio de luz sai da parede e precisa chegar ao cristal do outro lado. A sala desenha o caminho do raio a cada giro. Isso abre a passagem para Alvaneve.
3. O **Bjorn** forja a **Chave de Gelo Eterno** com 3 **Corações de Gigante**.
4. Vencer **Alvaneve, a Mãe-Serpe**. 📜 O **Fragmento do Mapa nº 4** está no ninho.
5. **Ysolde, Rainha da Geada**, explica: a aurora é o sonho do Kraken vazando pelo céu. Ela quer congelar tudo para conter o sonho. Você pode **lutar** contra ela ou **se aliar** a ela, e com a aliança ela ajuda na luta seguinte.
6. Vencer **Aurorath, o Olho do Céu**. Ao morrer, ele diz:
   > *"Eu sou só o reflexo. O olho de verdade está embaixo d'água."*

   🔗 Isso leva ao Recife.

🎁 Baú de Ferro, o amuleto **Olho Fechado**, título *"Quem Fechou o Céu"*, 15.000 moedas e XP.

---

## 5. Recife Profundo (níveis 95–126)

### Fácil: *Pinças no Mercado*

**Nível:** 95–100 · **Quem pede:** Escamílio, o Mercador

1. Trazer 10 **Pinças Gigantes** e 3 **Ferrões de Água-Viva**.
2. 🔗 Se você fez a quest do **Pip**, o Escamílio reconhece o primo:
   > *"O Pip? Aquele baixinho ainda me deve 3 moedas!"*

   Ele manda um presente para o Pip. Ao levar, o Pip dá mais 5% de desconto, e o Escamílio passa a vender um item raro.

🎁 6.000 moedas, XP e 10 poções grandes.

### Média: *O Sino Mudo*

**Nível:** 102–110 · **Quem pede:** Mestre Ondino, o Sineiro

> "O sino avisa as tempestades desde antes de eu nascer. Os piratas da Maré-Negra arrancaram o badalo."

1. Recolher as 3 partes do **Badalo de Bronze** no **Naufrágio do Galeão Dourado**.
2. 🧩 **A Maré.** O tombadilho só fica acessível na **maré baixa**, que acontece por 3 minutos a cada 10 minutos, igual para todo o servidor. Um aviso aparece no chat: *"A maré está baixando…"*.
3. Vencer a **Capitã Maré-Negra**.
4. 🔗 Com a **Bússola do Hálvar** (dos Fiordes), o Ondino conta a história:
   > *"Foi o meu avô, o primeiro Ondino, que pediu ao Hálvar para esconder um dos baús. A bússola aponta para casa."*
5. O sino volta a tocar **no servidor inteiro**, com o seu nome.

🎁 Baú de Ferro, 10.000 moedas e XP.

### Complexa: *O Olho que Sonha*

**Nível:** 112–126 · **NPCs:** Oráculo Maréleo, Sacerdotisa Pérola e Nácar

> **Maréleo:** "Sonhei com um olho no fundo do mar. Quando ele acordar, o Kraken acorda junto."

1. Trazer 8 **Escamas Sagradas** dos **Sacerdotes Escamados**.
2. 🔗 A **concha do mar** que saiu de dentro do Morgrath, no Bosque: a **Sacerdotisa Pérola** reconhece.
   > *"É uma concha de prece. Alguém daqui levou um sonho do Kraken até o bosque e escondeu lá. Foi assim que a raiz apodreceu."*
3. 🧩 **O Templo dos Quatro Ventos** (Templo Afundado, santuário). São 4 estátuas, cada uma olhando para uma direção, e a parede diz:
   > *"O sol nasce, o peixe dorme, a tempestade vem, o barco volta."*

   As estátuas precisam olhar para **leste**, **baixo** (o fundo do mar), **norte** e **oeste**, nessa ordem. Isso abre a porta do Abyssor.
4. Vencer **Abyssor** e pegar a **Pérola Negra**.
5. A **Nácar** tece a **Rede de Luz** (6 **Fios de Água-Viva** e 4 **Lanternas Abissais**).
6. Vencer **O Olho da Fossa**. 📜 O **Fragmento do Mapa nº 5** estava no olho.
7. **Escolha:**
   * **Vencer o Kraken:** o **Tridente do Abismo**.
   * **Devolver a Pérola Negra:** título *"Voz das Marés"* e +10% de XP no Recife.

🎁 Baú de Ferro, o item da escolha, 25.000 moedas e XP.

---

## Os 5 Baús Selados

Cada guardião escondeu o baú **longe da própria terra**. A chave de cada baú vem de **outra** cidade, então só dá para abrir todos depois de viajar o mundo inteiro.

| Baú (de onde veio) | Escondido em | Como achar | Chave (de onde vem) |
|---|---|---|---|
| **Baú do Abismo** (Recife, o melhor) | **Brumaval**, embaixo da fonte da praça | O Rei das Criptas avisa. A fonte só abre se você estiver com a **Bússola do Hálvar** | **Chave de Coral**: o Coralino, o Forjador do Recife, faz quando você termina *O Sino Mudo* |
| **Baú da Aurora** (Fiordes) | **Bosque**, atrás da cachoeira | O Hálvar avisa. A cachoeira só para depois da *Canção do Rio* | **Chave de Gelo Rachado** (ilhota do rio, no Bosque); o **Bjorn** precisa consertar ela |
| **Baú das Cinzas** (Terras Queimadas) | **Recife**, num coral que brilha à noite | A Irmã Brasa sonha com ele depois de *Brasas que Não Apagam* | **Chave de Brasa** (Necrópole secreta) |
| **Baú das Folhas** (Bosque) | **Fiordes**, congelado dentro de um bloco de gelo | Só aparece para quem tem o **Fragmento nº 2**. É preciso derreter com a **Lanterna do Repouso** | **Chave de Raiz**: a Mestra Sylva faz com um galho da **Muda de Carvalho**, ou a Lirael com pó de fada |
| **Baú da Coroa** (Brumaval, o mais fraco) | **Terras Queimadas**, embaixo da bigorna da Varga | A Varga acha quando você devolve o martelinho da Bruna | **Chave de Osso** (parede falsa da Cripta) |

**Conteúdo:** cada baú tem o loot da **própria região**, mesmo estando longe. Por isso o Baú do Abismo, escondido em Brumaval, tem itens de nível 100+ (e só abre com chave do Recife).

**Bônus:** quem abrir os 5 ganha o título *"Guardião dos Cinco"*.

---

## Os 5 Fragmentos do Mapa: *O X das Brumas*

| Fragmento | Onde se acha |
|---|---|
| 1 | Brumaval, parede falsa da Cripta |
| 2 | Bosque, caminho das mariposas |
| 3 | Terras Queimadas, casca do ovo |
| 4 | Fiordes, ninho da Alvaneve |
| 5 | Recife, olho da Fossa |

Juntando os 5, o mapa mostra **um X em Brumaval**: no meio do **Ninho de Seda**, onde a Rainha da Seda morava. Lá você acha o **Altar das Brumas**, que dá início à quest final.

---

## Quest final: *As Cinco Brumas*

**Exige:** as 15 quests, os 5 baús e os 5 fragmentos.

1. No **Altar das Brumas**, as 5 vozes dos guardiões falam com você, uma de cada vez. Cada voz conta um pedaço da história de origem.
2. 🧩 **O último enigma.** O altar pergunta:
   > *"O que todos nós guardávamos, se não era ouro, nem arma, nem coroa?"*

   A resposta, digitada no chat, é **"um sonho"**. As pistas estão espalhadas pelas falas: a fumaça azul do Ígnio, o Aurorath, a Pérola e o Maréleo.
3. O altar abre um **portal especial**: o **Colosso das Brumas Desperto**, uma versão mais forte do Colosso de grupo (até 5 pessoas), uma vez por personagem.
4. Ao vencer, o sonho do Kraken se desfaz por um momento. As brumas somem do servidor por **1 hora**, com bônus de XP para todo mundo e uma mensagem com o nome do grupo.

🎁 Título *"Aquele que Acordou"*, o visual **Manto das Brumas** e um Baú das Brumas garantido.

---

## O que precisa ser construído

Hoje o jogo já tem os NPCs, os monstros, os portais de chefe, os baús e os grupos. Para as quests faltam:

1. **Sistema de quests no servidor:**
   * passos;
   * contagem de mortes;
   * itens de quest que só caem durante a quest;
   * as escolhas;
   * tudo salvo no personagem, sem dar para trapacear.
2. **Diálogos com NPC:**
   * "!" quando o NPC tem quest e "?" quando você pode entregar;
   * diálogos com opções e falas diferentes conforme o que você já fez (as ligações 🔗).
3. **Painel "Quests":** o passo atual, as contagens e uma dica de onde ir.
4. **Objetos novos nos mapas:**
   * pedras, alavancas, túmulos, lanternas, espelhos e estátuas para clicar;
   * paredes falsas;
   * baús escondidos;
   * a fonte, a cachoeira e o altar.
5. **Enigmas:**
   * **ordem certa:** alavancas, pedras, sinos, túmulos e estátuas;
   * **resposta digitada no chat:** cifra, cadeado e o último enigma;
   * **"quente / frio";**
   * **espelhos girando.**
6. **Eventos de servidor:** a maré a cada 10 minutos, o sino tocando e a hora sem brumas.
7. **Os prêmios novos:**
   * as armas e amuletos épicos;
   * o mascote Dragonete;
   * os visuais (Coroa, Asas, Capa e Manto);
   * os títulos.

**Ordem sugerida para fazer:**

1. o sistema de quests e as 3 de Brumaval, para testar;
2. as outras 4 cidades;
3. os Baús Selados, os Fragmentos e a quest final.

Cada etapa entra no ar separada, para você testar antes da próxima.
