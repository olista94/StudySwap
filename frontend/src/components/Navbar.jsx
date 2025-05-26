import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("studyswap_user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("studyswap_token");
    localStorage.removeItem("studyswap_user");
    setUser(null);
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const renderLinks = () =>
    user ? (
      <>
        <ListItem button component={Link} to="/explorer" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faMagnifyingGlass} /></ListItemIcon>
          <ListItemText primary="Buscar apuntes" />
        </ListItem>
        <ListItem button component={Link} to="/my-resources" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faFolderOpen} /></ListItemIcon>
          <ListItemText primary="Mis recursos" />
        </ListItem>
        <ListItem button component={Link} to="/upload" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faFileArrowUp} /></ListItemIcon>
          <ListItemText primary="Subir apuntes" />
        </ListItem>
        <ListItem button component={Link} to="/tutors" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faChalkboardUser} /></ListItemIcon>
          <ListItemText primary="Profesores particulares" />
        </ListItem>
        <ListItem button component={Link} to="/tutors/publish" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faUserTie} /></ListItemIcon>
          <ListItemText primary="Dar clases" />
        </ListItem>
        <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faUser} /></ListItemIcon>
          <ListItemText primary="Perfil" />
        </ListItem>
        <ListItem button onClick={() => { toggleDrawer(false)(); handleLogout(); }}>
          <ListItemIcon><FontAwesomeIcon icon={faRightFromBracket} /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </>
    ) : (
      <>
        <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faRightToBracket} /></ListItemIcon>
          <ListItemText primary="Iniciar sesión" />
        </ListItem>
        <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)}>
          <ListItemIcon><FontAwesomeIcon icon={faUserPlus} /></ListItemIcon>
          <ListItemText primary="Registrarse" />
        </ListItem>
      </>
    );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#040F0F" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="background"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, color: "#FCFFFC" }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#FCFFFC",
              flexGrow: 1,
            }}
          >
            <img
              src="/images/icon.png"
              alt="StudySwap"
              style={{ width: 32, height: 32, marginRight: 8 }}
            />
            <Typography variant="h6" fontWeight={600}>
              StudySwap
            </Typography>
          </Box>

          {user && (
            <Typography variant="body2" sx={{ mr: 1 }}>
              Hola {user.name}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 260, pt: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>{renderLinks()}</List>
        </Box>
      </Drawer>
    </>
  );
}
