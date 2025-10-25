/**
 * Cinema REST API Client
 * Base URL: http://localhost:8000/api/v1
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo en tu proyecto (ej: src/api/client.ts)
 * 2. Importa las funciones: import { peliculas, auth, salas } from './api/client'
 * 3. Usa: const movies = await peliculas.getAll()
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface Pelicula {
  id_pelicula: string;
  titulo: string;
  genero: string | null;
  descripcion: string | null;
  clasificacion: string | null;
}

export interface Sala {
  id_sala: string;
  nombre: string;
  capacidad: number | null;
  tipo: string | null;
  estado: string | null;
}

export interface Funcion {
  id_funcion: string;
  fecha_hora: string;
  precio: number | null;
  id_pelicula: string | null;
  id_sala: string | null;
}

export interface Asiento {
  id_asiento: string;
  numero: number;
  estado: string | null;
  id_sala: string | null;
}

export interface Reserva {
  id_reserva: string;
  cantidad_asientos: number;
  estado: string | null;
  id_funcion: string | null;
  id_usuario: string | null;
}

export interface Factura {
  id_factura: string;
  fecha_emision: string;
  total: number | null;
  metodo_pago: string | null;
  id_reserva: string | null;
}

export interface Incidencia {
  id_incidencia: string;
  fecha_generacion: string;
  id_usuario: string | null;
}

export interface Usuario {
  id_usuario: string;
  nombre: string;
  correo: string | null;
  rol: string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ============================================
// HELPER: Manejo de respuestas
// ============================================

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
};

// ============================================
// HELPER: Obtener token del localStorage
// ============================================

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============================================
// 🔐 AUTENTICACIÓN
// ============================================

export const auth = {
  /**
   * Registrar nuevo usuario
   * POST /api/v1/auth/register
   */
  register: async (data: {
    nombre: string;
    correo: string;
    password: string;
    rol?: string;
  }): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  /**
   * Iniciar sesión (JSON)
   * POST /api/v1/auth/login-json
   */
  login: async (correo: string, password: string): Promise<Token> => {
    const response = await fetch(`${API_BASE_URL}/auth/login-json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });
    const data = await handleResponse(response);
    
    // Guardar token automáticamente
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  },

  /**
   * Cerrar sesión (local)
   */
  logout: () => {
    localStorage.removeItem('token');
  }
};

// ============================================
// 🎬 PELÍCULAS
// ============================================

export const peliculas = {
  /**
   * Obtener todas las películas
   * GET /api/v1/peliculas
   */
  getAll: async (skip = 0, limit = 100): Promise<Pelicula[]> => {
    const response = await fetch(`${API_BASE_URL}/peliculas?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  /**
   * Obtener película por ID
   * GET /api/v1/peliculas/{id}
   */
  getById: async (id: string): Promise<Pelicula> => {
    const response = await fetch(`${API_BASE_URL}/peliculas/${id}`);
    return handleResponse(response);
  },

  /**
   * Crear película
   * POST /api/v1/peliculas
   */
  create: async (data: Omit<Pelicula, 'id_pelicula'>): Promise<Pelicula> => {
    const response = await fetch(`${API_BASE_URL}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  /**
   * Actualizar película
   * PUT /api/v1/peliculas/{id}
   */
  update: async (id: string, data: Partial<Omit<Pelicula, 'id_pelicula'>>): Promise<Pelicula> => {
    const response = await fetch(`${API_BASE_URL}/peliculas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  /**
   * Eliminar película
   * DELETE /api/v1/peliculas/{id}
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/peliculas/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// 🏢 SALAS
// ============================================

export const salas = {
  getAll: async (skip = 0, limit = 100): Promise<Sala[]> => {
    const response = await fetch(`${API_BASE_URL}/salas?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Sala> => {
    const response = await fetch(`${API_BASE_URL}/salas/${id}`);
    return handleResponse(response);
  },

  create: async (data: Omit<Sala, 'id_sala'>): Promise<Sala> => {
    const response = await fetch(`${API_BASE_URL}/salas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: string, data: Partial<Omit<Sala, 'id_sala'>>): Promise<Sala> => {
    const response = await fetch(`${API_BASE_URL}/salas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/salas/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// 📅 FUNCIONES
// ============================================

export const funciones = {
  getAll: async (skip = 0, limit = 100): Promise<Funcion[]> => {
    const response = await fetch(`${API_BASE_URL}/funciones?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Funcion> => {
    const response = await fetch(`${API_BASE_URL}/funciones/${id}`);
    return handleResponse(response);
  },

  create: async (data: Omit<Funcion, 'id_funcion'>): Promise<Funcion> => {
    const response = await fetch(`${API_BASE_URL}/funciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: string, data: Partial<Omit<Funcion, 'id_funcion'>>): Promise<Funcion> => {
    const response = await fetch(`${API_BASE_URL}/funciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/funciones/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// 💺 ASIENTOS
// ============================================

export const asientos = {
  getAll: async (skip = 0, limit = 100): Promise<Asiento[]> => {
    const response = await fetch(`${API_BASE_URL}/asientos?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Asiento> => {
    const response = await fetch(`${API_BASE_URL}/asientos/${id}`);
    return handleResponse(response);
  },

  create: async (data: Omit<Asiento, 'id_asiento'>): Promise<Asiento> => {
    const response = await fetch(`${API_BASE_URL}/asientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: string, data: Partial<Omit<Asiento, 'id_asiento'>>): Promise<Asiento> => {
    const response = await fetch(`${API_BASE_URL}/asientos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/asientos/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// 🎫 RESERVAS
// ============================================

export const reservas = {
  getAll: async (skip = 0, limit = 100): Promise<Reserva[]> => {
    const response = await fetch(`${API_BASE_URL}/reservas?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Reserva> => {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}`);
    return handleResponse(response);
  },

  create: async (data: Omit<Reserva, 'id_reserva'>): Promise<Reserva> => {
    const response = await fetch(`${API_BASE_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: string, data: Partial<Omit<Reserva, 'id_reserva'>>): Promise<Reserva> => {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// 🧾 FACTURAS
// ============================================

export const facturas = {
  getAll: async (skip = 0, limit = 100): Promise<Factura[]> => {
    const response = await fetch(`${API_BASE_URL}/facturas?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Factura> => {
    const response = await fetch(`${API_BASE_URL}/facturas/${id}`);
    return handleResponse(response);
  },

  create: async (data: Omit<Factura, 'id_factura'>): Promise<Factura> => {
    const response = await fetch(`${API_BASE_URL}/facturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: string, data: Partial<Omit<Factura, 'id_factura'>>): Promise<Factura> => {
    const response = await fetch(`${API_BASE_URL}/facturas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/facturas/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// ⚠️ INCIDENCIAS
// ============================================

export const incidencias = {
  getAll: async (skip = 0, limit = 100): Promise<Incidencia[]> => {
    const response = await fetch(`${API_BASE_URL}/incidencias?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Incidencia> => {
    const response = await fetch(`${API_BASE_URL}/incidencias/${id}`);
    return handleResponse(response);
  },

  create: async (data: Omit<Incidencia, 'id_incidencia'>): Promise<Incidencia> => {
    const response = await fetch(`${API_BASE_URL}/incidencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: string, data: Partial<Omit<Incidencia, 'id_incidencia'>>): Promise<Incidencia> => {
    const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ============================================
// 👥 USUARIOS (requieren autenticación)
// ============================================

export const usuarios = {
  /**
   * Obtener todos los usuarios (requiere auth)
   * GET /api/v1/usuarios
   */
  getAll: async (skip = 0, limit = 100): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/usuarios?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Obtener perfil del usuario actual
   * GET /api/v1/usuarios/me
   */
  getMe: async (): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Obtener usuario por ID
   * GET /api/v1/usuarios/{id}
   */
  getById: async (id: string): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Actualizar usuario
   * PUT /api/v1/usuarios/{id}
   */
  update: async (id: string, data: Partial<Omit<Usuario, 'id_usuario'>>): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  /**
   * Eliminar usuario
   * DELETE /api/v1/usuarios/{id}
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ============================================
// EJEMPLO DE USO
// ============================================

/*
// Login
const token = await auth.login('admin@cinema.com', 'admin123');

// Obtener películas
const movies = await peliculas.getAll();

// Crear película
const newMovie = await peliculas.create({
  titulo: "Inception",
  genero: "Sci-Fi",
  descripcion: "A thief who steals corporate secrets...",
  clasificacion: "PG-13"
});

// Actualizar película
await peliculas.update(newMovie.id_pelicula, {
  titulo: "Inception - Director's Cut"
});

// Eliminar película
await peliculas.delete(newMovie.id_pelicula);

// Obtener usuario actual (requiere auth)
const user = await usuarios.getMe();
*/