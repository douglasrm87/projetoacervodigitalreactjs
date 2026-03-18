/*-- Estrutura da tabela 'locations'
CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT,
    city TEXT,
    neighborhood TEXT,
    lat REAL,
    lng REAL,
    funFact TEXT,
    country TEXT
);

-- Inserindo dados da Argentina
INSERT INTO locations VALUES ('curitiba', 'Hard Rock Cafe Curitiba', 'Curitiba', 'Batel', -25.4439, -49.2816, 'É a maior unidade da marca no Brasil e possui um layout circular único.', 'Brasil');
INSERT INTO locations VALUES ('buenos-aires', 'Hard Rock Cafe Buenos Aires', 'Buenos Aires', 'Puerto Madero', -34.6118, -58.3647, 'Localizado no icônico Puerto Madero, possui uma das maiores coleções de memorabilia da América Latina.', 'Argentina');
INSERT INTO locations VALUES ('ushuaia', 'Hard Rock Cafe Ushuaia', 'Ushuaia', 'Centro', -54.8068, -68.3073, 'É o Hard Rock Cafe mais ao sul do mundo (Fin del Mundo).', 'Argentina');
*/