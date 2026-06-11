//instalação de dependências para o projeto:npm install react-simple-maps d3-geo --legacy-peer-deps
/*
O que essa flag faz?
Ela diz ao npm: "Eu sei que há um descompasso nas versões declaradas, mas pode prosseguir com a instalação e usar o motor de resolução de dependências mais flexível."
*/
// Nota técnica: Mapa interativo com a forma real dos estados do Brasil
// Usando react-leaflet com GeoJSON para renderizar estados brasileiros

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { supabase } from '../../infra/supabase/supabaseClient';
import './Dashboard.css';
import L from 'leaflet'; 

export default function Dashboard() {
  // Estados de Localização e Navegação
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1400);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  
  // Estados de Dados da Tabela e Agrupados
  const [tableData, setTableData] = useState([]);
  const [municipioData, setMunicipioData] = useState([]);
  const [selectedNucleo, setSelectedNucleo] = useState(null);
  
  // Estados de Controle de Interface/Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState('all');
  const [municipioFilter, setMunicipioFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1400);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carregar GeoJSON dos estados
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const url = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/br-states-geojson.json` : '/br-states-geojson.json';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setGeoJsonData(data);
        }
      } catch (err) {
        console.error('Erro ao carregar GeoJSON:', err);
      }
    };
    loadGeoJSON();
  }, []);

  // 1. Busca disparada ao passar o mouse sobre o Estado (Hover) - SEM alterar estado de seleção
  const handleStateHover = async (estadoSigla) => {
    if (!estadoSigla) return;
    
    try {
      setError(null);
      const { data, error: dbError } = await supabase
        .from('Lancamento_Nucleo_Extensao')
        .select('regional, instituicao_ensino, nome_nucleo_extensao, publico_impactado')
        .eq('estado', estadoSigla);

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        // Remove valores nulos/vazios antes de processar
        const validData = data.filter(item => item.regional || item.instituicao_ensino);
        
        if (validData.length === 0) {
          setHoveredData({
            estado: estadoSigla,
            regional: 'Sem registros',
            totalIes: 0,
            totalNucleos: 0,
            totalPublico: 0
          });
          return;
        }

        const regional = validData[0].regional || 'Não Informada';
        const totalIes = new Set(validData.map(item => item.instituicao_ensino).filter(Boolean)).size;
        const totalNucleos = new Set(validData.map(item => item.nome_nucleo_extensao).filter(Boolean)).size;
        const totalPublico = validData.reduce((acc, curr) => acc + (parseInt(curr.publico_impactado) || 0), 0);

        setHoveredData({
          estado: estadoSigla,
          regional,
          totalIes,
          totalNucleos,
          totalPublico
        });
      } else {
        setHoveredData({
          estado: estadoSigla,
          regional: 'Sem registros',
          totalIes: 0,
          totalNucleos: 0,
          totalPublico: 0
        });
      }
    } catch (err) {
      console.error("Erro ao buscar dados agregados do estado:", err.message);
      setError("Erro ao carregar dados do estado");
    }
  };

  const handleStateLeave = () => {
    setHoveredData(null);
  };

  // 2. Carrega lista de unidades do estado (quando clica em instituições)
  const fetchStateData = async (estado) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: dbError } = await supabase
        .from('Lancamento_Nucleo_Extensao')
        .select('*')
        .eq('estado', estado)
        .order('instituicao_ensino', { ascending: true });

      if (dbError) throw dbError;
      setTableData(data || []);
    } catch (err) {
      console.error("Erro ao popular tabela do estado:", err.message);
      setError("Erro ao carregar dados da tabela");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Usa tableData quando showFilters está ativo
  useEffect(() => {
    if (selectedState && showFilters) {
      fetchStateData(selectedState);
    }
  }, [selectedState, showFilters]);

  // 4. Clique no Estado / Município - com lógica diferenciada por tamanho de tela
  const handleGeographyClick = async (geo) => {
    const siglaEstado = geo.properties?.sigla || geo.properties?.SIGLA;
    if (!siglaEstado) return;
    
    if (selectedState === siglaEstado) {
      setSelectedState(null);
      setTableData([]);
      setShowFilters(false);
    } else {
      setSelectedState(siglaEstado);
      setShowFilters(true);
      await fetchStateData(siglaEstado);
    }
  };

  // Memoizações para filtros e dados agregados
  const uniqueIes = useMemo(() => {
    return [...new Set(tableData.map(item => item.instituicao_ensino).filter(Boolean))];
  }, [tableData]);

  const filteredTableData = useMemo(() => {
    if (!selectedState) return [];
    
    let filtered = tableData;
    
    if (selectedUnidade && selectedUnidade !== 'all') {
      filtered = filtered.filter(item => item.instituicao_ensino === selectedUnidade);
    }
    
    return filtered;
  }, [tableData, selectedUnidade, selectedState]);

  const municipioMetrics = useMemo(() => {
    if (municipioData.length === 0) return { ies: 0, nucleos: 0, publico: 0 };
    
    const ies = new Set(municipioData.map(item => item.instituicao_ensino).filter(Boolean)).size;
    const nucleos = new Set(municipioData.map(item => item.nome_nucleo_extensao).filter(Boolean)).size;
    const publico = municipioData.reduce((acc, curr) => acc + (parseInt(curr.publico_impactado) || 0), 0);
    
    return { ies, nucleos, publico };
  }, [municipioData]);

  const filteredMunicipioData = useMemo(() => {
    if (!selectedMunicipio) return [];
    if (municipioFilter === 'all') return municipioData;
    return municipioData.filter(item => item.instituicao_ensino === municipioFilter);
  }, [municipioData, selectedMunicipio, municipioFilter]);

  const uniqueIesInMunicipio = useMemo(() => {
    return [...new Set(municipioData.map(item => item.instituicao_ensino).filter(Boolean))];
  }, [municipioData]);

  return (
    <div style={{ backgroundColor: 'var(--bg-corporate)', minHeight: '100vh' }}>
      <header className="dashboard-header">
        <div>
          <h1>Portal Executivo: Núcleos de Extensão Brasil</h1>
          <span style={{color: 'var(--estacio-cyan)', fontSize: '0.9rem'}}>Dados Estratégicos Regiões e Unidades</span>
        </div>
        <div className="badge-gestao">ALTA GESTÃO</div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{marginLeft: '1rem', cursor: 'pointer'}}>✕ Descartar</button>
        </div>
      )}

      <main className="dashboard-container">
        {/* Coluna Esquerda: Mapa Interativo e Tabelas */}
        <section>
          <div className="map-card">
            <div className="map-instructions">
              {isLargeScreen 
                ? "💡 Tela Expandida ativa: Clique sobre uma região para detalhar por Município." 
                : "Passe o mouse sobre os estados para ver indicadores rápidos da regional."}
            </div>

            {/* Mapa Interativo dos Estados Brasileiros com React-Leaflet */}
            <div className="svg-map-wrapper" style={{ height: '520px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <MapContainer 
                center={[-14.2350, -51.9253]} 
                zoom={4} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                  {/* Visual dos itens do mapa */}
                 {geoJsonData && (
                        <GeoJSON 
                            data={geoJsonData}
                            // 1. Intercepta os dados locais e os renderiza como círculos elegantes em vez de retângulos
                            pointToLayer={(feature, latlng) => {
                            const sigla = feature.properties?.sigla;
                            const isSelected = selectedState === sigla;

                            return L.circleMarker(latlng, {
                                radius: isSelected ? 12 : 8,                  // Aumenta o tamanho se estiver selecionado
                                fillColor: isSelected ? '#00A3E0' : '#002F6C', // Azul claro se selecionado, Azul escuro corporativo se padrão
                                color: '#00C4D5',                             // Borda em Ciano para excelente contraste e acabamento
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 0.9
                            });
                            }}
                            // 2. Calcula o centro geográfico do quadrado para plotar a bola no meio do estado
                            coordsToLatLng={(coords) => {
                            // Se receber a estrutura de polígono do quadrado, calcula o ponto médio (centroide)
                            if (Array.isArray(coords) && coords.length >= 4) {
                                const lats = coords.map(c => c[1]);
                                const lngs = coords.map(c => c[0]);
                                const minLat = Math.min(...lats);
                                const maxLat = Math.max(...lats);
                                const minLng = Math.min(...lngs);
                                const maxLng = Math.max(...lngs);
                                
                                return L.latLng((minLat + maxLat) / 2, (minLng + maxLng) / 2);
                            }
                            return L.latLng(coords[1], coords[0]);
                            }}
                            onEachFeature={(feature, layer) => {
                            const sigla = feature.properties?.sigla;
                            
                            layer.on('mouseenter', () => {
                                if (layer.setStyle) {
                                layer.setStyle({
                                    fillColor: '#00A3E0', // Destaca em azul claro ao passar o mouse
                                    radius: 11
                                });
                                }
                                handleStateHover(sigla);
                            });
                            
                            layer.on('mouseleave', () => {
                                const isSelected = selectedState === sigla;
                                if (layer.setStyle) {
                                layer.setStyle({
                                    fillColor: isSelected ? '#00A3E0' : '#002F6C',
                                    radius: isSelected ? 12 : 8
                                });
                                }
                                handleStateLeave();
                            });
                            
                            layer.on('click', () => {
                                handleGeographyClick(feature);
                            });
                            }}
                        />
                        )}



              </MapContainer>
            </div>

            {/* Painel de Indicadores Flutuantes (Hover Ativo) */}
            {hoveredData && !selectedMunicipio && (
              <div className="metrics-overlay" style={{ marginTop: '1.5rem' }}>
                <h3>Estado: {hoveredData.estado}</h3>
                <div className="regional-label">Regional: {hoveredData.regional}</div>
                
                {hoveredData.totalIes > 0 ? (
                  <>
                    <div className="metric-row clickable-metric" onClick={() => {
                      setSelectedState(hoveredData.estado);
                      setShowFilters(true);
                    }}>
                      <span className="metric-label">Instituições de Ensino ▾</span>
                      <span className="metric-value">{hoveredData.totalIes}</span>
                    </div>

                    <div className="metric-row">
                      <span className="metric-label">Núcleos de Extensão</span>
                      <span className="metric-value">{hoveredData.totalNucleos}</span>
                    </div>

                    <div className="metric-row">
                      <span className="metric-label">Público Impactado</span>
                      <span className="metric-value" style={{color: 'var(--estacio-cyan)'}}>{hoveredData.totalPublico}</span>
                    </div>
                  </>
                ) : (
                  <div style={{padding: '1rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                    <p>Sem dados disponíveis para este estado</p>
                  </div>
                )}
              </div>
            )}

            {/* Painel de Filtros de Instituições */}
            {showFilters && selectedState && !selectedMunicipio && (
              <div className="filter-section" style={{ marginTop: '1.5rem' }}>
                <div className="filter-group">
                  <label>Filtrar por Instituição de Ensino</label>
                  <select 
                    className="filter-control" 
                    value={selectedUnidade} 
                    onChange={(e) => setSelectedUnidade(e.target.value)}
                  >
                    <option value="all">Todas as Unidades</option>
                    {uniqueIes.map((ies, i) => (
                      <option key={i} value={ies}>{ies}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Tabela de Visão Analítica - Estado */}
          {selectedState && !selectedMunicipio && (
            <div className="table-container">
              <h3 className="table-title">
                Visão Analítica da Direção de Ensino: Estado {selectedState}
                {selectedUnidade !== 'all' && ` - ${selectedUnidade}`}
                ({filteredTableData.length} registros)
              </h3>
              
              {loading ? (
                <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                  <p>Carregando dados...</p>
                </div>
              ) : filteredTableData.length > 0 ? (
                <table className="corporate-table">
                  <thead>
                    <tr>
                      <th>Instituição</th>
                      <th>Município</th>
                      <th>Curso</th>
                      <th>Núcleo de Extensão</th>
                      <th>Público Impactado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTableData.map((row) => (
                      <tr key={row.id}>
                        <td><strong>{row.instituicao_ensino || '-'}</strong></td>
                        <td>{row.municipio || '-'}</td>
                        <td>{row.curso || '-'}</td>
                        <td>{row.nome_nucleo_extensao || '-'}</td>
                        <td>{row.publico_impactado || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                  <p>Nenhum dado encontrado para os filtros selecionados</p>
                </div>
              )}
            </div>
          )}

          {/* Tabela de Município */}
          {selectedMunicipio && (
            <div className="table-container">
              <h3 className="table-title">
                Município: {selectedMunicipio}
                {municipioFilter !== 'all' && ` - ${municipioFilter}`}
                ({filteredMunicipioData.length} registros)
              </h3>
              
              {loading ? (
                <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                  <p>Carregando dados...</p>
                </div>
              ) : filteredMunicipioData.length > 0 ? (
                <table className="corporate-table">
                  <thead>
                    <tr>
                      <th>Instituição</th>
                      <th>Curso</th>
                      <th>Núcleo de Extensão</th>
                      <th>Professor</th>
                      <th>Público Impactado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMunicipioData.map((row) => (
                      <tr key={row.id} style={{cursor: 'pointer'}} onClick={() => setSelectedNucleo(row)}>
                        <td><strong>{row.instituicao_ensino || '-'}</strong></td>
                        <td>{row.curso || '-'}</td>
                        <td>{row.nome_nucleo_extensao || '-'}</td>
                        <td>{row.professor_orientador || '-'}</td>
                        <td>{row.publico_impactado || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                  <p>Nenhum dado encontrado para este município</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Coluna Direita: Detalhes do Município / Projetos */}
        <section>
          {selectedMunicipio ? (
            <div className="details-sidebar">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h3 style={{color: 'var(--estacio-blue-dark)', margin: 0}}>Município: {selectedMunicipio}</h3>
                <button 
                  onClick={() => {
                    setSelectedMunicipio(null);
                    setSelectedNucleo(null);
                    setMunicipioData([]);
                    setMunicipioFilter('all');
                  }}
                  style={{background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)'}}
                >
                  ✕
                </button>
              </div>

              <div style={{padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '1.5rem'}}>
                <div className="mini-metric-row">
                  <span>Instituições:</span>
                  <strong style={{color: 'var(--estacio-blue-dark)'}}>{municipioMetrics.ies}</strong>
                </div>
                <div className="mini-metric-row">
                  <span>Núcleos:</span>
                  <strong style={{color: 'var(--estacio-blue-dark)'}}>{municipioMetrics.nucleos}</strong>
                </div>
                <div className="mini-metric-row">
                  <span>Público Impactado:</span>
                  <strong style={{color: 'var(--estacio-cyan)'}}>{municipioMetrics.publico}</strong>
                </div>
              </div>
              
              <div className="filter-group" style={{marginBottom: '1.5rem'}}>
                <label>Filtro de Exibição Local</label>
                <select 
                  className="filter-control"
                  value={municipioFilter}
                  onChange={(e) => setMunicipioFilter(e.target.value)}
                >
                  <option value="all">Todas as Instituições</option>
                  {uniqueIesInMunicipio.map((ies, i) => (
                    <option key={i} value={ies}>{ies}</option>
                  ))}
                </select>
              </div>

              <div className="details-grid">
                <h4 style={{fontSize:'0.8rem', color:'var(--text-muted)', margin:0, marginBottom: '0.5rem'}}>Clique em um núcleo para ver detalhes:</h4>
                {filteredMunicipioData.map((item) => (
                  <div 
                    key={item.id} 
                    className="clickable-metric" 
                    style={{
                      padding: '0.8rem', 
                      border: selectedNucleo?.id === item.id ? '2px solid var(--estacio-blue-dark)' : '1px solid #e2e8f0', 
                      backgroundColor: selectedNucleo?.id === item.id ? '#f0f7ff' : '#ffffff',
                      borderRadius: '4px', 
                      marginBottom: '0.5rem'
                    }}
                    onClick={() => setSelectedNucleo(item)}
                  >
                    <div style={{fontWeight: 'bold', color: 'var(--estacio-blue-light)', fontSize: '0.95rem'}}>{item.nome_nucleo_extensao}</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{item.instituicao_ensino}</div>
                  </div>
                ))}
              </div>

              {selectedNucleo && (
                <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px dashed #cbd5e1'}}>
                  <h4 style={{color:'var(--estacio-cyan)', margin:'0 0 1rem 0'}}>📋 Dossiê do Projeto Técnico</h4>
                  
                  <div className="detail-block" style={{marginBottom: '1rem'}}>
                    <h4>Descrição do Projeto</h4>
                    <p>{selectedNucleo.descricao_projeto || 'Sem descrição'}</p>
                  </div>

                  <div className="detail-block" style={{marginBottom: '1rem'}}>
                    <h4>Professor Orientador</h4>
                    <p><strong>{selectedNucleo.professor_orientador || 'Não informado'}</strong></p>
                  </div>

                  <div className="detail-block" style={{marginBottom: '1rem'}}>
                    <h4>Impactos Sociais</h4>
                    <p>{selectedNucleo.impactos_sociais || 'Não informado'}</p>
                  </div>

                  <div className="detail-block" style={{marginBottom: '1rem'}}>
                    <h4>Público Alvo / Impactado</h4>
                    <p>
                      <span>{selectedNucleo.publico_alvo || 'Não informado'}</span>
                      <br/>
                      <strong style={{color: 'var(--estacio-cyan)'}}>Total: {selectedNucleo.publico_impactado || '0'} pessoas</strong>
                    </p>
                  </div>

                  {/* CORREÇÃO DO BUG DA IMAGEM QUADRADA CINZA: Validação estrita contra URLs quebradas do banco */}
                  <div className="detail-block">
                    <h4>📸 Evidências de Campo (Fotos)</h4>
                    <div className="evidence-gallery">
                      {selectedNucleo.evidencia01_foto && selectedNucleo.evidencia01_foto.startsWith('http') && (
                        <img src={selectedNucleo.evidencia01_foto} alt="Evidência 1" className="evidence-thumb" onError={(e) => e.target.style.display='none'} />
                      )}
                      {selectedNucleo.evidencia02_foto && selectedNucleo.evidencia02_foto.startsWith('http') && (
                        <img src={selectedNucleo.evidencia02_foto} alt="Evidência 2" className="evidence-thumb" onError={(e) => e.target.style.display='none'} />
                      )}
                      {selectedNucleo.evidencia03_foto && selectedNucleo.evidencia03_foto.startsWith('http') && (
                        <img src={selectedNucleo.evidencia03_foto} alt="Evidência 3" className="evidence-thumb" onError={(e) => e.target.style.display='none'} />
                      )}
                      {(!selectedNucleo.evidencia01_foto || !selectedNucleo.evidencia01_foto.startsWith('http')) && 
                       (!selectedNucleo.evidencia02_foto || !selectedNucleo.evidencia02_foto.startsWith('http')) && 
                       (!selectedNucleo.evidencia03_foto || !selectedNucleo.evidencia03_foto.startsWith('http')) && (
                        <p style={{color: 'var(--text-muted)', gridColumn: '1 / -1'}}>Sem evidências registradas</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="details-sidebar" style={{textAlign: 'center', color: 'var(--text-muted)', borderTop: '4px solid #cbd5e1'}}>
              <p>Passe o mouse ou clique nas regiões geográficas do mapa para carregar o painel analítico.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}