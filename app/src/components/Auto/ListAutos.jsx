import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AutoService from "../../services/AutoService";
import { Car, User, Activity, ImageIcon, ChevronRight, Loader2, AlertCircle } from "lucide-react";

export function ListAutos() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_URL = import.meta.env.VITE_BASE_URL.replace('api/', 'uploads/');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AutoService.getAutos();
                setData(response.data);
                if (!response.data.success) setError(response.data.message);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Cargando catálogo de vehículos...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <p><strong>Error:</strong> {error}</p>
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-gray-900">
                    <Car className="h-8 w-8 text-red-600" />
                    Catálogo de Vehículos
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Explora los objetos disponibles para subasta.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {data.data.map((auto) => (
                    <div key={auto.id_auto} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        
                        {/* Imagen Principal */}
                        <div className="aspect-4/3 w-full bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-200">
                            {auto.imagen_principal ? (
                                <img 
                                    src={`${IMAGE_URL}${auto.imagen_principal}`} 
                                    alt={auto.nombre_modelo}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            ) : (
                                <ImageIcon className="h-12 w-12 text-gray-300" />
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-800 line-clamp-1" title={auto.nombre_modelo}>
                                    {auto.nombre_modelo}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="truncate font-medium">{auto.propietario}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-gray-400" />
                                    <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-xs font-bold">
                                        {auto.estado_actual}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Botón nativo */}
                            <Link to={`/auto/detail/${auto.id_auto}`}>
                                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
                                    Ver Detalles <ChevronRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}