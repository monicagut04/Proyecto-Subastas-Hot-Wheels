import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { Gavel, Clock, CheckCircle, ChevronRight, Loader2, AlertCircle } from "lucide-react";

export function ListSubastas() {
    const [activas, setActivas] = useState([]);
    const [finalizadas, setFinalizadas] = useState([]);
    const [vistaActual, setVistaActual] = useState('activas'); // 'activas' o 'finalizadas'
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubastas = async () => {
            try {
                // Hacemos ambas peticiones en paralelo para optimizar el rendimiento
                const [resActivas, resFinalizadas] = await Promise.all([
                    SubastaService.getActivas(),
                    SubastaService.getFinalizadas()
                ]);

                if (!resActivas.data.success) throw new Error(resActivas.data.message);
                if (!resFinalizadas.data.success) throw new Error(resFinalizadas.data.message);

                setActivas(resActivas.data.data || []);
                setFinalizadas(resFinalizadas.data.data || []);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubastas();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Cargando sala de subastas...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <p><strong>Error:</strong> {error}</p>
        </div>
    );

    const subastasAMostrar = vistaActual === 'activas' ? activas : finalizadas;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-gray-900">
                    <Gavel className="h-8 w-8 text-purple-600" />
                    Sala de Subastas
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Participa en tiempo real o revisa el historial.</p>
            </div>

            {/* Pestañas de Navegación Nativas */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setVistaActual('activas')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${vistaActual === 'activas' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <Clock className="h-5 w-5" /> Activas ({activas.length})
                </button>
                <button 
                    onClick={() => setVistaActual('finalizadas')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${vistaActual === 'finalizadas' ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <CheckCircle className="h-5 w-5" /> Finalizadas ({finalizadas.length})
                </button>
            </div>

            {/* Grid de Tarjetas */}
            {subastasAMostrar.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                    No hay subastas en esta categoría actualmente.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subastasAMostrar.map((subasta) => (
                        <div key={subasta.id_subasta} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                            
                            {/* Etiqueta de Estado Visual */}
                            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white ${subasta.estado === 'Activa' ? 'bg-green-500' : 'bg-gray-600'}`}>
                                {subasta.estado}
                            </div>

                            <div className="mt-4 mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {subasta.nombre_auto || "Vehículo Desconocido"}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Cierra:</span> {subasta.fecha_fin}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <span className="font-semibold">Total Pujas:</span> 
                                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                                            {subasta.cantidad_pujas}
                                        </span>
                                    </p>
                                    {/* Solo mostramos ganador si está finalizada */}
                                    {vistaActual === 'finalizadas' && (
                                        <p className="text-sm text-gray-600 border-t pt-2 mt-2">
                                            <span className="font-semibold text-gray-800">Ganador:</span> {subasta.ganador}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Link to={`/subasta/detail/${subasta.id_subasta}`}>
                                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold rounded-lg transition-colors">
                                    Ingresar a la sala <ChevronRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}