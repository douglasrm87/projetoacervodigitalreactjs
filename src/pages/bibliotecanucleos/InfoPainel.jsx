export default function InfoPainel({ data }) {

  if (!data) return <div className="info-box">Passe o mouse sobre um estado</div>;

  return (
    <div className="info-box">

      <h2>Estado: {data.estado}</h2>
      <p>Regional: {data.regional}</p>

      <div className="metrics">
        <div>
          <strong>{data.ies}</strong>
          <span>Instituições</span>
        </div>

        <div>
          <strong>{data.nucleos}</strong>
          <span>Núcleos</span>
        </div>

        <div>
          <strong>{data.publico}</strong>
          <span>Público</span>
        </div>
      </div>

    </div>
  );
}