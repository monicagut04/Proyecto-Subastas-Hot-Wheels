import { Link } from "react-router-dom";
import { Car, Users, Gavel } from "lucide-react";

export function Home() {
    return (
    <div className="max-w-5xl mx-auto py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900">
            Bienvenido a <span className="text-primary">HotWheels Auction</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            El sistema profesional de gestión de subastas para vehículos a escala. 
            Selecciona un módulo para comenzar.
        </p>
        
        {/* Tarjetas de acceso rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/user" className="flex flex-col items-center gap-4 p-8 bg-white border rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Users className="h-12 w-12 text-blue-500" />
                <span className="font-bold text-xl text-gray-800">Módulo de Usuarios</span>
                <p className="text-sm text-muted-foreground">Gestiona los compradores y vendedores.</p>
            </Link>
            
            <Link to="/auto" className="flex flex-col items-center gap-4 p-8 bg-white border rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Car className="h-12 w-12 text-red-500" />
                <span className="font-bold text-xl text-gray-800">Catálogo de Autos</span>
                <p className="text-sm text-muted-foreground">Explora los objetos subastables y sus detalles.</p>
            </Link>
            
            <Link to="/subasta" className="flex flex-col items-center gap-4 p-8 bg-white border rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Gavel className="h-12 w-12 text-purple-500" />
                <span className="font-bold text-xl text-gray-800">Gestión de Subastas</span>
                <p className="text-sm text-muted-foreground">Visualiza subastas activas y el historial de pujas.</p>
            </Link>
        </div>
    </div>
    )
}