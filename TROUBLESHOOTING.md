# Guia de Troubleshooting - Dashboard Núcleos de Extensão

## 🔴 Erros Comuns e Soluções

---

## 1. "Erro de configuração do Supabase"

### Mensagem que aparece
```
⚠️ Erro de configuração do sistema
⚠️ Não foi possível conectar ao Supabase.
```

### Causas Possíveis
- [ ] `.env.local` não está configurado
- [ ] `REACT_APP_SUPABASE_URL` está inválida
- [ ] `REACT_APP_SUPABASE_ANON_KEY` está vazia ou incorreta

### Solução
```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env.local

# 2. Edite .env.local com suas credenciais
nano .env.local

# 3. Verifique o conteúdo
cat .env.local

# 4. Reinicie o servidor
npm start
```

### Verificar Credenciais Supabase
1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para: **Configurações** (⚙️) → **API**
4. Copie:
   - `Project URL` → `REACT_APP_SUPABASE_URL`
   - `anon public` → `REACT_APP_SUPABASE_ANON_KEY`

---

## 2. "Carregando malha geográfica..." Fica Eternamente

### Problema
O mapa não carrega, a mensagem fica exibindo

### Causas Possíveis
- [ ] URL do TopoJSON está quebrada
- [ ] Sem conexão de internet
- [ ] CORS bloqueando requisição

### Solução

#### Verificar Console (F12)
```javascript
// Abra DevTools > Console
// Procure por erros relacionados a:
// - "Failed to fetch"
// - "CORS"
// - "404"
```

#### Testar URL do TopoJSON
```bash
curl -I "https://raw.githubusercontent.com/jonasfeitosa/brazil-topojson/master/brazil-states.json"
# Deve retornar: HTTP/1.1 200 OK
```

#### Se URL está quebrada
```javascript
// Abra Dashboard.jsx e procure por:
const BR_TOPO_JSON = "https://raw.githubusercontent.com/jonasfeitosa/brazil-topojson/master/brazil-states.json";

// Tente uma URL alternativa:
const BR_TOPO_JSON = "https://raw.githubusercontent.com/vitorfs/world-atlas-json/master/data/br-states.json";
```

---

## 3. Tabela Não Carrega / "Nenhum dado encontrado"

### Problema
Depois de clicar em um estado, a tabela fica vazia

### Causas Possíveis
- [ ] Tabela `Lancamento_Nucleo_Extensao` não tem registros
- [ ] Siglas de estado estão diferentes (ex: "sp" vs "SP")
- [ ] Permissões Supabase não permitem SELECT

### Solução

#### Verificar Dados no Supabase
1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Vá para: **SQL Editor**
3. Execute:

```sql
-- Verificar se tabela existe e tem registros
SELECT COUNT(*) as total_registros FROM "Lancamento_Nucleo_Extensao";

-- Ver quais estados temos
SELECT DISTINCT estado FROM "Lancamento_Nucleo_Extensao" LIMIT 10;

-- Verificar dados de um estado específico
SELECT * FROM "Lancamento_Nucleo_Extensao" WHERE estado = 'SP' LIMIT 5;
```

#### Verificar Console do Browser (F12)
```javascript
// Veja logs de erro:
// "Erro ao popular tabela do estado: ..."
```

#### Conferir Siglas de Estados
```javascript
// Em Dashboard.jsx, procure por:
const ESTADO_SIGLAS = {
  'São Paulo': 'SP',
  'Rio de Janeiro': 'RJ',
  // ...
};

// Verifique se seus dados usam siglas (SP, RJ) ou nomes completos (São Paulo, Rio de Janeiro)
```

#### Verificar Permissões Supabase

1. Acesse seu projeto Supabase
2. Vá para: **Authentication** → **Policies**
3. Certifique-se que a tabela tem permissão **SELECT** para usuários anônimos:

