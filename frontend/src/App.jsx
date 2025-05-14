import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PublicResources from "./pages/PublicResources/PublicResources";
import ResourceDetail from "./pages/ResourceDetail/ResourceDetail";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload/Upload";
import MyResources from "./pages/MyResources/MyResources";
import Profile from "./pages/Profile/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explorar" element={<PublicResources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/my-resources" element={<MyResources />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
