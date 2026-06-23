import React, { useState , useRef } from 'react';
import MapBrasil from './MapBrasil';
import InfoPainel from './InfoPainel';
import TabelaUnidades from './TabelaUnidades';
import './dashboard.css';
import { useEffect } from 'react';
export default function Dashboard() {

  const [hoverData, setHoverData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [tableData, setTableData] = useState([]);

  const tabelaRef = useRef (null);
  const scrollLock = useRef(false);

    // ✅ FILTROS
  const [nucleo, setNucleo] = useState('');
  const [semestre, setSemestre] = useState('');
  
  
  // ✅ sempre que mudar filtro → reseta tela
  useEffect(() => {
    setSelectedState(null);
    setTableData([]);
  }, [nucleo, semestre]);


  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="header">
        <h1>Portal Executivo - Núcleos de Extensão</h1>
        <span>Visão Estratégica - Estácio</span>
      </header>


      <p> </p>
      {/* ✅ FILTROS */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          alignItems: 'center'
        }}
      >

        {/* Núcleo */}
        <div>
          <label>Núcleo:</label><br />
          <select value={nucleo} onChange={(e) => setNucleo(e.target.value)}>
            <option value="">Todos</option>
            <option value="Brinquedoteca">Brinquedoteca</option>
            <option value="LPG">LPG</option>
            <option value="LTD">LTD</option>
            <option value="Centro de Moda">Centro de Moda</option>
            <option value="EMI&EEngenharia">EMI&EEngenharia</option>
          </select>
        </div>

        {/* Semestre */}
        <div>
          <label>Semestre:</label><br />
          <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
            <option value="">Todos</option>
            <option value="2026-01">2026-01</option>
            <option value="2026-02">2026-02</option>
            <option value="2027-01">2027-01</option>
            <option value="2027-02">2027-02</option>
            <option value="2028-01">2028-01</option>
            <option value="2028-01">2028-02</option>
          </select>
        </div>

        {/* Botão limpar */}
        <button className="btn-limpar"
          onClick={() => {
            setNucleo('');
            setSemestre('');
          }}
          style={{ height: '30px' }}
        >
          Limpar
        </button>
      </div>


      <main className="main">

        <div className="map-section">
          <MapBrasil
            onHover={setHoverData}
            nucleoFiltro={nucleo}                 // ✅ PASSANDO FILTRO
            semestreFiltro={semestre}            // ✅ PASSANDO FILTRO

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
        <div className="right-panel">
          <InfoPainel data={hoverData} />
        </div>

      </main>

      {selectedState && (
       
          <div className="right-panel" ref={tabelaRef}>
            <TabelaUnidades
              estado={selectedState}
              data={tableData}
            />
          </div>
      )}

    </div>
  );
}