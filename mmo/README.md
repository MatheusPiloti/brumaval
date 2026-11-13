# Brumaval Online

A versão com todos no mesmo mundo. O jogo solo (`src/`) continua separado e não muda por causa desta pasta.

| Pasta | O que tem |
|---|---|
| `client/game.html` | O jogo no navegador, em modo online. Começou como cópia do solo e agora segue o próprio caminho. |
| `server/` | O servidor: contas, personagens, posição de todos, movimento validado, escadas, barcos e chat. |
| `shared/world.js` | Os mapas, gerados a partir do cliente. O servidor regenera esse arquivo sozinho toda vez que inicia. |
| `deploy/install.sh` | Instala ou atualiza tudo numa VPS Ubuntu/Debian, com HTTPS automático. |
| `tools/` | Scripts de apoio (extração dos mapas e a conversão inicial do cliente). |

## Etapa atual: 1 de 4 (mundo compartilhado)

Já funciona:
- **Contas e personagens:** contas com usuário e senha (senha guardada com hash), até 5 personagens por conta, nomes únicos no servidor.
- **Mundo compartilhado:** todos se veem andando, em tempo real, em todos os 70 mapas.
- **Validação no servidor:** paredes, quinas, velocidade (nada de speed hack), escadas e barcos são checados pelo servidor.
- **Colisão:** fora da cidade os jogadores bloqueiam a passagem uns dos outros; dentro da cidade, não.
- **Chat:** Local (quem está na tela, com a fala em cima da cabeça) e Mundo (a partir do nível 5).
- **Conexão:** reconecta sozinho se a conexão cair, e a mesma conta não fica logada em dois lugares.
- **Posição salva:** a posição é salva no servidor; ao voltar, o personagem aparece onde estava.

Ainda não tem (próximas etapas):
- **2.** Monstros, combate, loot, XP e morte rodando no servidor. Por enquanto não existem monstros no online.
- **3.** Magias, itens, inventário, lojas e depósito no servidor. Hoje o inventário que aparece na tela é só visual e não é salvo.
- **4.** Grupo, troca de itens, PvP aberto com caveiras e guildas.

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

## Colocar na VPS

1. **Contrate uma VPS** com Ubuntu 22.04 ou 24.04. 1 GB de RAM sobra para o teste.
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
