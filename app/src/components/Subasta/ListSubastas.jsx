import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { Gavel, Clock, CheckCircle, ChevronRight, Loader2, AlertCircle, TrendingUp, History } from "lucide-react";

export function ListSubastas() {
    const [activas, setActivas] = useState([]);
    const [finalizadas, setFinalizadas] = useState([]);
    const [vistaActual, setVistaActual] = useState('activas'); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubastas = async () => {
            try {
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 bg-black">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-red-600" />
            <p className="text-xl font-black italic tracking-widest uppercase">Escaneando Subastas...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-6 bg-zinc-900 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold italic uppercase font-black tracking-tighter">Error de Radar: {error}</p>
        </div>
    );

    const subastasAMostrar = vistaActual === 'activas' ? activas : finalizadas;

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                
                {/* Encabezado Principal */}
                <div className="mb-10 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4 text-white uppercase italic">
                        <Gavel className="h-10 w-10 text-red-600" />
                        HISTORIAL DE <span className="text-red-600">SUBASTAS</span>
                    </h1>
                </div>

                {/* Selector de Vista Estilo Dashboard */}
                <div className="flex p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl w-fit mb-12 backdrop-blur-sm">
                    <button 
                        onClick={() => setVistaActual('activas')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black uppercase italic tracking-widest text-xs transition-all duration-300 ${
                            vistaActual === 'activas' 
                            ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                    >
                        <TrendingUp className="h-4 w-4" /> ACTIVAS ({activas.length})
                    </button>
                    <button 
                        onClick={() => setVistaActual('finalizadas')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black uppercase italic tracking-widest text-xs transition-all duration-300 ${
                            vistaActual === 'finalizadas' 
                            ? 'bg-zinc-700 text-white shadow-lg' 
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                    >
                        <History className="h-4 w-4" /> FINALIZADAS ({finalizadas.length})
                    </button>
                </div>

                {/* Grid de Subastas */}
                {subastasAMostrar.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-[2rem] border-2 border-dashed border-zinc-800 text-zinc-600">
                        <Gavel className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="text-xl font-black uppercase italic tracking-tighter">No hay subastas disponibles</p>
                        <p className="text-sm mt-2">Vuelve pronto para ver nuevas piezas.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {subastasAMostrar.map((subasta) => (
                            <div key={subasta.id_subasta} className="group relative bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl hover:border-red-600/50 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                                {/* Etiqueta de Estado */}
                                {vistaActual === 'finalizadas' && (
                                <div className={`inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border self-start ${
                                    subasta.estado === 'ACTIVA' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${subasta.estado === 'Activa' ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'}`} />
                                    {subasta.estado}
                                </div>)}

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">
                                        {subasta.nombre_auto || "Vehículo Desconocido"}
                                    </h3>
                                    
                                    <div className="space-y-4 mb-8">

                                        {vistaActual === 'activas' && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-500 font-bold uppercase tracking-widest">Inicio de Subasta</span>
                                            <span className="text-zinc-300 font-mono bg-zinc-800/50 px-2 py-1 rounded">{subasta.fecha_inicio}</span>
                                        </div>
                                        )}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-500 font-bold uppercase tracking-widest">Cierre de Subasta</span>
                                            <span className="text-zinc-300 font-mono bg-zinc-800/50 px-2 py-1 rounded">{subasta.fecha_fin}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Precio Base</span>
                                            <span className="rounded-lg text-sm font-black">
                                            {subasta.precio_base}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between -800 pt-4">
                                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Pujas Realizadas</span>
                                            <span className="bg-red-600/10 text-red-500 px-3 py-1 rounded-lg text-sm font-black border border-red-600/20">
                                                {subasta.cantidad_pujas} PUJAS
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link to={`/subasta/detail/${subasta.id_subasta}`} className="relative z-10">
                                    <button className="w-full group/btn flex items-center justify-center gap-3 py-4 px-6 bg-white text-black hover:bg-red-600 hover:text-white font-black rounded-2xl transition-all duration-300 uppercase italic tracking-tighter shadow-lg">
                                        Entrar a la Sala <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}