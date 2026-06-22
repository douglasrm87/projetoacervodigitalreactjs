import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { supabase } from '../../infra/supabase/supabaseClient';
import 'leaflet/dist/leaflet.css';
import { Tooltip } from 'react-leaflet';

// ✅ POSIÇÃO REAL DOS ESTADOS (CENTRO APROXIMADO)
const estados = [
  { sigla: "WYDEN", lat: -15.96, lng: -45.51 },
  { sigla: "NORDESTE", lat: -8.28, lng: -40.07 },
  { sigla: "NORTE-SUL", lat: -8.28, lng: -53.68 },
  { sigla: "SUDESTE", lat: -23.33, lng: -50 }
  
];

const cidades = [
  { sigla: "CURITIBA", lat: -25.4439, lng: -49.2816 },
  { sigla: "FLORIANOPOLIS", lat: -27.5935, lng: -48.5585 },
  { sigla: "FORTALEZA", lat: -3.7328, lng: -38.5269 },
  { sigla: "RIO DE JANEIRO", lat: -22.9083, lng:  -43.1964 },
  { sigla: "BELO HORIZONTE", lat: -19.9167, lng:  -43.9333 },
  { sigla: "RIO BRANCO", lat: -9.5829, lng:  -67.4836 },
  { sigla: "MANAUS", lat: -3.0607, lng:  -60.0130 },
  // SÃO PAULO e região
  { sigla: "SAO PAULO", lat: -23.33, lng: -46.38 },
  { sigla: "CAMPINAS", lat: -22.9056, lng: -47.0608 },
  { sigla: "SANTOS", lat: -23.9608, lng: -46.3336 },
  // SUL
  { sigla: "PORTO ALEGRE", lat: -30.0346, lng: -51.2177 },
  { sigla: "CAXIAS DO SUL", lat: -29.1678, lng: -51.1794 },
  { sigla: "JOINVILLE", lat: -26.3044, lng: -48.8487 },
  { sigla: "LONDRINA", lat: -23.3045, lng: -51.1696 },
    // Sudeste
  { sigla: "VITORIA", lat: -20.3155, lng: -40.3128 },
  { sigla: "VILA VELHA", lat: -20.3297, lng: -40.2925 },
  { sigla: "UBERLANDIA", lat: -18.9113, lng: -48.2622 },
   // Centro-Oeste
  { sigla: "BRASILIA", lat: -15.7939, lng: -47.8828 },
  { sigla: "GOIANIA", lat: -16.6869, lng: -49.2648 },
  { sigla: "CUIABA", lat: -15.6014, lng: -56.0979 },
  { sigla: "CAMPO GRANDE", lat: -20.4697, lng: -54.6201 },
 // Nordeste
  { sigla: "SALVADOR", lat: -12.9777, lng: -38.5016 },
  { sigla: "RECIFE", lat: -8.0476, lng: -34.8770 },
  { sigla: "NATAL", lat: -5.7945, lng: -35.2110 },
  { sigla: "JOAO PESSOA", lat: -7.1150, lng: -34.8631 },
  { sigla: "MACEIO", lat: -9.6498, lng: -35.7089 },
  { sigla: "ARACAJU", lat: -10.9472, lng: -37.0731 },
  { sigla: "TERESINA", lat: -5.0919, lng: -42.8034 },
  { sigla: "SAO LUIS", lat: -2.5387, lng: -44.2825 },

  // Norte (completo agora ✅)
  { sigla: "BELEM", lat: -1.4558, lng: -48.4902 },
  { sigla: "PORTO VELHO", lat: -8.7608, lng: -63.8999 },
  { sigla: "BOA VISTA", lat: 2.8235, lng: -60.6758 },
  { sigla: "MACAPA", lat: 0.0349, lng: -51.0694 },
  { sigla: "PALMAS", lat: -10.2491, lng: -48.3243 },

  // Cidades adicionais relevantes (Estácio / Wyden)
  { sigla: "DUQUE DE CAXIAS", lat: -22.7856, lng: -43.3117 },
  { sigla: "NITEROI", lat: -22.8832, lng: -43.1034 },
  { sigla: "NOVA IGUACU", lat: -22.7592, lng: -43.4511 },
  { sigla: "FEIRA DE SANTANA", lat: -12.2664, lng: -38.9663 }

];

