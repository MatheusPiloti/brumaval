// Configuração do Brumaval.
//
// Deixe os dois campos vazios para jogar sem contas: o personagem fica salvo só no navegador.
// Para ligar contas e save na nuvem, crie um projeto no Supabase, rode supabase/schema.sql
// e cole aqui a URL do projeto e a chave pública (Project Settings → API Keys).
// A chave pública ("publishable" ou "anon") pode ficar no site: quem protege os dados são as
// regras de segurança (RLS) do schema.sql. NUNCA coloque aqui a chave "secret" / "service_role".
window.BRUMAVAL_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
