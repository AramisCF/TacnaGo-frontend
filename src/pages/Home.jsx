
import { useEffect, useState } from "react";
import {
  Compass,
  Search,
  SlidersHorizontal,
  LogOut,
  MapPin,
} from "lucide-react";

import { mockApi } from "../services/mockData";
import RouteCard from "../components/RouteCard";
import BottomNav from "../components/BottomNav";

function Home({ currentUser, onLogout }) {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRoutes() {
      try {
        setLoading(true);
        setError("");

        const data = await mockApi.getRoutes();

        if (active) {
          setRoutes(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "No se pudieron cargar las rutas.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRoutes();

    return () => {
      active = false;
    };
  }, []);

  const categories = [
    "Todas",
    ...new Set(routes.map((route) => route.category).filter(Boolean)),
  ];

  const filteredRoutes = routes.filter((route) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch = [
      route.title,
      route.start,
      route.destination,
      route.description,
      route.category,
      route.creatorName,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchText));

    const matchesCategory =
      category === "Todas" || route.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Compass size={23} />
          </span>

          <span>
            Tacna <strong>GO</strong>
          </span>
        </div>

        <div className="topbar__user">
          <span className="user-avatar">
            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
          </span>

          <button
            className="icon-button"
            type="button"
            onClick={onLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={19} />
          </button>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <p className="eyebrow">EXPLORA · DESCUBRE · COMPARTE</p>

          <h1>
            ¡Hola, {currentUser?.name?.split(" ")[0] || "viajero"}!
          </h1>

          <p className="section-subtitle">
            Encuentra tu próximo recorrido por Tacna.
          </p>
        </section>

        <section className="search-section">
          <label className="search-box">
            <Search size={20} />

            <input
              type="search"
              placeholder="¿A dónde vas?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar rutas por destino, nombre o descripción"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </label>

          <label className="filter-box">
            <SlidersHorizontal size={18} />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filtrar rutas por categoría"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="routes-section">
          <div className="section-heading">
            <div>
              <h2>Rutas cerca de ti</h2>
              <p>
                <MapPin size={14} />
                Descubre recorridos compartidos por la comunidad.
              </p>
            </div>

            <span className="route-count">
              {filteredRoutes.length}{" "}
              {filteredRoutes.length === 1 ? "ruta" : "rutas"}
            </span>
          </div>

          {loading && (
            <div className="state-message">
              Cargando rutas...
            </div>
          )}

          {!loading && error && (
            <div className="state-message state-message--error">
              {error}
            </div>
          )}

          {!loading && !error && filteredRoutes.length === 0 && (
            <div className="empty-state">
              <Search size={30} />
              <h3>No encontramos rutas</h3>
              <p>Prueba con otro destino o cambia la categoría.</p>
              <button
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setCategory("Todas");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {!loading && !error && filteredRoutes.length > 0 && (
            <div className="route-list">
              {filteredRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  );
}

export default Home;
