import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AutoService from '../../services/AutoService';
import { Car, User, Activity, Calendar, Gavel, ArrowLeft, ChevronRight, ImageIcon, Loader2, AlertCircle } from "lucide-react";

export function DetailAuto() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [auto, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_URL = import.meta.env.VITE_BASE_URL.replace('api/', 'uploads/');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AutoService.getAutoById(id);
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
            <p className="text-lg font-medium">Cargando detalles del vehículo...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <p><strong>Error:</strong> {error}</p>
        </div>
    );

    const portada = auto.data.imagenes?.find(img => img.es_portada == 1);

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Sección de la Imagen Principal */}
                <div className="w-full md:w-1/3 space-y-4">
                    <div className="aspect-square w-full bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                        {portada ? (
                            <img src={`${IMAGE_URL}${portada.url_imagen}`} alt="Portada" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="h-20 w-20 text-gray-300" />
                        )}
                    </div>
                    {/* Galería (si aplica) */}
                    {auto.data.imagenes?.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {auto.data.imagenes.map((img, idx) => (
                                <img key={idx} src={`${IMAGE_URL}${img.url_imagen}`} alt={`img-${idx}`} className="h-16 w-16 rounded-lg object-cover border border-gray-300 shadow-sm" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de los Detalles */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                            {auto.data.nombre_modelo}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            {auto.data.categorias?.map((cat, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-sm font-medium">
                                    {cat.nombre_serie}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg"><User className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Propietario</p>
                                    <p className="font-bold text-gray-800">{auto.data.propietario}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Activity className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Condición</p>
                                    <p className="font-bold text-gray-800">{auto.data.condicion}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Car className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Estado Actual</p>
                                    <p className="font-bold text-gray-800">{auto.data.estado_actual}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Calendar className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Fecha de Registro</p>
                                    <p className="font-bold text-gray-800">{auto.data.fecha_registro}</p>
                                </div>
                            </div>
                        </div>

                        {/* Historial de Subastas */}
                        <div className="mt-10 border-t border-gray-100 pt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <Gavel className="h-6 w-6 text-red-600" /> Historial de Subastas
                            </h3>
                            
                            {auto.data.historial_subastas?.length > 0 ? (
                                <div className="space-y-3">
                                    {auto.data.historial_subastas.map((sub, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-bold text-gray-800">
                                                    Subasta #{sub.id_subasta}
                                                </p>
                                                <p className="text-sm text-gray-500">Inició: {sub.fecha_inicio}</p>
                                                <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-md ${sub.estado === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                                    {sub.estado}
                                                </span>
                                            </div>
                                            <Link to={`/subasta/detail/${sub.id_subasta}`}>
                                                <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                                    <ChevronRight className="h-5 w-5 text-gray-600" />
                                                </button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    Este objeto aún no ha participado en ninguna subasta.
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <button 
                onClick={() => navigate(-1)} 
                className="mt-8 flex items-center gap-2 px-5 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Regresar al catálogo
            </button>
        </div>
    );
}