```sql
-- Criar policy de leitura pública (se não existir)
CREATE POLICY "Enable read access for all users" 
ON "Lancamento_Nucleo_Extensao" 
FOR SELECT 
USING (true);
```

---

## 4. Fotos de Evidência Não Carregam

### Problema
Seção "📸 Evidências de Campo" aparece vazia mesmo com dados

### Causas Possíveis
- [ ] URLs das fotos estão inválidas
- [ ] URLs não são acessíveis publicamente
- [ ] Campos estão nulos no banco

### Solução

#### Verificar URLs no Supabase
```sql
SELECT 
  id,
  nome_nucleo_extensao,
  evidencia01_foto,
  evidencia02_foto,
  evidencia03_foto
FROM "Lancamento_Nucleo_Extensao"
WHERE evidencia01_foto IS NOT NULL
LIMIT 5;
```

#### Testar URL Manualmente
```bash
# Copie uma URL de evidência e teste
curl -I "https://sua-url-da-foto.jpg"
# Deve retornar: HTTP/1.1 200 OK (não 404 ou 403)
```

#### Se URL retorna 403 (Forbidden)
Isso significa que a foto não é acessível publicamente.

**Soluções:**
1. **Se usar Supabase Storage:** Habilitar acesso público
   - Vá para: **Storage** → Pasta da foto → **Settings** → Marcar "Public"

2. **Se usar S3 ou similar:** Verificar CORS e permissões públicas

3. **Se usar link externo:** Garantir que o link é válido e público

---

## 5. Erro: "Cannot read properties of undefined"

### Problema
Página quebra com erro JavaScript

### Causa Comum
Tentando acessar propriedade de objeto nulo/undefined

### Solução

#### 1. Verificar Console (F12 → Console)
Veja a mensagem completa do erro. Exemplo:
```
Cannot read properties of undefined (reading 'estado')
    at Dashboard.jsx:123
```

#### 2. Abrir o arquivo indicado (line 123)
Procure pelo código e adicione verificação:

```javascript
// ❌ ERRADO - pode quebrar
<div>{data.estado}</div>

// ✅ CORRETO - verificar antes
<div>{data?.estado || 'N/A'}</div>
```

#### 3. Procurar por "publico_impactado"
Esse é um campo comum com problema:

```javascript
// ❌ ERRADO
const total = data.publico_impactado + 10;

// ✅ CORRETO
const total = (data.publico_impactado || 0) + 10;
```

---

## 6. Filtro por Instituição Não Funciona

### Problema
Ao selecionar instituição no dropdown, a tabela não filtra

### Causas Possíveis
- [ ] Nome da instituição tem espaço ou case incorreto
- [ ] Campo `instituicao_ensino` está null no banco

### Solução

#### Verificar Dados
```sql
SELECT DISTINCT instituicao_ensino
FROM "Lancamento_Nucleo_Extensao"
WHERE estado = 'SP'
ORDER BY instituicao_ensino;
```

#### Se aparecer valores nulos
```sql
-- Ver quantos registros têm instituição nula
SELECT COUNT(*) 
FROM "Lancamento_Nucleo_Extensao"
WHERE instituicao_ensino IS NULL;

-- Preencher com valor padrão (se necessário)
UPDATE "Lancamento_Nucleo_Extensao"
SET instituicao_ensino = 'Sem Informação'
WHERE instituicao_ensino IS NULL;
```

---

## 7. Responsividade Quebrada em Mobile

### Problema
Layout fica confuso em celular

### Solução

#### Verificar Viewport Meta Tag
No arquivo `public/index.html`, procure por:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Se não estiver, adicione no `<head>`.

#### Testar Device Emulation
1. Abra DevTools (F12)
2. Clique em **Toggle device toolbar** (Ctrl+Shift+M)
3. Selecione "iPhone 12" ou similar
4. Teste o layout

---

## 8. Mapa Não Aparece (Componente Branco)

### Problema
A área do mapa fica branca/vazia

