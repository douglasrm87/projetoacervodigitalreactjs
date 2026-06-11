import React, { useState } from 'react';
import MapBrasil from './MapBrasil';
import InfoPainel from './InfoPainel';
import TabelaUnidades from './TabelaUnidades';
import './dashboard.css';

export default function Dashboard() {

  const [hoverData, setHoverData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [tableData, setTableData] = useState([]);

  return (
    <div className="dashboard">

      <header className="header">
        <h1>Portal Executivo - Núcleos de Extensão</h1>
        <span>Visão Estratégica - Estácio</span>
      </header>

      <main className="main">

        <div className="map-section">
          <MapBrasil
            onHover={setHoverData}
            onClickState={(state, data) => {
              setSelectedState(state);
              setTableData(data);
            }}
          />
        </div>

        <div className="details-section">
          <InfoPainel data={hoverData} />
        </div>

      </main>

      {selectedState && (
        <TabelaUnidades
          estado={selectedState}
          data={tableData}
        />
      )}

    </div>
  );
}