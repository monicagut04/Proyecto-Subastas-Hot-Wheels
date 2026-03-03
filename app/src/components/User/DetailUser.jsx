import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import { 
    UserCircle, Shield, Activity, Calendar, TrendingUp, ArrowLeft, Loader2, AlertCircle 
} from "lucide-react";

export function DetailUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserService.getUserById(id);
                setData(response.data);
                if (!response.data.success) setError(response.data.message);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Cargando perfil...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <p><strong>Error:</strong> {error}</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Sección lateral (Avatar construido con Tailwind) */}
                <div className="w-full md:w-1/4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8">
                    <UserCircle className="h-32 w-32 text-gray-400 mb-4" />
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${user.data.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.data.estado}
                    </span>
                </div>

                {/* Sección central (Detalles) */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                            {user.data.nombre_completo}
                        </h1>
                        <p className="text-gray-500 text-lg mt-2">Perfil de Sistema</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        
                        {/* Información General */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Shield className="h-6 w-6" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Rol del Usuario</p>
                                    <p className="text-lg font-bold text-gray-800">{user.data.rol}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="h-6 w-6" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Fecha de Registro</p>
                                    <p className="text-lg font-bold text-gray-800">{user.data.fecha_registro}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actividad Calculada */}
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" /> Resumen de Actividad
                            </h3>
                            
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                <span className="text-6xl font-black text-blue-700 mb-2">
                                    {user.data.total_actividad}
                                </span>
                                <span className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                                    {user.data.tipo_actividad}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Botón de regreso nativo */}
            <button 
                onClick={() => navigate(-1)}
                className="mt-10 flex items-center gap-2 px-5 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Regresar al listado
            </button>
        </div>
    );
}