export default function MapBrasil({ onHover, onClickState,
    nucleoFiltro, 
    semestreFiltro
    }) {

  // ✅ HOVER
  const handleHover = async (sigla) => {
    try {
      const { data } = await supabase
        .from('Lancamento_Nucleo_Extensao')
        .select('municipio, instituicao_ensino, nome_nucleo_extensao, publico_impactado')
        .eq('regional', sigla);

      if (!data || data.length === 0) {
        onHover(null);
        return;
      }

      const municipio = data[0]?.municipio || 'N/D';

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
        regional: sigla,
        municipio,
        ies: totalIes,
        nucleos: totalNucleos,
        publico: totalPublico
      });

    } catch (e) {
      console.error(e);
    }
  };

  // ✅ CLICK
  /*
  const handleClick = async (sigla) => {
    const { data } = await supabase
      .from('Lancamento_Nucleo_Extensao')
      .select('*')
      .eq('regional', sigla)
      .order('instituicao_ensino', { ascending: false })
      .order('municipio')
      .order('nome_nucleo_extensao');


    onClickState(sigla, data || []);
  };*/
  
  // ✅ CLICK (REGIONAL) ✅ COM FILTRO
    const handleClick = async (sigla) => {

      let query = supabase
        .from('Lancamento_Nucleo_Extensao')
        .select('*')
        .eq('regional', sigla);

      // ✅ FILTRO NÚCLEO
      if (nucleoFiltro) {
        query = query.ilike('nome_nucleo_extensao', `%${nucleoFiltro}%`);
      }

      // ✅ FILTRO SEMESTRE
      if (semestreFiltro) {
        query = query.ilike('periodo_realizacao', `%${semestreFiltro}%`);
      }

      const { data } = await query
        .order('instituicao_ensino', { ascending: false })
        .order('municipio')
        .order('nome_nucleo_extensao');

      onClickState(sigla, data || []);
    };


   // ✅ CLICK
  /*const handleClickCidade = async (sigla) => {
    const { data } = await supabase
      .from('Lancamento_Nucleo_Extensao')
      .select('*')
      .eq('municipio', sigla)
      .order('instituicao_ensino', { ascending: false })
      .order('municipio')
      .order('nome_nucleo_extensao');
*/
    // Aqui é feito o envio dos dados ao programa TabelaUnidade.jsx
    /*
      ✔ MapBrasil recebe onClickState
      ✔ Você está chamando onClickState(sigla, data)
      ✔ Existe um componente pai com useState
      ✔ TabelaUnidades recebe data via props
      "Lifting State Up"
        👉 Estado fica no componente pai (programa Dashboard.jsx nesta pasta)
        👉 Filhos apenas:

        enviam eventos
        recebem dados
    */
   /*
    onClickState(sigla, data || []);
  };*/

  
// ✅ CLICK CIDADE ✅ COM FILTRO
  const handleClickCidade = async (sigla) => {

    let query = supabase
      .from('Lancamento_Nucleo_Extensao')
      .select('*')
      .eq('municipio', sigla);

    // ✅ FILTRO NÚCLEO
    if (nucleoFiltro) {
      query = query.ilike('nome_nucleo_extensao', `%${nucleoFiltro}%`);
    }

    // ✅ FILTRO SEMESTRE
    if (semestreFiltro) {
      query = query.ilike('periodo_realizacao', `%${semestreFiltro}%`);
    }

    const { data } = await query
      .order('instituicao_ensino', { ascending: false })
      .order('municipio')
      .order('nome_nucleo_extensao');

    onClickState(sigla, data || []);
  };

  const brasilBounds = [
    [-33.75, -73.99], // sudoeste (RS/Acre)
    [5.27, -34.79]    // nordeste (RR/RN)
  ];

  return (
    
      <MapContainer
            bounds={brasilBounds}
            maxBounds={brasilBounds}
            maxBoundsViscosity={1.0}

            minZoom={4}
            maxZoom={6}

            zoomControl={true}
            scrollWheelZoom={true}

            style={{ height: "500px" }}
          >


      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {estados.map((uf, i) => (
        <CircleMarker
                key={i}
                center={[uf.lat, uf.lng]}
                radius={51}
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
                direction="center"
                offset={[0, -10]}
                opacity={1}
                permanent
            >
            <strong>{uf.sigla}</strong>
            </Tooltip>
        </CircleMarker>
        ))}

        {cidades.map((cidade, i) => (
        <CircleMarker
                key={i}
                center={[cidade.lat, cidade.lng]}
                radius={6}
                pathOptions={{
                fillColor: '#e7146c',
                color: '#ffffff',
                weight: 1,
                fillOpacity: 1
            }}
            eventHandlers={{
                mouseover: () => handleHover(cidade.sigla),
                click: () => handleClickCidade(cidade.sigla)
            }}
        >
            <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={false} // só aparece no hover
            >
            <strong>{cidade.sigla}</strong>
            </Tooltip>
        </CircleMarker>
        ))}

    </MapContainer>
  );
}