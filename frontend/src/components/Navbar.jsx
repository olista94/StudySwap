// src/components/Navbar/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
    <nav className="navbar-wuolah">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src="/images/icon.png" alt="StudySwap" />
          StudySwap
        </Link>
      </div>

      <ul className="navbar-links">
        {user ? (
          <>
            <li><Link to="/explorar"><FontAwesomeIcon icon={faMagnifyingGlass} />Buscar apuntes</Link></li>
            <li><Link to="/upload"><FontAwesomeIcon icon={faFileArrowUp} /> Subir</Link></li>
            <li><Link to="/my-resources"><FontAwesomeIcon icon={faFolderOpen} /> Mis recursos</Link></li>
            <li><Link to="/profile"><FontAwesomeIcon icon={faUser} /> Perfil</Link></li>
            <li><button onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} /> Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login"><FontAwesomeIcon icon={faRightToBracket} /> Iniciar sesión</Link></li>
            <li><Link to="/register"><FontAwesomeIcon icon={faUserPlus} /> Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
