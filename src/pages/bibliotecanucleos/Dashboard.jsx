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
  const [regional, setRegional] = useState('');
  
  // ✅ sempre que mudar filtro → reseta tela
  useEffect(() => {
    setSelectedState(null);
    setTableData([]);
  }, [regional, nucleo, semestre]);

  const dadosPainel = selectedState
      ? 
          { ...hoverData, regional: selectedState } // ou montar com dados corretos
      : 
          hoverData;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="header">
        <h1>Bem-vindo à nossa Biblioteca Digital</h1>
        <h3>Conheça os projetos extensionistas e explore iniciativas que geram impacto positivo na comunidade</h3>
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

        
      <div className="filtros-container">
        
         {/* Regional */}
        <div className="filtro-item">
          <label>Regional:</label>
          <select value={regional} onChange={(e) => setRegional(e.target.value)}>
            <option value="">Todos</option>
            <option value="NORTE-SUL">NORTE-SUL</option>
            <option value="NORDESTE">NORDESTE</option>
            <option value="SUDESTE">SUDESTE</option>
            <option value="WYDEN">WYDEN</option>
          </select>
        </div>

          {/* Regional */}
        <div className="filtro-item">
          <label>IES:</label>
          <select value={regional} onChange={(e) => setRegional(e.target.value)}>
            <option value="">Todos</option>
            <option value="FACULDADE ESTACIO DO PARA">FACULDADE ESTACIO DO PARA</option>
            <option value="FACULDADE ESTACIO DO AMAPA">FACULDADE ESTACIO DO AMAPA</option>
            <option value="FACULDADE ESTACIO DE CURITIBA">FACULDADE ESTACIO DE CURITIBA</option>
            <option value="FACULDADE ESTACIO DE CASTANHAL">FACULDADE ESTACIO DE CASTANHAL</option>
          </select>
        </div>

        {/* Núcleo */}
        <div className="filtro-item">
          <label>Núcleo:</label>
          <select value={nucleo} onChange={(e) => setNucleo(e.target.value)}>
            <option value="">Todos</option>
            <option value="Escritório Experimental de Design, Design Gráfico e PP">Escritório Experimental de Design, Design Gráfico e PP </option>
            <option value="Agência Experimental de Cinema e Audiovisual">Agência Experimental de Cinema e Audiovisual</option>
            <option value="Brinquedoteca">Brinquedoteca</option>
            <option value="Laboratório de Praticas de Gestão">Laboratório de Praticas de Gestão</option>
            <option value="Laboratório de Transformação Digital">Laboratório de Transformação Digital</option>
            <option value="Habitação e Escritório Modelo">Habitação e Escritório Modelo</option>
            <option value="Escritório Modelo de Inovação & Empreendedorismo na Engenharia">Escritório Modelo de Inovação & Empreendedorismo na Engenharia</option>
            <option value="Centro de Moda">Centro de Moda</option>
            <option value="Agência Experimental de Jornalismo">Agência Experimental de Jornalismo</option>
            <option value="Garfo - Centro Gastronômico">Garfo - Centro Gastronômico</option>
          </select>
        </div>

        {/* Semestre */}
        <div className="filtro-item">
          <label>Semestre:</label>
          <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
            <option value="">Todos</option>
            <option value="2026-01">2026-01</option>
            <option value="2026-02">2026-02</option>
            <option value="2027-01">2027-01</option>
            <option value="2027-02">2027-02</option>
            <option value="2028-01">2028-01</option>
            <option value="2028-02">2028-02</option>
          </select>
        </div>

      </div>


        {/* Botão limpar */}
        <button className="btn-limpar"
          onClick={() => {
            setNucleo('');
            setSemestre('');
            setRegional('');
          }}
          style={{ height: '30px' }}
        >
          Limpar
        </button>
      </div>


      <main className="dashboard-grid">

        <div className="map-area">
          <MapBrasil
                      
            onHover={(data) => {
              // ✅ Se já tem seleção, NÃO mexe
              if (selectedState) return;

              setHoverData(data);
            }}

              nucleoFiltro={nucleo}                 // ✅ PASSANDO FILTRO
              semestreFiltro={semestre}            // ✅ PASSANDO FILTRO
              regionalFiltro={regional}

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
        <div className="panel-area">
          <InfoPainel data={dadosPainel} />
          {selectedState && (
              <div className="right-panel" ref={tabelaRef}>
                <TabelaUnidades
                  estado={selectedState}
                  data={tableData}
                />
              </div>
          )}
        </div>
      </main>
    </div>
  );
}