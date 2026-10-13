
const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const copy = (data) => JSON.parse(JSON.stringify(data));

// =======================================
// 1. USUARIOS SIMULADOS
// =======================================

export const mockUsers = [
  {
    id: "u1",
    name: "Aramis Claros",
    email: "demo@tacnago.pe",
    avatar: "",
    bio: "Descubriendo Tacna, una ruta a la vez.",
    createdRoutes: 2,
    completedTrips: 45,
  },
  {
    id: "u2",
    name: "María Gómez",
    email: "maria@tacnago.pe",
    avatar: "",
    bio: "Explorando nuevos lugares.",
    createdRoutes: 1,
    completedTrips: 28,
  },
  {
    id: "u3",
    name: "Luis Quispe",
    email: "luis@tacnago.pe",
    avatar: "",
    bio: "Conociendo Tacna.",
    createdRoutes: 1,
    completedTrips: 19,
  },
];

// Credenciales ficticias para el prototipo.
// No usar este mecanismo para autenticar usuarios reales.
const mockCredentials = [
  {
    userId: "u1",
    password: "123456",
  },
];

// =======================================
// 2. RUTAS SIMULADAS
// =======================================

export const mockRoutes = [
  {
    id: "1",
    title: "Ruta 1 - Centro",
    start: "Mercado Central",
    destination: "Paseo Cívico",
    description:
      "Del Mercado Central al Paseo Cívico, por Av. Bolognesi.",
    fare: 2.0,
    distanceKm: 2.4,
    durationMin: 12,
    rating: 5.0,
    category: "Comercial",
    creatorId: "u1",
    creatorName: "Aramis Claros",
    createdAt: "2026-10-01",
    stops: ["Mercado Central", "Av. Bolognesi", "Paseo Cívico"],
  },
  {
    id: "2",
    title: "Conexión Terminal",
    start: "Pocollay",
    destination: "Terminal Terrestre",
    description:
      "Conexión por Av. Celestino Vargas, hospitales y zona comercial.",
    fare: 3.5,
    distanceKm: 8.2,
    durationMin: 31,
    rating: 5.0,
    category: "Transporte",
    creatorId: "u2",
    creatorName: "María Gómez",
    createdAt: "2026-10-02",
    stops: ["Pocollay", "Av. Celestino Vargas", "Terminal Terrestre"],
  },
  {
    id: "3",
    title: "Centro Histórico",
    start: "Alto de la Alianza",
    destination: "Centro de Tacna",
    description:
      "Recorrido hacia el centro histórico y sus principales comercios.",
    fare: 2.5,
    distanceKm: 6.8,
    durationMin: 24,
    rating: 4.8,
    category: "Turística",
    creatorId: "u1",
    creatorName: "Aramis Claros",
    createdAt: "2026-10-03",
    stops: ["Alto de la Alianza", "Av. Bolognesi", "Centro de Tacna"],
  },
  {
    id: "4",
    title: "Ruta Gastronómica",
    start: "Mercado Central",
    destination: "Plaza Zela",
    description:
      "Un recorrido por zonas comerciales y establecimientos gastronómicos.",
    fare: 2.0,
    distanceKm: 3.1,
    durationMin: 16,
    rating: 4.6,
    category: "Gastronómica",
    creatorId: "u3",
    creatorName: "Luis Quispe",
    createdAt: "2026-10-04",
    stops: ["Mercado Central", "Zona comercial", "Plaza Zela"],
  },
];

// Copia interna modificable durante la sesión.
// Los componentes no deben modificar este arreglo directamente.
let routes = copy(mockRoutes);

// =======================================
// 3. API SIMULADA
// =======================================

export const mockApi = {
  // INICIO DE SESIÓN
  async login(email, password) {
    await delay();

    const normalizedEmail = email.trim().toLowerCase();

    const user = mockUsers.find(
      (item) => item.email.toLowerCase() === normalizedEmail
    );

    const credentials = mockCredentials.find(
      (item) => item.userId === user?.id
    );

    if (!user || credentials?.password !== password) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    return copy(user);
    
  },

  
  // REGISTRAR UN USUARIO NUEVO
  async register(name, email, password) {
    await delay();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      throw new Error("Ingresa tu nombre.");
    }

    if (
      mockUsers.some(
        (user) => user.email.toLowerCase() === normalizedEmail
      )
    ) {
      throw new Error("Este correo ya está registrado.");
    }

    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      avatar: "",
      bio: "Descubriendo Tacna, una ruta a la vez.",
      createdRoutes: 0,
      completedTrips: 0,
    };

    mockUsers.push(newUser);

    mockCredentials.push({
      userId: newUser.id,
      password,
    });

    return copy(newUser);
  },


  // OBTENER USUARIOS
  async getUsers() {
    await delay();
    return copy(mockUsers);
  },

  // LEER TODAS LAS RUTAS
  async getRoutes() {
    await delay();
    return copy(routes);
  },

  // LEER UNA RUTA POR SU ID
  async getRouteById(id) {
    await delay();

    const route = routes.find(
      (item) => String(item.id) === String(id)
    );

    if (!route) {
      throw new Error("No se encontró la ruta solicitada.");
    }

    return copy(route);
  },

  // LEER LAS RUTAS DEL USUARIO
  async getMyRoutes(userId) {
    await delay();

    return copy(
      routes.filter((route) => route.creatorId === userId)
    );
  },

  // CREAR UNA RUTA
  async createRoute(data, userId) {
    await delay();

    const creator = mockUsers.find(
      (user) => user.id === userId
    );

    if (!creator) {
      throw new Error("No se encontró al creador de la ruta.");
    }

    const newRoute = {
      id: `r-${Date.now()}`,
      title: data.title?.trim() || "",
      start: data.start?.trim() || "",
      destination: data.destination?.trim() || "",
      description: data.description?.trim() || "",
      fare: Number(data.fare ?? 0),
      distanceKm: Number(data.distanceKm ?? 0),
      durationMin: Number(data.durationMin ?? 0),
      rating: 0,
      category: data.category || "General",
      creatorId: creator.id,
      creatorName: creator.name,
      createdAt: new Date().toISOString(),
      stops: Array.isArray(data.stops) ? data.stops : [],
    };

    routes = [newRoute, ...routes];

    return copy(newRoute);
  },

  // ACTUALIZAR UNA RUTA PROPIA
  async updateRoute(id, data, userId) {
    await delay();

    const index = routes.findIndex(
      (route) => String(route.id) === String(id)
    );

    if (index === -1) {
      throw new Error("No se encontró la ruta.");
    }

    if (routes[index].creatorId !== userId) {
      throw new Error("No puedes editar una ruta de otro usuario.");
    }

    const updatedRoute = {
      ...routes[index],
      ...data,
      id: routes[index].id,
      creatorId: routes[index].creatorId,
      creatorName: routes[index].creatorName,
      updatedAt: new Date().toISOString(),
    };

    routes = routes.map((route, i) =>
      i === index ? updatedRoute : route
    );

    return copy(updatedRoute);
  },

  // ELIMINAR UNA RUTA PROPIA
  async deleteRoute(id, userId) {
    await delay();

    const route = routes.find(
      (item) => String(item.id) === String(id)
    );

    if (!route) {
      throw new Error("No se encontró la ruta.");
    }

    if (route.creatorId !== userId) {
      throw new Error("No puedes eliminar una ruta de otro usuario.");
    }

    routes = routes.filter(
      (item) => String(item.id) !== String(id)
    );

    return { success: true, id };
  },
};
