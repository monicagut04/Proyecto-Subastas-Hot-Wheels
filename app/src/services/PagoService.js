import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'pago';

class PagoService {
    getPagosByUsuario(idUsuario) {
        return axios.get(`${BASE_URL}/getByUsuario/${idUsuario}`);
    }

    confirmarPago(idPago) {
        return axios.post(`${BASE_URL}/confirmar/${idPago}`);
    }
}

export default new PagoService();