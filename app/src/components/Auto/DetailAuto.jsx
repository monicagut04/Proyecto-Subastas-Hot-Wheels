import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AutoService from '../../services/AutoService';
import { Car, User, Activity, Calendar, Gavel, ArrowLeft, ChevronRight, ImageIcon, Loader2, AlertCircle, ShieldCheck, Star, Package, Hash, Tag, FileText } from "lucide-react";

export function DetailAuto() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [autoInfo, setAutoInfo] = useState(null); // Cambiamos el nombre para no confundir
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_URL = import.meta.env.VITE_BASE_URL.replace('api/', 'uploads/');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AutoService.getAutoById(id);
                // Según tu Postman, la info real está en response.data.data
                if (response.data && response.data.success) {
                    setAutoInfo(response.data.data);
                } else {
                    setError(response.data?.message || "No se encontró el vehículo");
                }
            } catch (err) {
                setError("Error de conexión con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-400">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-red-600" />
            <p className="text-xl font-medium animate-pulse italic">Cargando especificaciones...</p>
        </div>
    );
    
    if (error || !autoInfo) return (
        <div className="mx-auto max-w-3xl mt-20 p-6 bg-zinc-900 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold">Error: {error || "Vehículo no encontrado"}</p>
        </div>
    );

    // Buscamos la portada dinámicamente
    const portada = autoInfo.imagenes?.find(img => img.es_portada == "1") || autoInfo.imagenes?.[0];

    return (
        <div className="min-h-screen bg-[#000000] text-zinc-100 py-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                    <span className="text-sm font-bold uppercase tracking-widest text-white">Volver al Garaje</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* IZQUIERDA: Imagen y Ficha Técnica */}
                    <div className="w-full lg:w-5/12 space-y-6">
                        <div className="aspect-square w-full bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)] relative group">
                            {portada ? (
                                <img 
                                    src={`${IMAGE_URL}${portada.nombre_imagen}`} 
                                    alt={autoInfo.nombre_modelo} 
                                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
                                />
                            ) : (
                                <ImageIcon className="h-20 w-20 text-zinc-800" />
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                    {autoInfo.rareza || 'BASIC'}
                                </span>
                            </div>
                        </div>

                        {/* MINIATURAS DINÁMICAS */}
                        {autoInfo.imagenes?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {autoInfo.imagenes.map((img, idx) => (
                                    <div key={idx} className="flex-shrink-0 p-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-colors">
                                        <img src={`${IMAGE_URL}${img.nombre_imagen}`} alt="vista" className="h-20 w-20 rounded-lg object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* INFO TÉCNICA DINÁMICA */}
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                                <span className="text-zinc-500 text-[10px] font-black uppercase flex items-center gap-2"><Tag size={12}/> Marca</span>
                                <span className="text-white font-bold">{autoInfo.marca_fabricante}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                                <span className="text-zinc-500 text-[10px] font-black uppercase flex items-center gap-2"><Hash size={12}/> N° Serie</span>
                                <span className="text-white font-mono">{autoInfo.numero_serie || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 text-[10px] font-black uppercase flex items-center gap-2"><Package size={12}/> Empaque</span>
                                <span className="text-yellow-500 font-bold text-xs uppercase tracking-tighter">
                                    {autoInfo.estado_empaque?.replace(/_/g, ' ') || 'SIN ESPECIFICAR'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DERECHA: Datos y Descripción */}
                    <div className="flex-1 space-y-8 w-full">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                {autoInfo.nombre_modelo}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {autoInfo.categorias?.map((cat, idx) => (
                                    <span key={idx} className="px-4 py-1.5 bg-zinc-800/50 text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {cat.nombre_serie}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
                            <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                <FileText size={14} className="text-red-600" /> Descripción Detallada
                            </h4>
                            <p className="text-zinc-300 leading-relaxed italic font-medium">
                                "{autoInfo.descripcion_detallada || 'Sin descripción adicional para este modelo.'}"
                            </p>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-zinc-800 text-red-500 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all"><User className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vendedor</p>
                                        <p className="text-lg font-bold text-zinc-100">{autoInfo.propietario}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-zinc-800 text-red-500 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all"><Activity className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</p>
                                        <p className="text-lg font-bold text-green-500 italic uppercase">
                                            {autoInfo.estado_actual?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* HISTORIAL DE SUBSTAS DINÁMICO */}
                            <div className="mt-12 pt-8 border-t border-zinc-800">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 italic tracking-tighter">
                                    <Gavel className="h-6 w-6 text-red-600" /> SUBSTAS VINCULADAS
                                </h3>
                                
                                {autoInfo.historial_subastas?.length > 0 ? (
                                    <div className="space-y-4">
                                        {autoInfo.historial_subastas.map((sub, idx) => (
                                            <Link key={idx} to={`/subasta/detail/${sub.id_subasta}`} className="block">
                                                <div className="flex items-center justify-between p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl hover:border-red-600 hover:bg-zinc-800 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-red-500 font-bold border border-zinc-700">
                                                            #{sub.id_subasta}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-zinc-100 group-hover:text-red-500 transition-colors italic">Subasta {sub.estado}</p>
                                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">FIN: {sub.fecha_fin}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 p-8 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                                        <ShieldCheck className="h-10 w-10 text-zinc-700" />
                                        <p className="text-zinc-500 italic text-center text-sm font-medium">Este vehículo no tiene subastas registradas actualmente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}