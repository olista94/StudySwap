import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import UserList from "./pages/UserList/UserList";
import PublicResources from "./pages/PublicResources/PublicResources";
import ResourceDetail from "./pages/ResourceDetail/ResourceDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Upload from "./pages/Upload/Upload";
import MyResources from "./pages/MyResources/MyResources";
import PublishTutorOffer from "./pages/PublishTutorOffer/PublishTutorOffer";
import TutorOffersList from "./pages/TutorOffersList/TutorOffersList";
import Profile from "./pages/Profile/Profile";
import UserEdit from "./pages/UserEdit/UserEdit";
import ResourceList from "./pages/ResourceList/ResourceList";
import TutorList from "./pages/TutorList/TutorList";
import UploadSelector from "./pages/UploadSelector/UploadSelector";
import MyClasses from "./pages/MyClasses/MyClasses";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar permanente */}
        <Navbar />

        {/* Contenido principal con margen a la izquierda */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // ml: `${drawerWidth}px`,
            mt: "64px", // altura del AppBar fijo
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              {/* <Route path="/" element={<Navigate to="/login" />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/manage-resources" element={<ResourceList />} />
              <Route path="/admin/manage-tutors" element={<TutorList />} />
              <Route path="/admin/manage-users" element={<UserList />} />
              <Route path="/admin/users/:id/edit" element={<UserEdit />} />
              <Route path="/explorer" element={<PublicResources />} />
              <Route path="/select-type" element={<UploadSelector />} />
              <Route path="/my-classes" element={<MyClasses />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/my-resources" element={<MyResources />} />
              <Route path="/tutors" element={<TutorOffersList />} />
              <Route path="/tutors/publish" element={<PublishTutorOffer />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Box>

          {/* Footer al final del contenido */}
          <Footer />
        </Box>
      </Box>
    </BrowserRouter>
  );
}
