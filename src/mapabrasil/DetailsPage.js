import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// DetailsPage está usando os dados cadastrados no arquivo locations.js. Formato JSON
import { hardRockLocations } from './locations';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bar = hardRockLocations.find(l => l.id === id);

  if (!bar) return <h2>Local não encontrado.</h2>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <button onClick={() => navigate('/')}>← Voltar ao Mapa</button>
      <hr />
      <h1>{bar.name}</h1>
      <p><strong>Cidade:</strong> {bar.city}</p>
      <p><strong>Bairro:</strong> {bar.neighborhood}</p>
      <div style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Curiosidade:</h3>
        <p>{bar.funFact}</p>
      </div>
      <p><small>Coordenadas: {bar.lat}, {bar.lng}</small></p>
    </div>
  );
};

export default DetailsPage;