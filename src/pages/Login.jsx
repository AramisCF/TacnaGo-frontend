
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
} from "lucide-react";

import { mockApi } from "../services/mockData";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      let user;

      if (isRegister) {
        user = await mockApi.register(name, email, password);
      } else {
        user = await mockApi.login(email, password);
      }

      onLogin(user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Ocurrió un error. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function changeMode() {
    setMode(isRegister ? "login" : "register");
    setError("");
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-visual__brand">
          <span className="brand-mark">
            <Compass size={28} />
          </span>
          <span>
            Tacna <strong>GO</strong>
          </span>
        </div>

        <div className="login-visual__message">
          <p className="eyebrow">TU CIUDAD, TU RECORRIDO</p>
          <h1>Descubre Tacna a tu manera.</h1>
          <p>
            Explora rutas, encuentra nuevos destinos y comparte
            tus recorridos con la comunidad.
          </p>
        </div>

        <div className="login-visual__decoration">
          <Compass size={180} strokeWidth={0.6} />
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card__heading">
            <span className="login-card__icon">
              <UserRound size={23} />
            </span>

            <h2>
              {isRegister ? "Crea tu cuenta" : "¡Bienvenido de nuevo!"}
            </h2>

            <p>
              {isRegister
                ? "Únete a la comunidad de Tacna GO."
                : "Ingresa para comenzar tu próximo recorrido."}
            </p>
          </div>

          {isRegister && (
            <label className="form-field">
              <span>Nombre completo</span>
              <div className="input-wrap">
                <UserRound size={18} />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </label>
          )}

          <label className="form-field">
            <span>Correo electrónico</span>
            <div className="input-wrap">
              <Mail size={18} />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>Contraseña</span>
            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={6}
                required
              />
            </div>
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="primary-button login-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : isRegister
                ? "Crear cuenta"
                : "Iniciar sesión"}

            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="login-switch">
            {isRegister ? "¿Ya tienes una cuenta?" : "¿Eres nuevo en Tacna GO?"}{" "}
            <button type="button" onClick={changeMode}>
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>

          {!isRegister && (
            <p className="demo-hint">
              Demo: demo@tacnago.pe · contraseña: 123456
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default Login;
