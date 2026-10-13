import {
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";

function RouteCard({ route, onEdit, onDelete }) {
  return (
    <article className="route-card">
      <div className="route-card__map" aria-hidden="true">
        <svg viewBox="0 0 150 150" className="route-map">
          <rect width="150" height="150" fill="#edf2f4" />

          <g stroke="#d4dde0" strokeWidth="8">
            <path d="M-10 25 L160 25" />
            <path d="M-10 65 L160 65" />
            <path d="M-10 105 L160 105" />
            <path d="M25 -10 L25 160" />
            <path d="M70 -10 L70 160" />
            <path d="M115 -10 L115 160" />
          </g>

          <g stroke="#ffffff" strokeWidth="3">
            <path d="M-10 45 L160 45" />
            <path d="M-10 85 L160 85" />
            <path d="M-10 125 L160 125" />
            <path d="M45 -10 L45 160" />
            <path d="M95 -10 L95 160" />
            <path d="M140 -10 L140 160" />
          </g>

          <path
            d="M20 126 C42 108, 35 78, 70 76 S100 51, 128 20"
            fill="none"
            stroke="#f23843"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <circle
            cx="20"
            cy="126"
            r="6"
            fill="#15966a"
            stroke="white"
            strokeWidth="3"
          />

          <circle
            cx="128"
            cy="20"
            r="6"
            fill="#f23843"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="route-card__content">
        <div className="route-card__top">
          <span className="route-card__category">
            {route.category}
          </span>

          <span className="route-card__rating">
            <Star size={14} fill="currentColor" />
            {Number(route.rating ?? 0).toFixed(1)}
          </span>
        </div>

        <h3>{route.title}</h3>

        <p className="route-card__destination">
          <MapPin size={14} />

          <span>
            {route.start} <ArrowRight size={13} />{" "}
            {route.destination}
          </span>
        </p>

        <p className="route-card__description">
          {route.description}
        </p>

        <div className="route-card__footer">
          <span>
            <Clock size={14} />
            {route.durationMin} min
          </span>

          <span>
            {Number(route.distanceKm).toFixed(1)} km
          </span>

          <strong>
            S/ {Number(route.fare).toFixed(2)}
          </strong>
        </div>

        {(onEdit || onDelete) && (
          <div className="route-card__actions">
            {onEdit && (
              <button
                className="route-action route-action--edit"
                type="button"
                onClick={onEdit}
              >
                <Pencil size={15} />
                Editar
              </button>
            )}

            {onDelete && (
              <button
                className="route-action route-action--delete"
                type="button"
                onClick={onDelete}
              >
                <Trash2 size={15} />
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default RouteCard;