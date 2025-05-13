import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("studyswap_user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, [location]); // 👈 actualiza al navegar

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

            {/* Botón hamburguesa para móviles */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    {user ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">👤 {user.name}</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {location.pathname === "/login" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <span className="d-none d-sm-inline">Registrarse</span>
                                        <span className="d-inline d-sm-none"><i className="fas fa-user-plus"></i></span>
                                    </Link>
                                </li>
                            )}
                            {location.pathname === "/register" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <span className="d-none d-sm-inline">Iniciar sesión</span>
                                        <span className="d-inline d-sm-none"><i className="fas fa-sign-in-alt"></i></span>
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
