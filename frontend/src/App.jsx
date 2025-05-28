import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

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

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/explorer" element={<PublicResources />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/my-resources" element={<MyResources />} />
            <Route path="/tutors" element={<TutorOffersList />} />
            <Route path="/tutors/publish" element={<PublishTutorOffer />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
