import axios from 'axios';

// Apunta directamente al controlador de Pujas que creamos en el backend
const BASE_URL = import.meta.env.VITE_BASE_URL + 'puja';

class PujaService {
    /**
     * Registra una nueva puja en la base de datos
     * @param {Object} data - { id_subasta, id_usuario, monto_ofertado }
     */
    createPuja(data) {
        return axios.post(BASE_URL + '/create', data);
    }
}

export default new PujaService();