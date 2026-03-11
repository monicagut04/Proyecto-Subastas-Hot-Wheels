import axios from 'axios';

// La ruta base debe apuntar al controlador de autos de tu API
const BASE_URL = import.meta.env.VITE_BASE_URL + 'auto';

class AutoService {
  // Obtener todos los autos (Listado)
    getAutos() {
    return axios.get(BASE_URL);
    }
  // Obtener el detalle completo de un auto específico
    getAutoById(AutoId) {
    return axios.get(BASE_URL + '/get/' + AutoId);
    }
}

export default new AutoService();