import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileArrowUp, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("studyswap_user");
        if (storedUser) setUser(JSON.parse(storedUser));
        else setUser(null);
    }, [location]); // Se actualiza al navegar

    const handleLogout = () => {
        localStorage.removeItem("studyswap_token");
        localStorage.removeItem("studyswap_user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand d-flex align-items-center" to="/">
                <img src="/icon.png" alt="Logo StudySwap" className="logo-icon me-2" />
                StudySwap
            </Link>

            {/* Hamburguesa para móviles */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    {user ? (
                        // Usuario logueado: mostrar opciones
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/upload"><FontAwesomeIcon icon={faFileArrowUp} /> Subir</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-resources"><FontAwesomeIcon icon={faFolderOpen} /> Mis recursos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile"><FontAwesomeIcon icon={faUser} /> Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        // Solo mostrar login/register si no estás ya en el home después del login
                        <>
                            {location.pathname !== "/" && location.pathname !== "/login" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Iniciar sesión</Link>
                                </li>
                            )}
                            {location.pathname !== "/" && location.pathname !== "/register" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registrarse</Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
