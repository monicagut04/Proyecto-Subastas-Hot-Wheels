import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'auto';

class AutoService {
    // 1. Listado
    getAutos() {
        return axios.get(BASE_URL);
    }

    // 2. Detalle
    getAutoById(AutoId) {
        return axios.get(`${BASE_URL}/${AutoId}`);
    }

    // 3. Crear (CORREGIDO: Soporte para archivos físicos)
    createAuto(formData) {
        return axios.post(BASE_URL, formData);
    }

    // 💡 CAMBIO: Usamos POST y la ruta /update/id
    // AutoService.js
        updateAuto(id, formData) {
            // La ruta debe ser /auto/update/ID
            return axios.post(`${BASE_URL}/update/${id}`, formData);
        }

    // 💡 CAMBIO: Usamos POST y la ruta /delete/id
    deleteAuto(id) {
        return axios.post(`${BASE_URL}/delete/${id}`);
    }

    toggleStatus(id) {
        return axios.get(`${BASE_URL}/toggle/${id}`);
    }
}

export default new AutoService();