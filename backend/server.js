
/*
Este é um processo separado que você rodará com node server.js. Ele acessa o SQLite e entrega os dados para o React.
Por que essa separação é necessária?
O React "mora" no navegador do usuário. O Banco de Dados (SQLite) "mora" no servidor (seu computador). Eles estão em "planetas" diferentes. O arquivo server.js (Backend) funciona como a ponte de rádio entre esses dois planetas.

O Backend lê o arquivo .sqlite.
O Backend cria um endereço web (/api/locations).
O React "telefona" para esse endereço usando o fetch.
Dica de mestre: Para rodar, você precisará de dois terminais abertos:
Terminal 1: cd backend && node server.js
Terminal 2: npm start (para o React)

Erro que poderá ser causado pela falta de instalações

code: 'MODULE_NOT_FOUND',
  requireStack: [ '/workspaces/projetoacervodigitalreactjs/backend/server.js' ]

  Como separamos o projeto em Backend e Frontend, você precisa instalar as dependências específicas dentro da pasta backend.

Atenção aqui:

1. Resolvendo o erro no Backend
Abra o seu terminal, navegue até a pasta do servidor e execute a instalação:

Bash
cd /workspaces/projetoacervodigitalreactjs/backend

// Este Comando criará seu package.json com dados iniciais.
npm init -y  # Caso ainda não tenha um package.json nesta pasta

// Instalará os pacotes necessários para usarmos o backend.
npm install express sqlite3 cors

O que cada um faz:
express: O framework que cria as rotas da sua API (o "garçom" que entrega os dados).
sqlite3: O driver que permite ao Node "conversar" com o arquivo do banco de dados.
cors: Segurança básica para permitir que seu React (front) peça dados ao Node (back).

2. Verifique o seu package.json
Após rodar o comando, o arquivo backend/package.json deve listar essas dependências. Ele deve ficar parecido com isto:

JSON
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "sqlite3": "^5.1.7"
  }




}

Atenção rodar novamente
    node server.js
    Visualizará: Backend rodando na porta 3001

Para testar:
  http://localhost:3001/api/locations
  Observará no Browser os dados da tabela Locations, criada no SQLite

Criar um novo terminal e rodar o ambiente WEB com 
  npm start


*/
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que o React (porta 3000) acesse o Node (porta 3001)

const db = new sqlite3.Database('./database.sqlite');

// Criar tabela e inserir dados (Brasil e Argentina)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS locations (id TEXT, name TEXT, city TEXT, neighborhood TEXT, lat REAL, lng REAL, funFact TEXT)");
  
  // Limpa e insere para exemplo
  db.run("DELETE FROM locations");
  const stmt = db.prepare("INSERT INTO locations VALUES (?, ?, ?, ?, ?, ?, ?)");
  stmt.run("curitiba", "Hard Rock Curitiba", "Curitiba", "Batel", -25.4439, -49.2816, "Maior unidade do Brasil.");
  stmt.run("buenos-aires", "Hard Rock Buenos Aires", "Buenos Aires", "Puerto Madero", -34.6118, -58.3647, "Fica no Porto revitalizado.");
  stmt.run("itapema", "Hard Rock Cafe Itapema", "Itapema", "Centro", -27.0916, -48.6101, "Localizado no litoral catarinense, esta unidade destaca-se pela vista para o mar e por estar em uma região conhecida como a Dubai Brasileira devido aos seus arranha-céus.");
  stmt.finalize();
});

app.get('/api/locations', (req, res) => {
  db.all("SELECT * FROM locations", [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3001, () => console.log("Backend rodando na porta 3001"));