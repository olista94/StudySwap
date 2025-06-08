import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Avatar
} from "@mui/material";
import {
  faMagnifyingGlass,
  faUser,
  faFileArrowUp,
  faFolderOpen,
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
  faChalkboardUser,
  faUserTie,
  faBookOpen,
  faUsersCog,
  faLandmark,
  faSchool
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

const drawerWidth = 260;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [temarioOpen, setTemarioOpen] = useState(false);
  const [clasesOpen, setClasesOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("studyswap_user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("studyswap_token");
    localStorage.removeItem("studyswap_user");
    setUser(null);
    navigate("/");
  };

  const toggleTemario = () => {
    setTemarioOpen(!temarioOpen);
  };

  const toggleClases = () => {
    setClasesOpen(!clasesOpen);
  };

  const renderLinks = () =>
    user ? (
      user.role === "admin" ? (
        <>
          <ListItem button component={Link} to="/admin/manage-resources">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faBookOpen} /></ListItemIcon>
            <ListItemText primary="Gestionar apuntes" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-tutors">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faLandmark} /></ListItemIcon>
            <ListItemText primary="Gestionar tutores" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-users">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUsersCog} /></ListItemIcon>
            <ListItemText primary="Gestionar usuarios" />
          </ListItem>
          <ListItem button component={Link} to="/profile">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUser} /></ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faRightFromBracket} /></ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItem>
        </>
      ) : (
        <>
          {/* BOTÓN PRINCIPAL DEL TEMARIO */}
          <ListItem button onClick={toggleTemario}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FontAwesomeIcon icon={faBookOpen} />
            </ListItemIcon>
            <ListItemText primary="Temario" />
          </ListItem>

          {/* SUBMENÚ DESPLEGABLE DE TEMARIO */}
          {temarioOpen && (
            <>
              <ListItem
                button
                component={Link}
                to="/explorer"
                sx={{ pl: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </ListItemIcon>
                <ListItemText primary="Buscar temario" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/my-resources"
                sx={{ pl: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon icon={faFolderOpen} />
                </ListItemIcon>
                <ListItemText primary="Mi temario" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/upload"
                sx={{ pl: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon icon={faFileArrowUp} />
                </ListItemIcon>
                <ListItemText primary="Subir temario" />
              </ListItem>
            </>
          )}

          {/* BOTÓN PRINCIPAL DE CLASES */}
          <ListItem button onClick={toggleClases}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FontAwesomeIcon icon={faSchool} />
            </ListItemIcon>
            <ListItemText primary="Clases particulares" />
          </ListItem>

          {/* SUBMENÚ DESPLEGABLE DE CLASES */}
          {clasesOpen && (
            <>
              <ListItem
                button
                component={Link}
                to="/tutors"
                sx={{ pl: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </ListItemIcon>
                <ListItemText primary="Buscar clases" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/my-classes"
                sx={{ pl: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon icon={faChalkboardUser} />
                </ListItemIcon>
                <ListItemText primary="Mis anuncios" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/tutors/publish"
                sx={{ pl: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon icon={faUserTie} />
                </ListItemIcon>
                <ListItemText primary="Publicar clases" />
              </ListItem>
            </>
          )}
          {/* <ListItem button component={Link} to="/tutors">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faChalkboardUser} /></ListItemIcon>
            <ListItemText primary="Profesores particulares" />
          </ListItem>
          <ListItem button component={Link} to="/tutors/publish">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUserTie} /></ListItemIcon>
            <ListItemText primary="Dar clases" />
          </ListItem> */}
          <ListItem button component={Link} to="/profile">
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUser} /></ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faRightFromBracket} /></ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItem>
        </>
      )
    ) : (
      <>
        <ListItem button component={Link} to="/login">
          <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faRightToBracket} /></ListItemIcon>
          <ListItemText primary="Iniciar sesión" />
        </ListItem>
        <ListItem button component={Link} to="/register">
          <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUserPlus} /></ListItemIcon>
          <ListItemText primary="Registrarse" />
        </ListItem>
        <ListItem button component={Link} to="/login" state={{ from: "/select-type" }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <FontAwesomeIcon icon={faFileArrowUp} />
          </ListItemIcon>
          <ListItemText primary="Colgar temario o clases particulares" />
        </ListItem>
      </>
    );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#F9FFF9",
          // ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <img
                src="/images/icon.png"
                alt="StudySwap"
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <Typography variant="h6" fontWeight={600} sx={{ color: "#040F0F" }}>
                StudySwap
              </Typography>
            </Link>
          </Box>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={user.profileImage || "https://res.cloudinary.com/studyswap/image/upload/v1/avatars/default-avatar.png"}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2" sx={{ color: "#040F0F" }}>
                {user.name}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            zIndex: 1200,
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#FCFFFC",
            color: "#FCFFFC",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>{renderLinks()}</List>
        </Box>
      </Drawer>
    </>
  );
}
