export default function TabelaUnidades({ estado, data }) {

  return (
    <div className="table-container">

      <h3>Unidades - {estado}</h3>

      <table>
        <thead>
          <tr>
            <th>Instituição</th>
            <th>Município</th>
            <th>Núcleo</th>
            <th>Público</th>
          </tr>
        </thead>

        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.instituicao_ensino}</td>
              <td>{item.municipio}</td>
              <td>{item.nome_nucleo_extensao}</td>
              <td>{item.publico_impactado}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}