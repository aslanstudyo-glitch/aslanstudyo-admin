import { useState } from "react";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  if (!isLogin) {
    return <Login onLogin={() => setIsLogin(true)} />;
  }

  return (
    <AdminLayout>
      <Gallery />
    </AdminLayout>
  );
}

export default App;