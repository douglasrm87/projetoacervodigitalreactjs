import { useState, useRef, useEffect } from "react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./TabelaUnidade.module.css";
import { useNavigate } from "react-router-dom";

export default function TabelaUnidades({ estado, data }) {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // ✅ Agrupar por instituição
  const groupedData = data.reduce((acc, item) => {
    const key = item.instituicao_ensino;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

  const instituicoes = Object.keys(groupedData);

  useEffect(() => {
    if (openIndex !== null && tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [openIndex]);


  return (
    <div className="table-container" >
      <h3>Unidades - {estado}</h3>

      {instituicoes.map((instituicao, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={instituicao} className="accordion-item">
            
            {/* ✅ HEADER DESTACADO */}
            <div
              className="accordion-header"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div>
                <strong>{instituicao} - </strong>
                <span className="badge">
                  {groupedData[instituicao].length} núcleos
                </span>
              </div>

              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {/* ✅ TABELA COLAPSÁVEL */}
            {isOpen && (
              <div className="accordion-content" ref={tableRef}>
                <table>
                  <thead>
                    <tr>
                      <th>Município</th>
                      <th>Núcleo</th>
                      <th>Curso</th>
                      <th>Público</th>
                    </tr>
                  </thead>

                  <tbody>
                    {groupedData[instituicao].map(item => (
                        <tr
                          key={item.id}
                          className="clickable-row"
                          onClick={() =>
                            navigate(`/detalhe/${item.id}`, { state: item })
                          }
                          >
                            <td>{item.municipio}</td>
                            <td>{item.nome_nucleo_extensao}</td>
                            <td>{item.curso}</td>
                            <td>{item.publico_impactado}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}