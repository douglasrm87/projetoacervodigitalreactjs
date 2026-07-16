import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../../infra/supabase/supabaseClient';


import "./DetalheNucleoExtensao.css";
import { useNavigate } from "react-router-dom";

export default function DetalheNucleoExtensao() {
  //const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [periodos, setPeriodos] = useState([])
  const [selectedPeriodo, setSelectedPeriodo] = useState('')

  const [detalhes, setDetalhes] = useState(null);
  const [detalhesOriginais, setDetalhesOriginais] = useState(null);
  
  useEffect(() => {
  async function carregarPeriodos() {
    const { data, error } = await supabase
      .from("Lancamento_Nucleo_Extensao")
      .select("periodo_realizacao")
      .not("periodo_realizacao", "is", null)
      .order("periodo_realizacao", { ascending: true });

    if (error) {
      console.error("Erro ao carregar períodos:", error);
      return;
    }

    const periodosUnicos = [
      ...new Set(
        data
          .map(item => item.periodo_realizacao)
          .filter(Boolean)
      )
    ];

    setPeriodos(periodosUnicos);
  }

  carregarPeriodos();
}, []);

useEffect(() => {
  async function fetchDetalhesPorId() {
    const { data, error } = await supabase
      .from("Lancamento_Nucleo_Extensao")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setDetalhes(data);
      setDetalhesOriginais(data);
      setSelectedPeriodo(data.periodo_realizacao || '');
    }
  }

  fetchDetalhesPorId();
}, [id]);
  
useEffect(() => {
    if (!detalhesOriginais) return;

    async function carregarPeriodos() {
      const { data, error } = await supabase
        .from("Lancamento_Nucleo_Extensao")
        .select("periodo_realizacao")
        .eq("instituicao_ensino", detalhesOriginais.instituicao_ensino)
        .eq("municipio", detalhesOriginais.municipio)
        .eq("curso", detalhesOriginais.curso)
        .eq("nome_nucleo_extensao", detalhesOriginais.nome_nucleo_extensao);

      if (error) {
        console.error(error);
        return;
      }

      const periodosUnicos = [
        ...new Set(
          data
            ?.map(item => item.periodo_realizacao)
            .filter(Boolean)
        )
      ];

      setPeriodos(periodosUnicos);
    }

    carregarPeriodos();
  }, [detalhesOriginais]);

  useEffect(() => {
    if (!selectedPeriodo || !detalhesOriginais) return;

    async function buscarPorPeriodo() {
      const { data, error } = await supabase
        .from("Lancamento_Nucleo_Extensao")
        .select("*")
        .eq("instituicao_ensino", detalhesOriginais.instituicao_ensino)
        .eq("municipio", detalhesOriginais.municipio)
        .eq("curso", detalhesOriginais.curso)
        .eq("nome_nucleo_extensao", detalhesOriginais.nome_nucleo_extensao)
        .eq("periodo_realizacao", selectedPeriodo)
        .limit(1);

      if (error) {
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setDetalhes(data[0]);
      } else {
        alert(
          `Não existem dados para o período ${selectedPeriodo}.`
        );

        // Mantém o período atual dos dados exibidos
        setSelectedPeriodo(detalhes.periodo_realizacao);
      }
    }

    buscarPorPeriodo();
  }, [
    selectedPeriodo,
    detalhesOriginais,
    detalhes?.periodo_realizacao
  ]);

const handlePeriodoChange = async (novoPeriodo) => {

  const { data, error } = await supabase
    .from("Lancamento_Nucleo_Extensao")
    .select("*")
    .eq("instituicao_ensino", detalhesOriginais.instituicao_ensino)
    .eq("municipio", detalhesOriginais.municipio)
    .eq("curso", detalhesOriginais.curso)
    .eq("nome_nucleo_extensao", detalhesOriginais.nome_nucleo_extensao)
    .eq("periodo_realizacao", novoPeriodo)
    .limit(1);

  if (error) {
    console.error(error);
    return;
  }

  if (data?.length > 0) {
    setDetalhes(data[0]);
    setSelectedPeriodo(novoPeriodo);
  } else {
    alert(`Não existem dados para o período ${novoPeriodo}`);
  }
};

  useEffect(() => {
    async function fetchDetalhes() {
      const { data } = await supabase
        .from("Lancamento_Nucleo_Extensao")
        .select("*")
        .eq("id", id)
        .single();

      setDetalhes(data);
    }

    fetchDetalhes();
  }, [id]);

  if (!detalhes) return <p>Carregando...</p>;

  return (
    <div className="detalhe-container">
      
      <h2>{detalhes.nome_nucleo_extensao}</h2>

     

      {/* ✅ TABELA PRINCIPAL */}
      <table className="table-rounded">
        <tbody>
          <tr>
            <td>Instituição</td>
            <td>{detalhes.instituicao_ensino}</td>
          </tr>
          <tr>
            <td>Município</td>
            <td>{detalhes.municipio}</td>
          </tr>
          <tr>
            <td>Semestre</td>
            <td>
                  <select
                      id="semestre"
                      className="select-semestre"
                      value={selectedPeriodo}
                      onChange={(e) => handlePeriodoChange(e.target.value)}
                    >
                      {periodos.map((periodo) => (
                        <option key={periodo} value={periodo}>
                          {periodo}
                        </option>
                      ))}
                  </select>
            </td>
                  
          </tr>
        </tbody>
      </table>

      {/* ✅ DETALHES */}
      <h3>Detalhes do Projeto</h3>

      <table className="table-rounded">
        <tbody>
          <tr><td>Curso:</td><td>{detalhes.curso}</td></tr>
          <tr><td>Professor(a) Orientador(a):</td><td>{detalhes.professor_orientador}</td></tr>
          <tr><td>Descrição do Projeto:</td><td>{detalhes.descricao_projeto}</td></tr>
          <tr><td>Público-alvo:</td><td>{detalhes.publico_alvo}</td></tr>
          <tr><td>Público impactado:</td><td>{detalhes.publico_impactado}</td></tr>
          <tr><td>Impactos Sociais:</td><td>{detalhes.impactos_sociais}</td></tr>
        </tbody>
      </table>

      {/* ✅ IMAGENS */}
      <h3>Evidências</h3>
{/*
      <div className="imagens">
        {[detalhes.evidencia01_foto, detalhes.evidencia02_foto, detalhes.evidencia03_foto]
          .filter(Boolean)
          .map((img, i) => (
            <button  key={i} onClick={() => setImagemSelecionada(img)}>
              Evidência {i + 1}
            </button>
          ))}
      </div>*/}

      {/* ✅ PREVIEW IMAGEM */}
      {/*
      {imagemSelecionada && (
        <div className="preview">
          <img src={imagemSelecionada} alt="preview" style={{ maxWidth: "100%" }} />
        </div>
      )}*/}
      
      {/* ✅ Todas as imagens */}
      
      <div  >
          <p></p>
          <div style={{    display: "flex",  gap: "10px",  justifyContent: "space-between"   }} >
              <img src={detalhes.evidencia01_foto} alt="preview" style={{ maxWidth: "32%" }} />
              <img src={detalhes.evidencia02_foto} alt="preview" style={{ maxWidth: "32%" }} />
              <img src={detalhes.evidencia03_foto} alt="preview" style={{ maxWidth: "32%" }} />
          </div>
          <p ></p>
      </div>

      <button className="btn-voltar" onClick={() => navigate(-1)}>
            ← Voltar
      </button>
    </div>
  );
}