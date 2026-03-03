import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';

class SubastaService {
    // Listado de subastas activas
    getActivas() {
        return axios.get(BASE_URL + '');
    }
    
    // Listado de subastas finalizadas
    getFinalizadas() {
        return axios.get(BASE_URL + '/finalizadas');
    }
    
    // Detalle completo de una subasta específica
    getSubastaById(id) {
        return axios.get(BASE_URL + '/get/' + id);
    }

    // Historial de pujas de una subasta
    getPujasBySubasta(id) {
        return axios.get(BASE_URL + '/pujas/' + id);
    }
}

export default new SubastaService();