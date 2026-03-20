import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  import.meta.env.REACT_APP_SUPABASE_URL

const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  import.meta.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

try {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Configuração do Supabase ausente')
  }

  supabase = createClient(supabaseUrl, supabaseKey)
} catch (error) {
  console.error('Erro ao inicializar Supabase:', error.message)

  // Mensagem amigável para o usuário
  alert(`
⚠️ Erro de configuração do sistema


⚠️ Acessar o arquivo src/infra/supabase/supabaseClient.js para resolver o problema.

Não foi possível conectar ao Supabase.

Possíveis causas:
• Variáveis de ambiente não configuradas
• Nome das variáveis incorreto
• Ambiente não reiniciado

Como resolver:
1. Verifique se as variáveis abaixo existem:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY

   Você vai aprender a configurar as variáveis:
	REACT_APP_SUPABASE_URL
	REACT_APP_SUPABASE_ANON_KEY
Essas variáveis são usadas para conectar seu projeto ao Supabase.

1. Pegando as variáveis no Supabase
Acesse o painel do Supabase
Entre no seu projeto

Vá em: Settings → API
Copie:
Project URL → será REACT_APP_SUPABASE_URL
anon public key → será REACT_APP_SUPABASE_ANON_KEY

2. Configurando no GitHub (Secrets)
Acesse seu repositório no GitHub

Clique em: Settings
No menu lateral:
Secrets and variables → Codespace

Clique em: New repository secret
Agora crie:
Variável 1
	Name: REACT_APP_SUPABASE_URL
	Value: (cole a URL do Supabase)

Variável 2
	Name: REACT_APP_SUPABASE_ANON_KEY
	Value: (cole a chave anon)

Clique em Save após cada uma.




   `)
}

export { supabase }