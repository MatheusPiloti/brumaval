# Brumaval Online

A versão com todos no mesmo mundo. O jogo solo (`src/`) continua separado e não muda por causa desta pasta.

| Pasta | O que tem |
|---|---|
| `client/game.html` | O jogo no navegador, em modo online. Começou como cópia do solo e agora segue o próprio caminho. |
| `server/` | O servidor: contas, personagens, posição de todos, movimento validado, escadas, barcos e chat. |
| `shared/world.js` | Os mapas, gerados a partir do cliente. O servidor regenera esse arquivo sozinho toda vez que inicia. |
| `deploy/install.sh` | Instala ou atualiza tudo numa VPS Ubuntu/Debian, com HTTPS automático. |
| `tools/` | Scripts de apoio (extração dos mapas e a conversão inicial do cliente). |

## Etapa atual: 2 (mundo compartilhado com monstros)

O cliente online é o jogo solo inteiro: combate, itens, magias, torre, roupas e montarias.

O servidor cuida de:
- **Monstros compartilhados:** todos veem e caçam os mesmos bichos. O servidor cria os monstros nos mesmos lugares do jogo e controla:
  - andar, perseguir e atacar de perto ou de longe;
  - renascer e voltar para casa;
  - os poderes dos chefes: sopro, chuva de fogo, invocações e os tentáculos e a tinta do Kraken.
- **Dano e efeitos:** o seu ataque ou magia manda o dano e os efeitos (lento, preso, veneno, atordoado, empurrão) para o servidor, que mostra para todos.
- **XP e saque:**
  - o XP é dividido entre quem bateu, pela proporção do dano;
  - o corpo aparece para todos e quem pegar primeiro leva o item;
  - o equipamento extra é sorteado pensando na classe de quem mais bateu.
- **O resto:** contas, progresso de cada personagem, posição de todos, escadas, barcos, chat e o visual de cada um.

Continua só seu: a Torre das Brumas (cada um sobe a sua) e os bonecos de treino.

Próxima etapa: **3.** Grupo, troca de itens, PvP aberto com caveiras e guildas.

Os arquivos `mmo/shared/sim.js` (mapas, monstros, itens e pontos de nascimento) e `mmo/server/mobs.js` (inteligência dos monstros) são o que o servidor usa para o mundo. O `sim.js` é gerado de `mmo/client/game.html` por `mmo/tools/extract.py`. O servidor regera esse arquivo sozinho ao iniciar, se tiver Python.

Para atualizar o cliente a partir do jogo solo:

```bash
cp src/game.html mmo/client/game.html && python3 mmo/tools/make_online.py
```

## Grupo, chefes, baús e denúncias

- **Grupo (até 5):** convide pelo painel **Grupo** (ou `/convidar Nome`). A experiência dos monstros é dividida entre os membros por perto, com +10% por pessoa extra. Chat do grupo: canal **Grupo** ou `/g texto`.
- **Chefes em arena:** os chefes não nascem mais no mundo. No lugar de cada chefe (na caverna ou andar onde ele ficava) agora há um **portal**: cada jogador entra numa arena só sua, tem 15 minutos para vencer e ganha um **Baú de Ferro**. Depois de vencer, espera 30 minutos para enfrentar o mesmo chefe (a espera é de cada um, não do servidor). Na arena nada cai do corpo ao morrer.
- **Chefe de grupo: Colosso das Brumas.** Nível 30+, até 5 pessoas, 12 minutos. Fica no **Portal das Brumas**, em cada cidade. O líder abre o portal e entram todos do grupo que estiverem perto. A força acompanha o nível médio e o tamanho do grupo. Prêmio: **Baú das Brumas** e chance de 35% (garantida na 4ª vitória sem ela) de um **amuleto exclusivo da classe** (não pode ser vendido), com um atributo único: Guerreiro absorção de dano, Caçador sorte no saque, Feiticeiro recarga das magias mais rápida, Xamã mais cura recebida, Monge dano refletido. Os equipamentos do Baú das Brumas vêm com "do Colosso" no nome. Espera de 4 horas.
- **Baús:** Madeira (raro em qualquer monstro), Ferro (chefes solo) e Brumas (Colosso). O servidor sorteia o conteúdo: ouro, poções, equipamentos e chance de Épico ou Lendário (Lendário é anunciado para todos).
- **Denúncias:** botão **Denunciar** no topo (ou `/denunciar Nome o que houve`). Ficam em `data/reports.json` com as últimas falas do chat por perto. ADM vê com `/denuncias` e `/denuncia N`.
- **Reinício do servidor:** toda vez que o servidor liga de novo (atualização, manutenção ou queda), todos têm experiência e saque em dobro por 20 minutos, e quem estava online na hora ganha um Baú de Ferro com um pedido de desculpas ao entrar.
- Os tempos e chances ficam no começo de `server/extras.js`.

## Quests: *A Origem das Brumas*

