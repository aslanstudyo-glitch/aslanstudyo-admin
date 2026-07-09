import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Reservations from "./pages/Reservations";
import Settings from "./pages/Settings";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  if (!isLogin) {
    return <Login onLogin={() => setIsLogin(true)} />;
  }

  return (
    <AdminLayout activePage={activePage} setActivePage={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "gallery" && <Gallery />}
      {activePage === "videos" && <Videos />}
      {activePage === "reservations" && <Reservations />}
      {activePage === "settings" && <Settings />}
    </AdminLayout>
  );
}

export default App;