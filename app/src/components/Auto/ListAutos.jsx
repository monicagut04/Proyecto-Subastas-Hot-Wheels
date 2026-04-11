import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import AutoService from "../../services/AutoService";
import { User, ImageIcon, ChevronRight, Loader2, AlertCircle, Sparkles, Pencil, Trash2, Plus, RefreshCw, PowerOff } from "lucide-react"; 
import toast from "react-hot-toast";

export function ListAutos() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    const IMAGE_URL = "http://localhost:81/Proyecto-Subastas-Hot-Wheels/uploads/"; 

    const fetchData = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggle = async (id) => {
        try {
            await AutoService.toggleStatus(id);
            toast.success("Estado de la pieza actualizado con éxito");
            fetchData(); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al cambiar el estado");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de quitar esta pieza del catálogo?")) return;
        
        try {
            await AutoService.deleteAuto(id);
            toast.success("Pieza quitada del inventario");
            fetchData(); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al procesar");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 bg-black">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <p className="text-xl font-black italic tracking-widest uppercase animate-pulse text-zinc-500">Calentando motores...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-20 p-8 bg-zinc-900/50 border border-red-900/30 rounded-[2rem] flex items-center gap-6 text-red-400 backdrop-blur-xl shadow-2xl">
            <AlertCircle className="h-10 w-10 text-red-600 shrink-0" />
            <div>
                <h2 className="font-black uppercase italic tracking-tighter text-xl text-white">Fallo en el Radar</h2>
                <p className="text-zinc-500 font-medium">{error}</p>
            </div>
        </div>
    );

    const autos = data?.data ? (Array.isArray(data.data) ? data.data : [data.data]) : [];

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-12">
            <div className="mx-auto max-w-7xl">
                
                <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                    <div className="space-y-4">
                        <div className="absolute -left-10 top-0 w-24 h-24 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Sparkles className="h-3 w-3 animate-pulse" /> Inventario Oficial
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter flex items-center gap-4 text-white uppercase italic leading-none">
                            Garaje <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">HOT WHEELS</span>
                        </h1>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/auto/create')}
                        className="flex items-center gap-3 bg-red-600 hover:bg-white text-white hover:text-black px-8 py-4 rounded-2xl font-black uppercase italic transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] text-sm"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Registrar Nueva Pieza</span>
                    </button>
                </div>

                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
{autos.map((auto) => {
                        const estadoActual = String(auto.estado_actual).toUpperCase();
                        const isDisponible = estadoActual === 'DISPONIBLE';
                        // Nueva lógica visual: Capturamos el nuevo estado
                        const isDesactivado = estadoActual === 'DESACTIVADO';

                        return (
                            <div key={auto.id_auto} className={`group relative border rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col shadow-2xl ${
                                isDesactivado ? 'bg-zinc-950/80 border-yellow-900/30 opacity-70 grayscale-50' : 'bg-zinc-900/30 border-zinc-800 hover:border-red-600/40 hover:bg-zinc-900/60 hover:-translate-y-2'
                            }`}>
                                
                                <div className="absolute top-5 right-5 z-20">
                                    {/* Etiqueta Visual de Estado */}
                                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border flex items-center gap-1 ${
                                        isDisponible ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                        : isDesactivado ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
                                        : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                                    }`}>
                                        {isDesactivado && <PowerOff className="h-3 w-3" />}
                                        {auto.estado_actual}
                                    </div>
                                </div>

                                <div className="aspect-4/3 w-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-80" />
                                    {auto.imagen_principal ? (
                                        <img 
                                            src={`${IMAGE_URL}${auto.imagen_principal}`} 
                                            alt={auto.nombre_modelo}
                                            className={`w-full h-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110`}
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Hot+Wheels"; }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <ImageIcon className="h-16 w-16 text-zinc-400" />
                                            <span className="text-[10px] font-black uppercase italic">Sin Imagen</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-6">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDesactivado ? 'text-zinc-500' : 'text-red-500'}`}>{auto.rareza || 'MAINLINE'}</p>
                                        <h3 className={`text-2xl font-black uppercase italic leading-tight tracking-tighter ${isDesactivado ? 'text-zinc-400' : 'text-white group-hover:text-red-500 transition-colors'}`}>
                                            {auto.nombre_modelo}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col gap-2 mb-6">
                                        <div className="flex gap-2">
                                            {/* El botón de editar siempre está activo a menos que esté en subasta */}
                                            <button 
                                                onClick={() => navigate(`/auto/update/${auto.id_auto}`)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all bg-zinc-800 text-white hover:bg-white hover:text-black border border-zinc-700`}
                                            >
                                                <Pencil className="h-3.5 w-3.5" /> Editar
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleToggle(auto.id_auto)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${isDesactivado ? 'bg-yellow-900/20 text-yellow-500 hover:bg-yellow-600 hover:text-black border-yellow-900/30' : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-100 hover:text-black border-zinc-800'}`}
                                            >
                                                <RefreshCw className={`h-3.5 w-3.5 ${isDesactivado ? 'animate-spin-slow' : ''}`} /> Estado
                                            </button>
                                        </div>
                                        
                                        {/* Botón de Eliminación (Envía a INACTIVO y desaparece del grid) */}
                                        <button 
                                            onClick={() => handleDelete(auto.id_auto)}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all border bg-red-900/10 text-red-500 hover:bg-red-600 hover:text-white border-red-900/20"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Eliminar Pieza
                                        </button>
                                    </div>
                                    
                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-zinc-800/50">
                                            <div className="h-8 w-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-zinc-500 uppercase font-black tracking-tighter">Propietario</span>
                                                <span className="text-xs text-zinc-400 font-bold italic truncate w-28">{auto.vendedor_nombre}</span>
                                            </div>
                                        </div>
                                        
                                        <Link to={`/auto/detail/${auto.id_auto}`} className="block">
                                            <button className="w-full group/btn flex items-center justify-center gap-3 py-4 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white font-black rounded-2xl transition-all duration-300 uppercase italic tracking-tighter text-sm border border-zinc-800">
                                                <span>Ver Ficha Técnica</span>
                                                <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </div> 
                            </div> 
                        );
                    })}
                </div>
            </div>
        </div>
    );
}