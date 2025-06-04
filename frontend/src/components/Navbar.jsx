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
  Avatar
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
  faBookOpen,
  faUsersCog,
  faLandmark,
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
        {user.role === "admin" ? (
          // Admin links
          <>
            <ListItem button component={Link} to="/admin/manage-resources" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faBookOpen} /></ListItemIcon>
              <ListItemText primary="Gestionar apuntes" />
            </ListItem>
            <ListItem button component={Link} to="/admin/manage-tutors" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faLandmark} /></ListItemIcon>
              <ListItemText primary="Gestionar tutores" />
            </ListItem>
            <ListItem button component={Link} to="/admin/manage-users" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUsersCog} /></ListItemIcon>
              <ListItemText primary="Gestionar usuarios" />
            </ListItem>
            <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUser} /></ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
            <ListItem button onClick={() => { toggleDrawer(false)(); handleLogout(); }}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faRightFromBracket} /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </>
        ) : (
          // User links
          <>
            <ListItem button component={Link} to="/explorer" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faMagnifyingGlass} /></ListItemIcon>
              <ListItemText primary="Buscar apuntes" />
            </ListItem>
            <ListItem button component={Link} to="/my-resources" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faFolderOpen} /></ListItemIcon>
              <ListItemText primary="Mis recursos" />
            </ListItem>
            <ListItem button component={Link} to="/upload" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faFileArrowUp} /></ListItemIcon>
              <ListItemText primary="Subir apuntes" />
            </ListItem>
            <ListItem button component={Link} to="/tutors" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faChalkboardUser} /></ListItemIcon>
              <ListItemText primary="Profesores particulares" />
            </ListItem>
            <ListItem button component={Link} to="/tutors/publish" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUserTie} /></ListItemIcon>
              <ListItemText primary="Dar clases" />
            </ListItem>
            <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faUser} /></ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
            <ListItem button onClick={() => { toggleDrawer(false)(); handleLogout(); }}>
              <ListItemIcon sx={{ minWidth: 32 }}><FontAwesomeIcon icon={faRightFromBracket} /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </>
        )}
      </>
    ) : (
      // Unauthenticated users
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={user.profileImage || "https://res.cloudinary.com/studyswap/image/upload/v1/avatars/default-avatar.png"}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2" sx={{ color: "var(--white)" }}>
                {user.name}
              </Typography>
            </Box>
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
