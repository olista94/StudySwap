import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faUser,
  faFileArrowUp,
  faFolderOpen,
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("studyswap_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("studyswap_token");
    localStorage.removeItem("studyswap_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar-studyswap">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link to="/" className="brand-link">
          <img src="/images/icon.png" alt="StudySwap" className="brand-icon" />
          <span className="brand-text">StudySwap</span>
        </Link>
      </div>

      <ul className={`navbar-links ${menuOpen ? "show" : ""}`}>
        {user ? (
          <>
            <li><Link to="/explorar" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar apuntes</Link></li>
            <li><Link to="/upload" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faFileArrowUp} /> Subir</Link></li>
            <li><Link to="/my-resources" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faFolderOpen} /> Mis recursos</Link></li>
            <li><Link to="/profile" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faUser} /> Perfil</Link></li>
            <li><button onClick={() => { setMenuOpen(false); handleLogout(); }}><FontAwesomeIcon icon={faRightFromBracket} /> Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faRightToBracket} /> Iniciar sesión</Link></li>
            <li><Link to="/register" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faUserPlus} /> Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
