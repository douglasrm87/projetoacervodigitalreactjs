import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { supabase } from '../../infra/supabase/supabaseClient';
import 'leaflet/dist/leaflet.css';
import { Tooltip } from 'react-leaflet';

// ✅ POSIÇÃO REAL DOS ESTADOS (CENTRO APROXIMADO)
const estados = [
  { sigla: "AC", lat: -8.77, lng: -70.55 },
  { sigla: "AL", lat: -9.71, lng: -35.73 },
  { sigla: "AM", lat: -3.07, lng: -61.66 },
  { sigla: "AP", lat: 1.41, lng: -51.77 },
  { sigla: "BA", lat: -12.96, lng: -38.51 },
  { sigla: "CE", lat: -3.71, lng: -38.54 },
  { sigla: "DF", lat: -15.83, lng: -47.86 },
  { sigla: "ES", lat: -19.19, lng: -40.34 },
  //{ sigla: "GO", lat: -16.64, lng: -49.31 },
  { sigla: "GO", lat: -17.50, lng: -52.00 },
  { sigla: "MA", lat: -2.55, lng: -44.30 },
  { sigla: "MT", lat: -12.64, lng: -55.42 },
  { sigla: "MS", lat: -20.51, lng: -54.54 },
  { sigla: "MG", lat: -18.10, lng: -44.38 },
  { sigla: "PA", lat: -5.35, lng: -49.33 },
  { sigla: "PB", lat: -7.06, lng: -35.55 },
  { sigla: "PR", lat: -24.89, lng: -51.55 },
  { sigla: "PE", lat: -8.28, lng: -35.07 },
  { sigla: "PI", lat: -8.28, lng: -43.68 },
  { sigla: "RJ", lat: -22.90, lng: -43.20 },
  { sigla: "RN", lat: -5.81, lng: -36.59 },
  { sigla: "RO", lat: -10.83, lng: -63.34 },
  { sigla: "RO", lat: -10.83, lng: -63.34 },
  { sigla: "RR", lat: 1.99, lng: -61.33 },
  { sigla: "RS", lat: -30.01, lng: -51.22 },
  { sigla: "SC", lat: -27.33, lng: -49.44 },
  { sigla: "SE", lat: -10.90, lng: -37.07 },
  { sigla: "SP", lat: -23.55, lng: -46.63 },
  { sigla: "TO", lat: -10.25, lng: -48.25 }
];

export default function MapBrasil({ onHover, onClickState }) {

  // ✅ HOVER
  const handleHover = async (sigla) => {
    try {
      const { data } = await supabase
        .from('Lancamento_Nucleo_Extensao')
        .select('regional, instituicao_ensino, nome_nucleo_extensao, publico_impactado')
        .eq('estado', sigla);

      if (!data || data.length === 0) {
        onHover(null);
        return;
      }

      const regional = data[0]?.regional || 'N/D';

      const totalIes = new Set(data.map(i => i.instituicao_ensino)).size;
      const totalNucleos = new Set(data.map(i => i.nome_nucleo_extensao)).size;
      const totalPublico = data.reduce(
        (acc, cur) => acc + (parseInt(cur.publico_impactado) || 0),
        0
      );
      //console.log ("Quantidade de Ies: " + totalIes);
      //console.log ("Quantidade de Núcleos: " + totalNucleos);
      //console.log ("Quantidade de Público Impactado: " + totalPublico);

      onHover({
        estado: sigla,
        regional,
        ies: totalIes,
        nucleos: totalNucleos,
        publico: totalPublico
      });

    } catch (e) {
      console.error(e);
    }
  };

  // ✅ CLICK
  const handleClick = async (sigla) => {
    const { data } = await supabase
      .from('Lancamento_Nucleo_Extensao')
      .select('*')
      .eq('estado', sigla)
      .order('instituicao_ensino', { ascending: false })
      .order('municipio')
      .order('nome_nucleo_extensao');


    onClickState(sigla, data || []);
  };

  return (
    <MapContainer center={[-14.2, -52]} zoom={4} style={{ height: '500px' }}>

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {estados.map((uf, i) => (
        <CircleMarker
                key={i}
                center={[uf.lat, uf.lng]}
                radius={8}
                pathOptions={{
                fillColor: '#002F6C',
                color: '#ffffff',
                weight: 2,
                fillOpacity: 1
            }}
            eventHandlers={{
                mouseover: () => handleHover(uf.sigla),
                click: () => handleClick(uf.sigla)
            }}
        >
            <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={false} // só aparece no hover
            >
            <strong>{uf.sigla}</strong>
            </Tooltip>
        </CircleMarker>
        ))}

    </MapContainer>
  );
}