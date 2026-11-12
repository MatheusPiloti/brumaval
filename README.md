# Brumaval

RPG 2D de quadrados no navegador: 5 classes, itens com raridade, duas cidades ligadas por barco, nove masmorras com andares e chefes.

## Estrutura

| Caminho | O que é |
|---|---|
| `src/game.html` | O jogo inteiro (HTML, CSS e JavaScript num arquivo só). É aqui que se edita. |
| `config.js` | Liga ou desliga as contas na nuvem (Supabase). Vazio = joga sem conta. |
| `build.py` | Gera a pasta `dist/` pronta para publicar. |
| `supabase/schema.sql` | Banco de dados das contas e personagens. |
| `.github/workflows/pages.yml` | Publica sozinho no GitHub Pages a cada envio para a branch `main`. |

Gerar a versão para publicar (precisa de Python 3):

```bash
python3 build.py
```

Isso cria:

- `dist/index.html`: o jogo completo
- `dist/config.js`: a configuração
- `dist/brumaval-itch.zip`: o pacote para o itch.io

Testar no seu computador:

```bash
python3 -m http.server 8000 -d dist
```

Depois abra http://localhost:8000.

---

## Etapa 1: publicar o jogo

Escolha **uma** das opções. Todas são gratuitas para começar.

### Opção A: itch.io (a mais simples, feita para jogos)

1. Crie uma conta em itch.io e clique em **Upload new project**.
2. Em **Kind of project**, escolha **HTML**.
3. Em **Uploads**, envie `dist/brumaval-itch.zip` e marque **This file will be played in the browser**.
4. Em **Embed options**, marque **Click to launch in fullscreen** (o jogo se ajusta sozinho ao tamanho da tela) e **Mobile friendly**.
5. Salve. Deixe como **Draft** para testar e mude para **Public** quando quiser lançar.

### Opção B: GitHub Pages (atualiza sozinho a cada mudança)

1. Crie um repositório vazio no GitHub (por exemplo, `brumaval`).
2. Dentro desta pasta, se ela ainda não for um repositório git (por exemplo, se veio do zip):

   ```bash
   git init -b main
   ```

   ```bash
   git add -A
   ```

   ```bash
   git commit -m "Primeira versão do Brumaval"
   ```

3. Ligue ao GitHub e envie:

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/brumaval.git
   ```

   ```bash
   git push -u origin main
   ```

4. No repositório: **Settings → Pages → Source: GitHub Actions**.
5. A cada `git push` para a `main`, o jogo é publicado em `https://SEU_USUARIO.github.io/brumaval/`.

### Opção C: Netlify (arrastar e soltar)

1. Rode `python3 build.py`.
2. Entre em app.netlify.com/drop e arraste a pasta `dist`.

---

## Etapa 2: contas e save na nuvem (Supabase)

Com o `config.js` vazio, o jogo funciona como antes: sem login, salvando só no navegador. Preenchendo o `config.js`, aparece a tela de login e os personagens passam a ser salvos no servidor. Assim o jogador continua de qualquer aparelho.

### Passo a passo

1. Crie uma conta e um projeto em supabase.com. Escolha a região mais perto dos jogadores (por exemplo, São Paulo).
2. No painel do projeto, abra **SQL Editor**, cole todo o arquivo `supabase/schema.sql` e clique em **Run**. Isso cria:
   - `profiles`: uma linha por conta, com o campo `vip_until` para a etapa 3;
   - `characters`: os personagens, com o save completo em JSON e no máximo 3 por conta;
   - regras de segurança (RLS), para que cada jogador só veja e altere os próprios personagens e ninguém consiga se dar VIP pelo navegador.
3. Em **Project Settings → API Keys**, copie:
   - a **URL do projeto** (`https://xxxx.supabase.co`);
   - a chave **publishable** (ou **anon**, nos projetos mais antigos).
4. Cole as duas no `config.js`:

   ```js
   window.BRUMAVAL_CONFIG = {
     supabaseUrl: 'https://xxxx.supabase.co',
     supabaseAnonKey: 'sua-chave-publica'
   };
   ```

5. Em **Authentication → URL Configuration**, coloque o endereço onde o jogo está publicado em **Site URL** e em **Redirect URLs** (por exemplo, `https://SEU_USUARIO.github.io/brumaval/`). O link de confirmação de e-mail volta para esse endereço.
6. Em **Authentication → Sign In / Providers → Email**, decida se exige confirmação de e-mail. Ligada é mais seguro; desligada é mais rápida para testar.
7. Rode `python3 build.py` e publique de novo.

### Segurança: o que pode e o que não pode

- A chave **publishable/anon** pode ficar no site. Ela é pública por natureza; quem protege os dados são as regras RLS do `schema.sql`.
- **Nunca** coloque a chave **secret / service_role** no `config.js` nem em nenhum arquivo do jogo. Ela ignora todas as regras e só pode ficar em servidor (etapa 3).
- O jogo roda no navegador, então quem souber mexer consegue editar o próprio personagem antes de salvar. Isso só afeta a pessoa que trapaceou. Para impedir de vez, a lógica do jogo teria que rodar num servidor (um MMO de verdade).

### Como fica para o jogador

- Tela inicial com e-mail e senha: **Entrar** ou **Criar conta**.
- Lista dos personagens da conta (até 3), com **Jogar** e **Apagar** (pede confirmação).
- O jogo salva na nuvem sozinho a cada 15 segundos, ao clicar em **Salvar** e ao fechar ou trocar de aba.
- O topo mostra o e-mail, o status do save e, se a conta for VIP, até quando.

---

## Etapa 3 (futuro): VIP

Já está preparado: a coluna `profiles.vip_until` existe e o jogo mostra "VIP até dd/mm/aaaa" quando ela está no futuro. Falta:

1. Um checkout de pagamento (Stripe ou Mercado Pago).
2. Uma função no servidor (por exemplo, uma Supabase Edge Function) que recebe o aviso de pagamento aprovado do Stripe ou Mercado Pago e grava `vip_until` usando a chave secreta, que fica só no servidor.
3. Decidir os benefícios e checá-los no jogo.

Antes de cobrar, você precisa de termos de uso, uma política de privacidade (LGPD) e regras de reembolso.
