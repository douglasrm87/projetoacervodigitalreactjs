import { FaUniversity, FaProjectDiagram, FaUsers } from "react-icons/fa";
import './InfoPainel.css';

export default function InfoPainel({ data }) {

  if (!data)
    return (
      <div className="info-box">
        Selecione uma{" "}
        <span className="highlight-secondary">Cidade</span>{" "}
        no mapa
      </div>
    );

  return (
    <div className="info-box">
      <h1>Selecione uma Regional ou cidade no mapa.
</h1>
      <h2 className="titulo">Regional: {data.regional}</h2>

      <div className="metrics-wrapper">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>
                <FaUniversity />
                <span>Instituições</span>
              </th>
              <th>
                <FaProjectDiagram />
                <span>Núcleos</span>
              </th>
              <th>
                <FaUsers />
                <span>Público</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{data.ies}</td>
              <td>{data.nucleos}</td>
              <td>{data.publico}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}