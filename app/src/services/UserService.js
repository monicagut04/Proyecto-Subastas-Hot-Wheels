import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class UserService {
  // Obtener todos los usuarios
  getUsers() {
    return axios.get(BASE_URL);
  }
  
  // Obtener detalle de un usuario (¡Ajustado a tu API de PHP!)
  getUserById(UserId) {
    return axios.get(BASE_URL + '/get/' + UserId);
  }
}

export default new UserService();