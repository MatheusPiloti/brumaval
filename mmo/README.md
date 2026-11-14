# Brumaval Online

A versão com todos no mesmo mundo. O jogo solo (`src/`) continua separado e não muda por causa desta pasta.

| Pasta | O que tem |
|---|---|
| `client/game.html` | O jogo no navegador, em modo online. Começou como cópia do solo e agora segue o próprio caminho. |
| `server/` | O servidor: contas, personagens, posição de todos, movimento validado, escadas, barcos e chat. |
| `shared/world.js` | Os mapas, gerados a partir do cliente. O servidor regenera esse arquivo sozinho toda vez que inicia. |
| `deploy/install.sh` | Instala ou atualiza tudo numa VPS Ubuntu/Debian, com HTTPS automático. |
| `tools/` | Scripts de apoio (extração dos mapas e a conversão inicial do cliente). |

## Etapa atual: 2a (jogo completo, monstros de cada um)

O cliente online é o jogo solo inteiro: monstros, combate, itens, magias, torre, roupas e montarias.

O servidor cuida de:
- contas;
- progresso de cada personagem (nível, itens, ouro, magias e visual são salvos no servidor);
- posição de todos, escadas, barcos e chat;
- visual de cada um: você vê a roupa, o equipamento e a montaria dos outros.

Limitação desta etapa: os monstros rodam no navegador de cada jogador, então cada um vê e mata os seus. Na Torre das Brumas, o andar também é só seu.

Próximas etapas:
- **2b.** Monstros compartilhados, rodando no servidor: todos batem no mesmo bicho e dividem o saque.
- **3.** Grupo, troca de itens, PvP aberto com caveiras e guildas.

Para atualizar o cliente a partir do jogo solo:

```bash
cp src/game.html mmo/client/game.html && python3 mmo/tools/make_online.py
```

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
