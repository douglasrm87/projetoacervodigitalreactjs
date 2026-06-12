import "./Navbar.module.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaUpload,
  FaCertificate,
  FaDatabase,
  FaUniversity,
  FaMap,
  FaBook,
  FaCheck,
  FaTools
} from "react-icons/fa";



export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-header">
        <div className="logo">Acervo Digital</div>

        {/* SANDWICH (3 linhas) */}
        <div
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink onClick={handleClick} to="/">
          <FaHome /> <span>Início</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/login">
          <FaSignInAlt /> <span>Entrar</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/submit">
          <FaUpload /> <span>Submeter</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/certificate">
          <FaCertificate /> <span>Certificado</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/admin/estado">
          <FaDatabase /> <span>Dados sistema</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/unidadesfaculdade">
          <FaUniversity /> <span>Unidades Estácio</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/mapabrasilbd">
          <FaMap /> <span>Mapa BD</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/bibliotecanucleos">
          <FaBook /> <span>Núcleos</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/review">
          <FaCheck /> <span>Revisão</span>
        </NavLink>

        <NavLink onClick={handleClick} to="/oficina">
          <FaTools /> <span>Oficina</span>
        </NavLink>
      </div>
    </nav>
  );
}