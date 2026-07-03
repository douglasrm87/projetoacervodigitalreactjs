import "./Navbar.module.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBook,
} from "react-icons/fa";



export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-header">
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


 
       
        <NavLink onClick={handleClick} to="/bibliotecanucleos">
          <FaBook /> <span>Núcleos</span>
        </NavLink>
      </div>
    </nav>
  );
}