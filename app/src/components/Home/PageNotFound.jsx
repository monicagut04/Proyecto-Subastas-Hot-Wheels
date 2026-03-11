import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            {/* Ícono nativo en lugar de una imagen JPG externa */}
            <AlertTriangle className="h-24 w-24 text-red-500 mb-6" />
            
            <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">
                404
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Página no encontrada
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                Lo sentimos, la ruta que estás buscando no existe o ha sido movida dentro del sistema de subastas.
            </p>
            
            {/* Botón creado 100% con Tailwind, sin depender de librerías UI */}
            <Link 
                to="/" 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
                <ArrowLeft className="h-5 w-5" />
                Volver al Inicio
            </Link>
        </div>
    );
}