### Causas Possíveis
- [ ] `react-simple-maps` não foi instalado
- [ ] Altura CSS não está definida
- [ ] Erro no TopoJSON

### Solução

#### 1. Verificar Instalação
```bash
npm list react-simple-maps
# Deve mostrar: react-simple-maps@3.0.0 (ou similar)

# Se não aparecer, instalar:
npm install react-simple-maps d3-geo --legacy-peer-deps
```

#### 2. Verificar Console (F12)
Procure por erros relacionados a `react-simple-maps`

#### 3. Verificar Altura CSS
```javascript
// Em Dashboard.jsx, procure por:
<div className="svg-map-wrapper" style={{ height: '520px', ... }}>

// Certifique-se de que height está setado
```

---

## 9. Selecionar Núcleo Não Exibe Dossiê

### Problema
Clica em um núcleo, mas o painel direito não carrega os dados

### Causa Comum
Tela não está expandida (< 1400px)

### Solução

#### 1. Em Desktop
Garanta que a largura está > 1400px:
```javascript
// Abra DevTools > Console
window.innerWidth  // Deve estar > 1400
```

#### 2. Se largar a tela ao máximo e ainda não funciona
Verificar se dados do núcleo têm campos nulos:

```sql
-- Verificar dados completos de um núcleo
SELECT * 
FROM "Lancamento_Nucleo_Extensao"
WHERE id = 123;  -- Substituir com ID real
```

Se muitos campos forem NULL, completar os dados.

---

## 10. Aplicação Lenta / Lag

### Problema
Interface fica lenta ao interagir, hover trava

### Causas Possíveis
- [ ] Muitos registros na tabela (>1000)
- [ ] Queries lentas no Supabase
- [ ] Renderização ineficiente

### Solução

#### 1. Limitar Quantidade de Registros
```javascript
// Em Dashboard.jsx, modificar query:
const { data, error: dbError } = await supabase
  .from('Lancamento_Nucleo_Extensao')
  .select('*')
  .eq('estado', estado)
  .limit(100)  // ← Adicione limite
  .order('instituicao_ensino', { ascending: true });
```

#### 2. Adicionar Paginação
```javascript
// Usar offset para carregamento progressivo
.range((page - 1) * 50, page * 50)
```

#### 3. Ativar Indexes no Supabase
```sql
-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_estado 
ON "Lancamento_Nucleo_Extensao"(estado);

CREATE INDEX IF NOT EXISTS idx_municipio 
ON "Lancamento_Nucleo_Extensao"(municipio);

CREATE INDEX IF NOT EXISTS idx_instituicao 
ON "Lancamento_Nucleo_Extensao"(instituicao_ensino);
```

---

## 📋 Checklist de Verificação

Antes de reportar bug, verifique:

- [ ] `.env.local` está criado e preenchido
- [ ] `npm install` foi executado com `--legacy-peer-deps`
- [ ] Tabela `Lancamento_Nucleo_Extensao` tem registros
- [ ] Permissões Supabase (SELECT) estão ativas
- [ ] URLs de fotos são acessíveis (teste em navegador)
- [ ] Console (F12) não tem erros JavaScript
- [ ] Testou em tela cheia (não mobile)
- [ ] Reiniciou `npm start` após alterar `.env.local`

---

## 🆘 Ainda Não Funciona?

1. **Abra o Console (F12)**
   - Vá para **Console** tab
   - Copie a mensagem de erro **completa**

2. **Abra o Supabase SQL Editor**
   - Execute uma query simples para confirmar conexão
   - Copie o resultado

3. **Verifique Network Tab (F12)**
   - Vá para **Network** tab
   - Procure por requests ao Supabase
   - Veja se retornam 200 OK ou erro

4. **Compartilhe essas informações:**
   - Mensagem de erro completa
   - Linha exata do arquivo
   - Último log do console
   - Se possível, screenshot

---

**Versão**: 1.0.0  
**Última atualização**: 2026-06-11
