import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import { Users, Shield, Activity, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

export function ListUsers() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserService.getUsers();
                setData(response.data);
                if (!response.data.success) {
                    setError(response.data.message);
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Estados de carga y error construidos desde cero
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Cargando usuarios...</p>
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
            {/* Encabezado */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-gray-900">
                    <Users className="h-8 w-8 text-blue-600" />
                    Directorio de Usuarios
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Gestión de participantes del sistema de subastas.
                </p>
            </div>

            {/* Grid de Tarjetas construidas desde cero */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.data.map((user) => (
                    <div key={user.id_usuario} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                        
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{user.nombre_completo}</h3>
                            
                            <div className="flex flex-col gap-3 mb-6">
                                {/* Badge de Rol */}
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-600">Rol:</span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                                        {user.rol}
                                    </span>
                                </div>
                                
                                {/* Badge de Estado */}
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-600">Estado:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Botón personalizado */}
                        <Link to={`/user/detail/${user.id_usuario}`}>
                            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
                                Ver Detalle <ChevronRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}