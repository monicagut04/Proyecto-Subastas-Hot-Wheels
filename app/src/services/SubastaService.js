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
    
    // 1. Obtener solo autos disponibles del vendedor
    getAutosDisponibles(idVendedor) {
        return axios.get(BASE_URL + '/getAutosDisponibles/' + idVendedor);
    }

    // 2. Crear nueva subasta (Borrador)
    createSubasta(data) {
        return axios.post(BASE_URL + '/create', data);
    }
    // Actualizar configuración de la subasta
    updateSubasta(idSubasta, data) {
        return axios.put(BASE_URL + '/update/' + idSubasta, data);
    }

    // 3. Publicar subasta
    publishSubasta(idSubasta) {
        return axios.put(BASE_URL + '/publish/' + idSubasta);
    }

    // 4. Cancelar subasta
    cancelSubasta(idSubasta) {
        return axios.put(BASE_URL + '/cancel/' + idSubasta);
    }
    // Listado de borradores
    getBorradores() {
        return axios.get(BASE_URL + '/borradores');
    }
    // Listado de subastas canceladas
    getCanceladas() {
        return axios.get(BASE_URL + '/canceladas');
    }
}

export default new SubastaService();