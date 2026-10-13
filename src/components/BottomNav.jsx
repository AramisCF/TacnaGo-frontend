
import { Link } from "react-router-dom";
import { Compass, Bookmark, CirclePlus } from "lucide-react";

const items = [
  {
    id: "home",
    label: "Global",
    to: "/",
    Icon: Compass,
  },
  {
    id: "routes",
    label: "Mis rutas",
    to: "/mis-rutas",
    Icon: Bookmark,
  },
  {
    id: "create",
    label: "Crear viaje",
    to: "/rutas/nueva",
    Icon: CirclePlus,
  },
];

function BottomNav({ active }) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map(({ id, label, to, Icon }) => (
        <Link
          key={id}
          to={to}
          className={`bottom-nav__item ${
            active === id ? "is-active" : ""
          }`}
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={22} strokeWidth={active === id ? 2.5 : 1.8} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default BottomNav;