- **15 quests**, 3 por cidade (fácil, média e complexa), com história. NPC com **!** amarelo tem quest para dar; com **?** azul, um passo está esperando nele. Clique no NPC: a conversa da quest aparece primeiro, e **Outros assuntos** abre a loja ou o serviço de sempre.
- O painel **Missões** mostra o passo atual, as contagens e as quests que dá para pegar. O **✕** abandona uma quest (dá para pegar de novo).
- As cidades se ligam: um NPC manda falar com outro em outra cidade. Quando um passo pede isso, o barco leva você mesmo abaixo do nível da ilha.
- **Enigmas:** pedras e alavancas em ordem, túmulos certos, cogumelos "quente/frio", pedras musicais, espelhos e estátuas para girar, cadeado, mensagem em código, resposta digitada, e a maré do Naufrágio (baixa 3 minutos a cada 10).
- **5 Baús Selados:** cada um escondido numa cidade e aberto com a chave de outra; começam sozinhos quando a pista aparece. **5 Fragmentos do Mapa** levam à quest final, **As Cinco Brumas**, com o Colosso das Brumas Desperto (uma vez por personagem). Vencer dá 1 hora de experiência e saque em dobro para todos.
- **Níveis de prêmio:** a quest fácil dá 1 nível, a média 2 e a difícil 5 (a final, As Cinco Brumas, também 5). A barra de experiência fica na mesma posição. Os Baús Selados dão 40% de um nível. Os valores ficam no começo de `server/questdata.js` (`T1`, `T2`, `T3`, `TS`).
- Prêmios: ouro, Baú de Ferro, itens Lendários com nome próprio, títulos (Visual → Título) e visuais (Coroa Rachada, Capa dos Fiordes, Asas de Lirael, Dragonete Escarlate, Manto das Brumas).
- Tudo fica no servidor: `server/quests.js` (o motor) e `server/questdata.js` (as histórias, os passos e onde ficam os objetos). O texto completo está em `QUESTS.md`.
- **ADM, para testar:** `/quest dar ID`, `/quest pular [ID]`, `/quest flag NOME`, `/quest feita ID…`, `/quest obj ID` (vai até o objeto), `/quest mob tipo` (vai até onde o monstro nasce), `/quest mare` (força a maré baixa) e `/quest reset`.

## Comandos no chat

- **Todos:** `/quem` lista quem está online.
- **ADM:** os usuários definidos como ADM também podem usar:
  - `/nivel 60` muda o seu nível.
  - `/ir cave` ou `/ir ash 40 30` leva você para outro mapa.
  - `/trazer Nome` puxa um jogador até você.
  - `/aviso texto` manda uma mensagem para todos.

Durante o teste, os barcos são de graça (o ouro ainda não é do servidor), mas continuam exigindo o nível de cada ilha.

## Testar no seu computador

Precisa do Node.js 20 ou mais novo e do Python 3.

```bash
cd mmo/server
npm install
ADMIN_USERS=seuusuario node server.js
```

Abra http://localhost:8080 em duas abas, crie duas contas e ande com as duas.

## Usar o seu próprio computador como servidor (Windows, grátis)

1. Instale o Node.js (versão LTS) em https://nodejs.org.
2. Baixe o projeto: https://github.com/matheuspiloti/brumaval/archive/refs/heads/main.zip e extraia.
3. Abra a pasta `mmo/deploy` e dê dois cliques em `servidor-windows.bat`.
4. Na janela, aparece um link `https://...trycloudflare.com`. É o endereço do jogo; mande para quem vai jogar.

- O servidor só fica ligado enquanto o computador estiver ligado e a janela aberta.
- O link muda toda vez que você abre o arquivo de novo.
- Contas e personagens ficam em `mmo/server/data`.
- A primeira conta criada vira ADM.

## Colocar na VPS

1. **Contrate uma VPS** com Ubuntu 22.04 ou 24.04. 1 GB de RAM sobra para o teste. De graça: Oracle Cloud Always Free (região São Paulo ou Vinhedo); o instalador já abre o firewall interno que as máquinas da Oracle trazem.
2. **Libere as portas 80 e 443.** Se a empresa da VPS tem firewall no painel (Oracle, AWS, Google Cloud), libere essas portas lá também.
3. **Entre por SSH** e rode, trocando `seuusuario` pelo usuário do jogo que vai ser ADM:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/matheuspiloti/brumaval/main/mmo/deploy/install.sh -o install.sh
   sudo bash install.sh "" seuusuario
   ```

4. **Abra o jogo.** No fim, o script mostra o endereço, algo como `https://203-0-113-7.sslip.io`. É o IP da VPS com traços, e já vem com HTTPS sem precisar comprar domínio. Se tiver um domínio próprio, aponte ele para o IP da VPS e use `sudo bash install.sh jogo.seudominio.com seuusuario`.
5. **Crie a conta ADM.** Na tela de entrada do jogo, crie uma conta com o usuário que você passou como ADM.

### Atualizar depois de mudanças no jogo

Rode o mesmo comando de novo:

```bash
sudo bash install.sh
```

Ele baixa a versão nova e reinicia o servidor. As contas e os personagens continuam.

### Ver o servidor, fazer backup

- **Acompanhar o servidor (quem entrou, erros):** `journalctl -u brumaval -f`
- **Onde ficam os dados:** contas e personagens em `/var/lib/brumaval/` (`accounts.json` e `characters.json`).
- **Fazer backup:** `sudo tar czf brumaval-backup.tgz /var/lib/brumaval`
- **Reiniciar:** `sudo systemctl restart brumaval`
