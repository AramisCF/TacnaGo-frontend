
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import MisRutas from "./pages/MisRutas";
import FormularioRuta from "./pages/FormularioRuta";

// Protege las páginas que requieren iniciar sesión.
function PrivateRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  // Recuperar la sesión de esta pestaña, si existe.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("tacnaGoUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Mantener la sesión actualizada.
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(
        "tacnaGoUser",
        JSON.stringify(currentUser)
      );
    } else {
      sessionStorage.removeItem("tacnaGoUser");
    }
  }, [currentUser]);

  // Cerrar sesión.
  function handleLogout() {
    setCurrentUser(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={setCurrentUser} />
            )
          }
        />

        {/* Inicio / feed global */}
        <Route
          path="/"
          element={
            <PrivateRoute currentUser={currentUser}>
              <Home
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </PrivateRoute>
          }
        />

        {/* Mis rutas: consultar, editar y eliminar */}
        <Route
          path="/mis-rutas"
          element={
            <PrivateRoute currentUser={currentUser}>
              <MisRutas currentUser={currentUser} />
            </PrivateRoute>
          }
        />

        {/* Crear una nueva ruta */}
        <Route
          path="/rutas/nueva"
          element={
            <PrivateRoute currentUser={currentUser}>
              <FormularioRuta currentUser={currentUser} />
            </PrivateRoute>
          }
        />

        {/* Editar una ruta existente */}
        <Route
          path="/rutas/:id/editar"
          element={
            <PrivateRoute currentUser={currentUser}>
              <FormularioRuta currentUser={currentUser} />
            </PrivateRoute>
          }
        />

        {/* Redirigir cualquier dirección desconocida */}
        <Route
          path="*"
          element={
            <Navigate
              to={currentUser ? "/" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
