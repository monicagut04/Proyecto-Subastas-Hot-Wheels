import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AutoService from '../../services/AutoService';
import { User, Activity, Calendar, Gavel, ArrowLeft, ChevronRight, ImageIcon, Loader2, AlertCircle, ShieldCheck, Star, Package, Hash, Tag, FileText } from "lucide-react";

export function DetailAuto() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [auto, setAuto] = useState(null); // Aquí guardaremos el objeto "data"
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_URL = "/img/"; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AutoService.getAutoById(id);
                
                // VALIDACIÓN CRUCIAL: 
                // Según tu JSON, la info está en response.data.data
                if (response.data && response.data.success) {
                    setAuto(response.data.data); 
                } else {
                    setError(response.data?.message || "No se encontró el auto");
                }
            } catch {
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
            <p className="text-xl font-black italic animate-pulse uppercase">Sincronizando Ficha...</p>
        </div>
    );
    
    if (error || !auto) return (
        <div className="mx-auto max-w-3xl mt-20 p-8 bg-zinc-900 border border-red-900/50 rounded-[2rem] flex items-center gap-4 text-red-400">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold">Error: {error}</p>
        </div>
    );

    // Buscamos la portada en el array de imágenes del JSON
    const portada = auto.imagenes?.find(img => img.es_portada == "1") || auto.imagenes?.[0];

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                    <span className="text-sm font-black uppercase tracking-widest">Volver al Garaje</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* COLUMNA IZQUIERDA: VISUAL */}
                    <div className="w-full lg:w-5/12 space-y-6">
                        <div className="aspect-square bg-zinc-900 rounded-[3rem] border border-zinc-800 flex items-center justify-center p-8 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                            <span className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-4 py-1 rounded-lg uppercase tracking-widest z-10">
                                {auto.rareza}
                            </span>
                            {portada ? (
                                <img src={`${IMAGE_URL}${portada.nombre_imagen}`} alt="Auto" className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
                            ) : (
                                <ImageIcon className="h-20 w-20 text-zinc-800" />
                            )}
                        </div>

                        {/* Ficha Técnica Rápida */}
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] space-y-4 font-medium">
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Fabricante</span>
                                <span className="text-white">{auto.marca_fabricante}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">N° Serie</span>
                                <span className="text-white font-mono">{auto.numero_serie}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Estado Empaque</span>
                                <span className="text-yellow-500 font-bold">{auto.estado_empaque?.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: INFO */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                {auto.nombre_modelo}
                            </h1>
                            <div className="flex gap-2 mt-4">
                                {auto.categorias?.map((cat, idx) => (
                                    <span key={idx} className="px-4 py-1 bg-zinc-800 text-red-500 border border-red-900/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {cat.nombre_serie}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-[2rem]">
                            <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText size={14} className="text-red-600" /> Descripción de la Pieza
                            </h4>
                            <p className="text-zinc-300 leading-relaxed italic">
                                "{auto.descripcion_detallada}"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800">
                                <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Dueño Actual</p>
                                <p className="text-xl font-bold text-white uppercase italic">{auto.propietario}</p>
                            </div>
                            <div className="p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 text-right">
                                <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Estado</p>
                                <p className="text-xl font-bold text-green-500 uppercase italic">{auto.estado_actual?.replace('_', ' ')}</p>
                            </div>
                            <div className="p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 text-right">
                                <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Fecha de Registro</p>
                                <p className="text-xl font-bold text-white uppercase italic">{auto.fecha_registro?.replace('_', ' ')}</p>
                            </div>
                        </div>

                        {/* SUBSTAS */}
                        <div className="pt-8 border-t border-zinc-800">
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 italic">
                                <Gavel className="h-6 w-6 text-red-600" /> HISTORIAL DE EVENTOS
                            </h3>
                            {auto.historial_subastas?.map((sub, idx) => (
                                <div key={idx} className="p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white uppercase tracking-tighter">Subasta #{sub.id_subasta}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold">INICIO: {sub.fecha_inicio}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold">CIERRE: {sub.fecha_fin}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] font-black uppercase">
                                        {sub.estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}