// Para usar os dados do banco de dados precisaremos alterar o local da busca dos dados.
//import { hardRockLocations } from './locations';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailsPage = () => {
  const { id } = useParams(); // Pega o ID da URL (ex: 'curitiba')
  const navigate = useNavigate();
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscamos a lista completa do backend e filtramos pelo ID
    // Em sistemas maiores, criaríamos uma rota específica: /api/locations/:id
    fetch('http://localhost:3001/api/locations')
      .then(response => response.json())
      .then(data => {
        const selectedBar = data.find(item => item.id === id);
        setBar(selectedBar);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar detalhes:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: '20px' }}>Carregando dados do acervo...</div>;

  if (!bar) return (
    <div style={{ padding: '20px' }}>
      <h2>Local não encontrado no banco de dados.</h2>
      <button onClick={() => navigate('/mapa')}>Voltar ao Mapa</button>
    </div>
  );

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <button 
        onClick={() => navigate('/mapa')} 
        style={{ marginBottom: '20px', cursor: 'pointer' }}
      >
        ← Voltar ao Mapa
      </button>
      
      <hr />
      
      <header style={{ marginTop: '20px' }}>
        <h1>{bar.name}</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          <strong>📍 Localização:</strong> {bar.city} - {bar.neighborhood}
        </p>
      </header>

      <div style={{ 
        backgroundColor: '#f9f9f9', 
        borderLeft: '5px solid #ff0000', 
        padding: '20px', 
        borderRadius: '4px', 
        marginTop: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>Curiosidade da Cidade:</h3>
        <p style={{ lineHeight: '1.6' }}>{bar.funFact}</p>
      </div>

      <footer style={{ marginTop: '40px', color: '#888', fontSize: '0.8rem' }}>
        <p>Dados técnicos (SQLite): Lat {bar.lat} / Lng {bar.lng}</p>
      </footer>
    </div>
  );
};

export default DetailsPage;