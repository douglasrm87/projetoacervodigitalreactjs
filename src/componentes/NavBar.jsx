import { NavLink } from 'react-router-dom';
export default function NavBar(){
  return (
    <nav className="nav">
      <NavLink to="/">Início</NavLink>
      <NavLink to="/login">Entrar</NavLink>
      <NavLink to="/submit">Submeter</NavLink>
      
      <NavLink to="/certificate">Certificado</NavLink>
      
      <NavLink to="/admin/estado">Dados sistema</NavLink>
      
      <NavLink to="/unidadesfaculdade">Unidades Estácio</NavLink>

      {/* <NavLink to="/mapabrasil">Mapa Hard Rock</NavLink> */}
      <NavLink to="/mapabrasilbd">Mapa Hard Rock Banco de Dados</NavLink>
      
      <NavLink to="/bibliotecanucleos">Nucleos Extensão</NavLink>
      <NavLink to="/review">Revisão</NavLink>

      <NavLink to="/oficina">Oficina</NavLink>
    </nav>
  );
}
