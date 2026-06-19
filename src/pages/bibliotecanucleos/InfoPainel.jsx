export default function InfoPainel({ data }) {

    if (!data)
      return (
        <div className="info-box">
          Passe o mouse sobre um{" "}
          <span style={{ color: "#002F6C", fontWeight: "bold", fontSize: "1.1em" }}>
            Regional
          </span>{" "}
            ou{" "}
          <span style={{ color: "#e7146c", fontWeight: "bold", fontSize: "1.1em" }}>
            Cidade
          </span>{" "}
        </div>
      );

//  console.log ("Quantidade de Ies: " + data.ies);
  //console.log ("Quantidade de Núcleos: " + data.nucleos);
  //console.log ("Quantidade de Público Impactado: " + data.publico);
  return (
    <div className="info-box">

      <h2>Regional: {data.regional}</h2>
      <p></p>

      <div className="metrics-table">
        <table>
          <thead>
            <tr>
              <th>Instituições</th>
              <th>Núcleos</th>
              <th>Público</th>
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