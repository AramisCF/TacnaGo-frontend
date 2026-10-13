import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  MapPin,
  Route as RouteIcon,
} from "lucide-react";

import { mockApi } from "../services/mockData";
import BottomNav from "../components/BottomNav";

const initialForm = {
  title: "",
  start: "",
  destination: "",
  description: "",
  fare: "",
  distanceKm: "",
  durationMin: "",
  category: "Transporte",
};

function FormularioRuta({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");

  // Si hay un ID en la URL, cargar la ruta para editarla.
  useEffect(() => {
    if (!isEditing) return;

    let active = true;

    async function loadRoute() {
      try {
        setLoading(true);
        setLoadError("");

        const route = await mockApi.getRouteById(id);

        // Comprobar que sea una ruta propia.
        if (route.creatorId !== currentUser.id) {
          throw new Error(
            "No tienes permiso para editar esta ruta."
          );
        }

        if (!active) return;

        setForm({
          title: route.title ?? "",
          start: route.start ?? "",
          destination: route.destination ?? "",
          description: route.description ?? "",
          fare: String(route.fare ?? ""),
          distanceKm: String(route.distanceKm ?? ""),
          durationMin: String(route.durationMin ?? ""),
          category: route.category || "Transporte",
        });
      } catch (err) {
        if (active) {
          setLoadError(
            err.message || "No se pudo cargar la ruta."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRoute();

    return () => {
      active = false;
    };
  }, [id, isEditing, currentUser.id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !form.title.trim() ||
      !form.start.trim() ||
      !form.destination.trim() ||
      !form.description.trim()
    ) {
      setError("Completa todos los campos de texto.");
      return;
    }

    const fare = Number(form.fare);
    const distanceKm = Number(form.distanceKm);
    const durationMin = Number(form.durationMin);

    if (
      !Number.isFinite(fare) ||
      !Number.isFinite(distanceKm) ||
      !Number.isFinite(durationMin) ||
      fare < 0 ||
      distanceKm <= 0 ||
      durationMin <= 0
    ) {
      setError(
        "Ingresa una tarifa válida y una distancia y duración mayores que cero."
      );
      return;
    }

    const routeData = {
      title: form.title.trim(),
      start: form.start.trim(),
      destination: form.destination.trim(),
      description: form.description.trim(),
      fare,
      distanceKm,
      durationMin,
      category: form.category,
    };

    try {
      setSaving(true);

      if (isEditing) {
        await mockApi.updateRoute(
          id,
          routeData,
          currentUser.id
        );
      } else {
        await mockApi.createRoute(
          routeData,
          currentUser.id
        );
      }

      navigate("/mis-rutas", {
        state: {
          message: isEditing
            ? "La ruta se actualizó correctamente."
            : "La ruta se creó correctamente.",
        },
      });
    } catch (err) {
      setError(
        err.message || "No se pudo guardar la ruta."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link
          to="/mis-rutas"
          className="icon-button"
          aria-label="Volver a mis rutas"
        >
          <ArrowLeft size={21} />
        </Link>

        <div className="brand">
          <span className="brand-mark">
            <RouteIcon size={22} />
          </span>

          <span>
            Tacna <strong>GO</strong>
          </span>
        </div>

        <span className="form-header-spacer" />
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <p className="eyebrow">
            {isEditing ? "GESTIONA TU RECORRIDO" : "COMPARTE CON LA COMUNIDAD"}
          </p>

          <h1>
            {isEditing ? "Editar ruta" : "Crear nueva ruta"}
          </h1>

          <p className="section-subtitle">
            {isEditing
              ? "Actualiza la información de tu recorrido."
              : "Completa los detalles para publicar tu recorrido en Tacna GO."}
          </p>
        </section>

        {loading && (
          <div className="state-message">
            Cargando los datos de la ruta...
          </div>
        )}

        {!loading && loadError && (
          <div className="empty-state">
            <MapPin size={30} />

            <h3>No se puede abrir esta ruta</h3>

            <p>{loadError}</p>

            <Link
              to="/mis-rutas"
              className="primary-button create-route-link"
            >
              Volver a mis rutas
            </Link>
          </div>
        )}

        {!loading && !loadError && (
          <form
            className="route-form"
            onSubmit={handleSubmit}
          >
            <div className="route-form__heading">
              <MapPin size={22} />

              <div>
                <h2>Información del recorrido</h2>
                <p>Completa los datos de tu ruta.</p>
              </div>
            </div>

            <div className="route-form__grid">
              <label className="route-field route-field--full">
                <span>Nombre de la ruta</span>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ej. Ruta al Centro Histórico"
                  maxLength={100}
                  required
                />
              </label>

              <label className="route-field">
                <span>Punto de inicio</span>

                <input
                  type="text"
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  placeholder="Ej. Mercado Central"
                  maxLength={120}
                  required
                />
              </label>

              <label className="route-field">
                <span>Destino</span>

                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="Ej. Paseo Cívico"
                  maxLength={120}
                  required
                />
              </label>

              <label className="route-field route-field--full">
                <span>Descripción</span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe el recorrido y sus principales referencias..."
                  rows={4}
                  maxLength={500}
                  required
                />

                <small>
                  {form.description.length}/500 caracteres
                </small>
              </label>

              <label className="route-field">
                <span>Tarifa sugerida (S/)</span>

                <input
                  type="number"
                  name="fare"
                  value={form.fare}
                  onChange={handleChange}
                  placeholder="2.00"
                  min="0"
                  step="0.1"
                  required
                />
              </label>

              <label className="route-field">
                <span>Distancia (km)</span>

                <input
                  type="number"
                  name="distanceKm"
                  value={form.distanceKm}
                  onChange={handleChange}
                  placeholder="2.4"
                  min="0.1"
                  step="0.1"
                  required
                />
              </label>

              <label className="route-field">
                <span>Duración estimada (minutos)</span>

                <input
                  type="number"
                  name="durationMin"
                  value={form.durationMin}
                  onChange={handleChange}
                  placeholder="15"
                  min="1"
                  step="1"
                  required
                />
              </label>

              <label className="route-field">
                <span>Categoría</span>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Transporte">Transporte</option>
                  <option value="Turística">Turística</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Gastronómica">Gastronómica</option>
                  <option value="Deportiva">Deportiva</option>
                  <option value="General">General</option>
                </select>
              </label>
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="route-form__footer">
              <Link
                to="/mis-rutas"
                className="secondary-button cancel-link"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="primary-button save-route-button"
                disabled={saving}
              >
                <Save size={17} />

                {saving
                  ? "Guardando..."
                  : isEditing
                    ? "Guardar cambios"
                    : "Publicar ruta"}
              </button>
            </div>

            <p className="route-form__note">
              Prototipo académico: los cambios se almacenan
              temporalmente en memoria.
            </p>
          </form>
        )}
      </main>

      <BottomNav active="create" />
    </div>
  );
}

export default FormularioRuta;