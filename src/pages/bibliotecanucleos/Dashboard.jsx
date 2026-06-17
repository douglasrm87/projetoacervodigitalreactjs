import React, { useState , useRef } from 'react';
import MapBrasil from './MapBrasil';
import InfoPainel from './InfoPainel';
import TabelaUnidades from './TabelaUnidades';
import './dashboard.module.css';

export default function Dashboard() {

  const [hoverData, setHoverData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [tableData, setTableData] = useState([]);

  const tabelaRef = useRef (null);
  const scrollLock = useRef(false);

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


              // ✅ evita múltiplos scrolls
                 
                  if (!scrollLock.current) {
                    scrollLock.current = true;

                    setTimeout(() => {
                      tabelaRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                      });

                      setTimeout(() => {
                        scrollLock.current = false;
                      }, 1000);
                    }, 150);
                  }


            }}
          />
        </div>
        {/* painel ao lado do mapa */}
        <div className="details-section">
          <InfoPainel data={hoverData} />
        </div>

      </main>

      {selectedState && (
       
          <div ref={tabelaRef}>
            <TabelaUnidades
              estado={selectedState}
              data={tableData}
            />
          </div>
      )}

    </div>
  );
}