import { Link } from "react-router-dom";
import { Car, Users, Gavel, ArrowRight, Star, Zap, ChevronRight } from "lucide-react";

export function Home() {
    return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-[#000000] text-white overflow-hidden">
        
        {/* --- ELEMENTOS DE FONDO (DECORACIÓN) --- */}
        {/* Resplandor rojo central para dar profundidad */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        {/* Líneas de velocidad decorativas */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="relative z-10 flex flex-col items-center">
            

            {/* Título con Gradiente Agresivo */}
            <div className="text-center mb-12">
                <h1 className="text-7xl md:text-9xl font-[1000] italic uppercase tracking-tighter leading-[0.85] mb-4">
                    SISTEMA DE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 drop-shadow-[0_10px_30px_rgba(220,38,38,0.3)]">
                        SUBASTAS
                    </span>
                </h1>
                <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium tracking-tight">
                    Donde los coleccionistas de verdad compiten por el <span className="text-white italic">Tesoro Escondido</span>.
                </p>
            </div>

            {/* Botón de Acción Principal (CTA) */}
            <Link to="/subasta" className="group relative px-10 py-5 bg-red-600 rounded-2xl font-black uppercase italic tracking-[0.2em] flex items-center gap-4 transition-all hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] mb-20">
                <Zap className="h-5 w-5 fill-white" />
                Iniciar Carrera de Pujas
                <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
        
        {/* --- GRID DE SECCIONES (TARJETAS) --- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            
            {/* Tarjeta Usuarios */}
            <Link to="/user" className="group p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/60 transition-all duration-500 hover:border-blue-500/30">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-zinc-800 group-hover:bg-blue-600 transition-colors duration-500">
                        <Users className="h-8 w-8 text-blue-500 group-hover:text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">USUARIOS</h3>
                <p className="text-sm text-zinc-500 font-medium">Gestiona pilotos y sus estadísticas.</p>
            </Link>
            
            {/* Tarjeta Catálogo */}
            <Link to="/auto" className="group p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/60 transition-all duration-500 hover:border-red-600/30">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-zinc-800 group-hover:bg-red-600 transition-colors duration-500">
                        <Car className="h-8 w-8 text-red-600 group-hover:text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">AUTOS</h3>
                <p className="text-sm text-zinc-500 font-medium">Explora las piezas de metal disponibles.</p>
            </Link>
            
            {/* Tarjeta Subastas */}
            <Link to="/subasta" className="group p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/60 transition-all duration-500 hover:border-yellow-500/30">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-zinc-800 group-hover:bg-yellow-500 transition-colors duration-500">
                        <Gavel className="h-8 w-8 text-yellow-500 group-hover:text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Subastas</h3>
                <p className="text-sm text-zinc-500 font-medium">Control total de las subastas activas.</p>
            </Link>

        </div>

        {/* --- FOOTER DECORATIVO --- */}
        <div className="mt-20 text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] z-10">
            Push the limits of your collection
        </div>
    </div>
    )
}