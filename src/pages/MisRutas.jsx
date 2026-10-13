import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bookmark,
  CirclePlus,
  Route as RouteIcon,
  RefreshCw,
} from "lucide-react";

import { mockApi } from "../services/mockData";
import RouteCard from "../components/RouteCard";
import BottomNav from "../components/BottomNav";

function MisRutas({ currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    location.state?.message || ""
  );
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadMyRoutes() {
      try {
        setLoading(true);
        setError("");

        const data = await mockApi.getMyRoutes(currentUser.id);

        if (active) {
          setRoutes(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "No se pudieron cargar tus rutas."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMyRoutes();

    return () => {
      active = false;
    };
  }, [currentUser.id]);

  async function handleDelete(route) {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar "${route.title}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(route.id);
      setError("");
      setMessage("");

      await mockApi.deleteRoute(route.id, currentUser.id);

      setRoutes((previousRoutes) =>
        previousRoutes.filter(
          (item) => String(item.id) !== String(route.id)
        )
      );

      setMessage("La ruta se eliminó correctamente.");
    } catch (err) {
      setError(
        err.message || "No se pudo eliminar la ruta."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(route) {
    navigate(`/rutas/${route.id}/editar`);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Bookmark size={22} />
          </span>

          <span>Mis rutas</span>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <p className="eyebrow">TU ESPACIO PERSONAL</p>

          <h1>Mis rutas</h1>

          <p className="section-subtitle">
            Administra los recorridos que compartes con la
            comunidad, {currentUser.name.split(" ")[0]}.
          </p>
        </section>

        <div className="my-routes-toolbar">
          <div className="my-routes-count">
            <RouteIcon size={20} />

            <span>
              {routes.length}{" "}
              {routes.length === 1 ? "ruta publicada" : "rutas publicadas"}
            </span>
          </div>

          <Link
            to="/rutas/nueva"
            className="primary-button create-route-link"
          >
            <CirclePlus size={18} />
            Nueva ruta
          </Link>
        </div>

        {message && (
          <div className="feedback-message" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="state-message">
            <RefreshCw size={19} />
            Cargando tus rutas...
          </div>
        )}

        {!loading && !error && routes.length === 0 && (
          <div className="empty-state">
            <RouteIcon size={34} />

            <h3>Aún no has publicado rutas</h3>

            <p>
              Crea tu primer recorrido y compártelo con la
              comunidad de Tacna GO.
            </p>

            <Link
              to="/rutas/nueva"
              className="primary-button create-route-link"
            >
              <CirclePlus size={18} />
              Crear mi primera ruta
            </Link>
          </div>
        )}

        {!loading && routes.length > 0 && (
          <div className="route-list">
            {routes.map((route) => (
              <div className="managed-route" key={route.id}>
                <RouteCard
                  route={route}
                  onEdit={() => handleEdit(route)}
                  onDelete={() => handleDelete(route)}
                />

                {deletingId === route.id && (
                  <p className="route-pending">
                    Eliminando ruta...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="routes" />
    </div>
  );
}

export default MisRutas;