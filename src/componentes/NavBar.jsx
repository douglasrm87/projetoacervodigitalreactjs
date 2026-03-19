import { NavLink } from 'react-router-dom';
export default function NavBar(){
  return (
    <nav className="nav">
      <NavLink to="/">Início</NavLink>
      <NavLink to="/packages">Pacotes</NavLink>
      <NavLink to="/destinations">Destinos</NavLink>
      <NavLink to="/prerequisites">Pré-requisitos</NavLink>
      <NavLink to="/structure">Nossa estrutura</NavLink>
      <NavLink to="/testimonials">Relatos</NavLink>
      <NavLink to="/about">Quem somos</NavLink>
      <NavLink to="/how-to-appear">Como um membro do reino do céu pode aparecer</NavLink>
    </nav>
  );
}