import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubastaService from '../../services/SubastaService';
import { Gavel, Clock, Tag, UserCircle, ArrowLeft, Loader2, AlertCircle, ImageIcon } from "lucide-react";

export function DetailSubasta() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_URL = import.meta.env.VITE_BASE_URL.replace('api/', 'uploads/');

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                // Traemos el detalle y las pujas al mismo tiempo
                const [resSubasta, resPujas] = await Promise.all([
                    SubastaService.getSubastaById(id),
                    SubastaService.getPujasBySubasta(id)
                ]);

                if (!resSubasta.data.success) throw new Error(resSubasta.data.message);
                
                setSubasta(resSubasta.data.data);
                setPujas(resPujas.data.success ? resPujas.data.data : []);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Conectando con la sala...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <p><strong>Error:</strong> {error}</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Columna Izquierda: Información del Objeto y Subasta */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        {/* Imagen */}
                        <div className="aspect-video w-full bg-gray-100 flex items-center justify-center border-b">
                            {subasta.imagen_objeto ? (
                                <img src={`${IMAGE_URL}${subasta.imagen_objeto}`} alt="Objeto" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="h-20 w-20 text-gray-300" />
                            )}
                        </div>
                        
                        <div className="p-6">
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                                {subasta.nombre_objeto}
                            </h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${subasta.estado === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                    {subasta.estado}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">
                                    Condición: {subasta.condicion_objeto}
                                </span>
                            </div>

                            {/* Datos Financieros */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Precio Base</p>
                                    <p className="text-2xl font-black text-gray-900">${subasta.precio_inicial}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Incremento Mínimo</p>
                                    <p className="text-xl font-bold text-gray-700">${subasta.incremento_minimo}</p>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <span><strong>Inicio:</strong> {subasta.fecha_inicio}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Clock className="h-5 w-5 text-red-400" />
                                    <span><strong>Cierre:</strong> {subasta.fecha_fin}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver a las subastas
                    </button>
                </div>

                {/* Columna Derecha: Historial de Pujas */}
                <div className="w-full lg:w-1/2">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm h-full">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Tag className="h-6 w-6 text-purple-600" />
                                Historial de Pujas
                            </h2>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                                Total: {subasta.cantidad_total_pujas}
                            </span>
                        </div>

                        {pujas.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 italic">
                                Nadie ha pujado en esta subasta aún. ¡Sé el primero!
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
                                {pujas.map((puja, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${idx === 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <UserCircle className={`h-10 w-10 ${idx === 0 ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <div>
                                                <p className="font-bold text-gray-900">{puja.postor}</p>
                                                <p className="text-xs text-gray-500">{puja.fecha_puja}</p>
                                            </div>
                                        </div>
                                        <div className={`text-xl font-black ${idx === 0 ? 'text-purple-700' : 'text-gray-700'}`}>
                                            ${puja.monto}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}