import { useState } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";

export function AuthProvider({ children }) {
    // 🌟 LA VARIABLE LÓGICA SIMULADA 🌟
    // Aquí definimos (hardcodeamos internamente) quién es el usuario que está "usando" el sistema.
    // Asumimos que tú (ID: 2) eres el vendedor que está operando la aplicación.
    const [currentUser] = useState({
        id_usuario: 2,
        nombre_completo: "Andrey Vendedor",
        correo_electronico: "vendedor@hw.com",
        rol: "VENDEDOR"
    });

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};