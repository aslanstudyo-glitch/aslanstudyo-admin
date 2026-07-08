import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch {
      alert("E-posta veya şifre hatalı.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <img src="/images/logo.png" alt="Aslan Stüdyo" />

        <h1>Yönetim Paneli</h1>
        <p>Aslan Stüdyo admin girişi</p>

        <input
          type="email"
          placeholder="E-posta adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}

export default Login;