import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AutoService from '../../services/AutoService';
import { User, Activity, ChevronLeft, Gavel, ArrowLeft, ChevronRight, ImageIcon, Loader2, AlertCircle, ShieldCheck, Star, Package, Hash, Tag, FileText } from "lucide-react";

export function DetailAuto() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [auto, setAuto] = useState(null); // Aquí guardaremos el objeto "data"
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const IMAGE_URL = "/img/"; 

    // 1. Extraemos las imágenes
    const imagenesRaw = auto?.imagenes || [];

    // 2. Algoritmo de reordenamiento (Clean Code)
    // Encontramos la imagen que está marcada como portada
    const imagenPortada = imagenesRaw.find(img => img.es_portada == "1");
    // Filtramos todas las demás que NO son la portada
    const imagenesSecundarias = imagenesRaw.filter(img => img.es_portada != "1");
    
    // 3. Ensamblamos el arreglo final forzando la portada en el índice [0]
    const imagenes = imagenPortada ? [imagenPortada, ...imagenesSecundarias] : imagenesSecundarias;

    // Temporizador de Autoplay (5 segundos)
    useEffect(() => {
        if (imagenes.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => 
                prev === imagenes.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [imagenes.length]);

    // Controles manuales
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };
    // ==========================================

    

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
                                                {/* ================= CARRUSEL VISUAL ================= */}
                        <div className="relative w-full aspect-square md:aspect-square lg:aspect-square bg-zinc-900/80 rounded-[2.5rem] overflow-hidden group border border-zinc-800 shadow-2xl flex items-center justify-center">
                                                        <span className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-4 py-1 rounded-lg uppercase tracking-widest z-10">
                                {auto.rareza}
                            </span>
                            {/* Contenedor de la Imagen Actual */}
                            {imagenes.length > 0 ? (
                                <img 
                                    src={`${IMAGE_URL}${imagenes[currentImageIndex].nombre_imagen}`} 
                                    alt="Vista del Auto" 
                                    className="w-full h-full object-contain p-4 transition-opacity duration-500 ease-in-out"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500">
                                    <span className="uppercase italic font-black text-sm tracking-widest">
                                        Sin imágenes registradas
                                    </span>
                                </div>
                            )}

                            {/* Controles de Navegación (Solo si hay más de 1 imagen) */}
                            {imagenes.length > 1 && (
                                <>
                                    {/* Flecha Izquierda */}
                                    <button 
                                        onClick={prevImage} 
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 backdrop-blur-sm border border-zinc-700/50"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>

                                    {/* Flecha Derecha */}
                                    <button 
                                        onClick={nextImage} 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 backdrop-blur-sm border border-zinc-700/50"
                                        aria-label="Siguiente imagen"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>

                                    {/* Indicadores de Posición (Puntos Inferiores) */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-800/50">
                                        {imagenes.map((_, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => goToImage(idx)}
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    idx === currentImageIndex 
                                                    ? 'w-8 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' 
                                                    : 'w-2 bg-zinc-500 hover:bg-zinc-300'
                                                }`}
                                                aria-label={`Ir a imagen ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {/* ================= FIN DEL CARRUSEL ================= */}

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