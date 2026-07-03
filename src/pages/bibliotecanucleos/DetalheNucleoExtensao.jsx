import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../../infra/supabase/supabaseClient';

import "./DetalheNucleoExtensao.css";
import { useNavigate } from "react-router-dom";

export default function DetalheNucleoExtensao() {
  //const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalhes, setDetalhes] = useState(null);
  //const [imagemSelecionada, setImagemSelecionada] = useState(null);

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
            <td>Público</td>
            <td>{detalhes.publico_impactado}</td>
          </tr>
        </tbody>
      </table>

      {/* ✅ DETALHES */}
      <h3>Detalhes do Projeto</h3>

      <table className="table-rounded">
        <tbody>
          <tr><td>Curso</td><td>{detalhes.curso}</td></tr>
          <tr><td>Professor</td><td>{detalhes.professor_orientador}</td></tr>
          <tr><td>Descrição</td><td>{detalhes.descricao_projeto}</td></tr>
          <tr><td>Impactos</td><td>{detalhes.impactos_sociais}</td></tr>
          <tr><td>Período</td><td>{detalhes.periodo_realizacao}</td></tr>
          <tr><td>Público Alvo</td><td>{detalhes.publico_alvo}</td></tr>
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
          <h3>Todas as Evidências</h3>
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