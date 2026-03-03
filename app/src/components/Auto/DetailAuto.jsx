import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AutoService from '../../services/AutoService';
import { Car, User, Activity, Calendar, Gavel, ArrowLeft, ChevronRight, ImageIcon, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-400">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-red-600" />
            <p className="text-xl font-medium animate-pulse italic">Cargando especificaciones...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-20 p-6 bg-zinc-900 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold">Error: {error}</p>
        </div>
    );

    const portada = auto.data.imagenes?.find(img => img.es_portada == 1);

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Botón Regresar con estilo sutil */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                    <span className="text-sm font-bold uppercase tracking-widest">Volver al Garaje</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* IZQUIERDA: Galería de Imágenes Estilo Museo */}
                    <div className="w-full lg:w-5/12 space-y-6">
                        <div className="aspect-square w-full bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {portada ? (
                                <img src={`${IMAGE_URL}${portada.url_imagen}`} alt="Portada" className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <ImageIcon className="h-20 w-20 text-zinc-800" />
                            )}
                        </div>

                        {/* Miniaturas con borde de neón al seleccionar */}
                        {auto.data.imagenes?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {auto.data.imagenes.map((img, idx) => (
                                    <div key={idx} className="flex-shrink-0 p-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-colors cursor-pointer">
                                        <img src={`${IMAGE_URL}${img.url_imagen}`} alt={`img-${idx}`} className="h-20 w-20 rounded-lg object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DERECHA: Información y Acción */}
                    <div className="flex-1 space-y-8 w-full">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-tighter rounded">Exclusive Item</span>
                                <span className="text-zinc-500 text-sm font-mono italic">REF: #00{id}</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic italic">
                                {auto.data.nombre_modelo}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {auto.data.categorias?.map((cat, idx) => (
                                    <span key={idx} className="px-4 py-1.5 bg-zinc-800/50 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-black uppercase tracking-wider">
                                        {cat.nombre_serie}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Panel de Datos con Grid */}
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-zinc-800 text-red-500 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all"><User className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Propietario</p>
                                        <p className="text-lg font-bold text-zinc-100">{auto.data.propietario}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-zinc-800 text-red-500 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all"><Activity className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Condición</p>
                                        <p className="text-lg font-bold text-zinc-100">{auto.data.condicion}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-zinc-800 text-red-500 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all"><Car className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</p>
                                        <p className="text-lg font-bold text-green-500">{auto.data.estado_actual}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-zinc-800 text-red-500 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all"><Calendar className="h-6 w-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Registrado</p>
                                        <p className="text-lg font-bold text-zinc-100">{auto.data.fecha_registro}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Historial de Subastas Estilizado */}
                            <div className="mt-12 pt-8 border-t border-zinc-800">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 italic">
                                    <Gavel className="h-6 w-6 text-red-600" /> HISTORIAL DE PUJAS
                                </h3>
                                
                                {auto.data.historial_subastas?.length > 0 ? (
                                    <div className="space-y-4">
                                        {auto.data.historial_subastas.map((sub, idx) => (
                                            <Link key={idx} to={`/subasta/detail/${sub.id_subasta}`} className="block">
                                                <div className="flex items-center justify-between p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl hover:border-red-600 hover:bg-zinc-800 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-red-500 font-bold border border-zinc-700 underline">
                                                            #{sub.id_subasta}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-zinc-100 group-hover:text-red-500 transition-colors">Subasta Oficial</p>
                                                            <p className="text-xs text-zinc-500 uppercase tracking-tighter">Inició: {sub.fecha_inicio}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`hidden sm:inline-block px-3 py-1 text-[10px] font-black rounded-full border ${sub.estado === 'Activa' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-700 text-zinc-400 border-zinc-600'}`}>
                                                            {sub.estado}
                                                        </span>
                                                        <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 p-8 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                                        <ShieldCheck className="h-10 w-10 text-zinc-700" />
                                        <p className="text-zinc-500 italic text-center text-sm font-medium">
                                            Este objeto es nuevo en la colección y espera su primera subasta.
                                        </p>
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