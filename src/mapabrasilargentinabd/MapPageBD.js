/*
  3. Atenção ao Frontend (React)
Não se esqueça que o seu Mapa no React também precisa de pacotes específicos para desenhar o Brasil na tela. Caso ainda não tenha instalado na raiz do projeto (ou na pasta do front), execute:

Bash
npm install react-leaflet leaflet react-router-dom
*/
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

export default function MapPageBD() {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Conexão com o backend via rede (HTTP)
    fetch('http://localhost:3001/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data));
  }, []);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer center={[-25, -50]} zoom={5} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map(loc => (
          <CircleMarker 
            key={loc.id} 
            center={[loc.lat, loc.lng]} 
            radius={15}
            eventHandlers={{ click: () => navigate(`/detailsbd/${loc.id}`) }}
          >
            <Tooltip>{loc.name}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}