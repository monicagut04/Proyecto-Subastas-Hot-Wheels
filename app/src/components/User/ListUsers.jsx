import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import { Users, Shield, Activity, ChevronRight, AlertCircle, Loader2, Search, UserCheck } from "lucide-react";

export function ListUsers() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserService.getUsers();
                setData(response.data);
                if (!response.data.success) {
                    setError(response.data.message);
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 bg-black">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-500" />
            <p className="text-xl font-black italic tracking-widest uppercase text-blue-500/80">Sincronizando Base de Datos...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-6 bg-zinc-900 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold italic uppercase font-black tracking-tighter">Fallo de Red: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                
                {/* Encabezado Estilo Terminal */}
                <div className="mb-12 space-y-3 relative">
                    <div className="absolute -left-8 top-0 w-1 h-16 bg-blue-600 hidden md:block" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4 text-white uppercase italic leading-none">
                        <Users className="h-10 w-10 text-blue-500" />
                        Gestión DE <span className="text-blue-500">USUARIOS</span>
                    </h1>
                </div>

                {/* Grid de Tarjetas de Perfil */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {data.data.map((user) => (
                        <div key={user.id_usuario} className="group relative bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl hover:border-blue-500/50 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                            
                            {/* Glow de fondo al hacer hover */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-zinc-800 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <UserCheck className="h-6 w-6" />
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        user.estado === 'Activo' 
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                        : 'bg-red-500/10 text-red-500 border-red-500/30'
                                    }`}>
                                        {user.estado}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-tight">
                                    {user.nombre_completo}
                                </h3>
                                
                                <div className="space-y-3 mb-10">
                                    {/* Badge de Rol con Icono */}
                                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-800/50">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Shield className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Rol</span>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-200 italic">
                                            {user.rol}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Botón Estilo "Acceso Concedido" */}
                            <Link to={`/user/detail/${user.id_usuario}`} className="relative z-10">
                                <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-white font-black rounded-2xl transition-all duration-300 uppercase italic tracking-tighter text-sm border border-zinc-700 hover:border-blue-400 shadow-lg group/btn">
                                    Ver Detalle Usuario <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}