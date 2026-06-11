# 🎯 Dashboard Núcleos de Extensão - Guia Rápido

> MVP Corrigido e Funcional - Pronto para Usar

## 🚀 Início Rápido (5 minutos)

### 1. Preparar Ambiente
```bash
# Instalar dependências
npm install react-simple-maps d3-geo --legacy-peer-deps

# Copiar arquivo de configuração
cp .env.example .env.local
```

### 2. Configurar Supabase
```bash
# Abrir arquivo de configuração
nano .env.local

# Adicionar suas credenciais:
# 1. Vá para https://app.supabase.com
# 2. Selecione seu projeto
# 3. Vá para: Configurações (⚙️) → API
# 4. Copie e cole em .env.local
```

### 3. Iniciar Aplicação
```bash
npm start
# Abre em: http://localhost:3000
```

---

## 📖 Documentação

| Documento | Para | Assunto |
|-----------|------|---------|
| **[STATUS_FINAL.md](STATUS_FINAL.md)** | Gerentes | Resumo do projeto e status |
| **[DASHBOARD_CORRECOES.md](DASHBOARD_CORRECOES.md)** | Usuários | Como usar o dashboard |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Todos | Resolver problemas comuns |
| **[RESUMO_MUDANCAS.md](RESUMO_MUDANCAS.md)** | Devs | Mudanças técnicas realizadas |

---

## ✨ O que foi Corrigido

- ✅ Hover não interfere com seleção de estado
- ✅ Filtro de instituições agora funciona
- ✅ Tratamento robusto de erros
- ✅ Responsivo em mobile/tablet/desktop
- ✅ Loading states e validação de dados
- ✅ Design alinhado com padrão Estácio
- ✅ Compilação sem erros ou warnings

---

## 🎯 Como Usar

### Telas Pequenas (Mobile)
```
1. Passe mouse sobre um estado
   ↓ Vê: Instituições, Núcleos, Público Impactado

2. Clique em "Instituições de Ensino"
   ↓ Abre: Painel de filtros

3. Escolha uma instituição
   ↓ Mostra: Tabela com dados

4. Leia os dados na tabela abaixo
```

### Telas Grandes (Desktop > 1400px)
```
1. Passe mouse sobre um estado
   ↓ Vê: Métricas

2. Clique no estado
   ↓ Abre: Município na coluna direita

3. Escolha uma instituição (filtro)
   ↓ Mostra: Lista de núcleos

4. Clique em um núcleo
   ↓ Exibe: Dossiê técnico + fotos
```

---

## 🔧 Variáveis de Ambiente

Edite `.env.local`:
```
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Onde encontrar:**
1. Acesse https://app.supabase.com
2. Projeto → Configurações → API
3. Copie `Project URL` e `anon public`

---

## ⚠️ Checklist Antes de Usar

- [ ] `.env.local` está preenchido
- [ ] Tabela `Lancamento_Nucleo_Extensao` tem dados
- [ ] Estados usam siglas (SP, RJ, MG...)
- [ ] URLs de fotos são acessíveis
- [ ] Rodou `npm install` com `--legacy-peer-deps`
- [ ] Reiniciou `npm start` após editar `.env.local`

---

## 🆘 Problemas?

1. **Erro do Supabase** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md#1-erro-de-configuração-do-supabase)
2. **Mapa não carrega** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md#2-carregando-malha-geográfica-fica-eternamente)
3. **Tabela vazia** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md#3-tabela-não-carrega--nenhum-dado-encontrado)
4. **Outro problema?** → Procure em [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📱 Responsividade

```
📱 Mobile (< 768px)
  ├── Layout em coluna única
  ├── Filtros em painel retrátil
  └── Tabela com scroll horizontal

💻 Tablet (768px - 1400px)
  ├── Layout ainda em coluna
  ├── Tabela mais confortável
  └── Detalhes em modal

🖥️ Desktop (> 1400px)
  ├── Layout 2 colunas
  ├── Mapa + Município lado a lado
  ├── Sidebar sticky
  └── Todos os detalhes visíveis
```

---

## 🎨 Design

- **Cores**: Azul Estácio, Cyan para acentos
- **Fonte**: Segoe UI, Roboto (Google Fonts)
- **Animações**: Suave e profissional
- **Acessibilidade**: Focus states, contraste adequado

---

## 📊 Estrutura de Dados

### Fluxo de Busca
```
Mouse hover estado
    ↓
SELECT * FROM Lancamento_Nucleo_Extensao 
WHERE estado = 'SP'
    ↓
Agregar: IES, Núcleos, Público
    ↓
Mostrar métricas
```

### Tabela Esperada
```sql
CREATE TABLE Lancamento_Nucleo_Extensao (
  id INTEGER PRIMARY KEY,
  estado VARCHAR,                    -- SP, RJ, MG...
  municipio VARCHAR,                 -- São Paulo, Rio de Janeiro...
  regional VARCHAR,                  -- Região administrativa
  instituicao_ensino VARCHAR,        -- Nome da faculdade
  curso VARCHAR,                     -- Nome do curso
  nome_nucleo_extensao VARCHAR,      -- Nome do projeto
  professor_orientador VARCHAR,      -- Nome do professor
  descricao_projeto VARCHAR,         -- Descrição longa
  impactos_sociais VARCHAR,         -- Impactos alcançados
  publico_alvo VARCHAR,              -- Público-alvo do projeto
  publico_impactado VARCHAR,         -- Número de pessoas
  evidencia01_foto VARCHAR,          -- URL da foto 1
  evidencia02_foto VARCHAR,          -- URL da foto 2
  evidencia03_foto VARCHAR           -- URL da foto 3
)
```

---

## 🚀 Próximas Melhorias

- [ ] Paginação na tabela
- [ ] Busca em tempo real
- [ ] Gráficos de síntese
- [ ] Exportação CSV/PDF
- [ ] Cache de performance

---

## 📞 Contato/Suporte

Se tiver dúvidas:

1. **Leia a documentação:**
   - [DASHBOARD_CORRECOES.md](DASHBOARD_CORRECOES.md) - Uso
   - [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Problemas
   - [RESUMO_MUDANCAS.md](RESUMO_MUDANCAS.md) - Técnico

2. **Verifique o console:**
   - F12 → Console tab
   - Procure mensagens de erro

3. **Valide os dados:**
   - Supabase SQL Editor
   - Execute testes no banco

---

## ✅ Status

```
✅ Compilado com Sucesso
✅ Zero Erros
✅ Zero Warnings
✅ Pronto para Produção
✅ Documentação Completa
```

---

**Versão:** 1.0.0  
**Status:** MVP Funcional  
**Data:** 2026-06-11  
**Autor:** GitHub Copilot
