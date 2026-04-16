import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubastaService from '../../services/SubastaService';
import PujaService from '../../services/PujaService'; // 🌟 NUEVO: Servicio de Pujas
import { usePusherSubasta } from '../../hooks/usePusherSubasta'; // 🌟 NUEVO: Hook de tiempo real
import { formatDistanceToNow, isPast, format } from 'date-fns'; // 🌟 NUEVO: Manejo de fechas
import { es } from 'date-fns/locale';
import { Gavel, Clock, UserCircle, ArrowLeft, Loader2, AlertCircle, ImageIcon, Trophy, TrendingUp, CheckCircle, XCircle, Edit3 } from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from "../ui/button";

export function DetailSubasta() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [montoOfertar, setMontoOfertar] = useState(''); // 🌟 NUEVO: Estado del input de puja

    // 🌟 CORRECCIÓN: Ruta oficial del servidor XAMPP para las imágenes
    const IMAGE_URL = "http://localhost:81/Proyecto-Subastas-Hot-Wheels/uploads/"; 
    
    // EXTRAEMOS AL USUARIO SIMULADO 
    const { currentUser } = useAuth();
    
    // 🌟 REQUISITO AVANCE 4: Simulación de Usuario. 
    // Usamos el de auth si existe, si no, forzamos uno (ej. 2) para pruebas sin login.
    const UsuarioActualID = currentUser ? Number(currentUser.id_usuario) : 2; 

    // 🌟 NUEVO: Hook de Tiempo Real (Reemplaza el useState de pujas tradicional)
    const { pujas, estadoSubasta, setPujas } = usePusherSubasta(id, []);

    // Reglas de visualización
    const isOwner = subasta && UsuarioActualID === Number(subasta.id_vendedor);
    const hasPujas = pujas.length > 0;
    const canCancelOrEdit = subasta && (subasta.estado === 'BORRADOR' || subasta.estado === 'ACTIVA') && !hasPujas;

    // 🌟 NUEVO: Lógica de Fechas (Avance 4)
    // El estado puede venir del backend o actualizarse vía Pusher al cerrar
    const isCerrada = subasta && (estadoSubasta === 'FINALIZADA' || subasta.estado === 'FINALIZADA' || isPast(new Date(subasta.fecha_fin)));
    const tiempoRestante = subasta && !isCerrada 
        ? formatDistanceToNow(new Date(subasta.fecha_fin), { addSuffix: true, locale: es })
        : "Subasta Finalizada";

    // ACCIONES DE LA MÁQUINA DE ESTADOS 
    const handlePublish = async () => {
        try {
            await SubastaService.publishSubasta(id);
            toast.success("Subasta publicada y visible para todos");
            window.location.reload(); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al publicar");
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("¿Estás seguro de cancelar esta subasta? El auto volverá a tu garaje.")) return;
        try {
            await SubastaService.cancelSubasta(id);
            toast.success("Subasta cancelada exitosamente");
            window.location.reload(); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al cancelar");
        }
    };

    // 🌟 NUEVO: Lógica de Puja (Avance 4)
    const handlePujar = async (e) => {
        e.preventDefault();
        const monto = parseFloat(montoOfertar);
        const pujaMaximaActual = pujas.length > 0 ? parseFloat(pujas[0].monto_ofertado) : 0;
        const incrementoMin = parseFloat(subasta.incremento_minimo);
        const montoMinimo = pujaMaximaActual > 0 ? (pujaMaximaActual + incrementoMin) : parseFloat(subasta.precio_base);

        if (monto < montoMinimo) {
            toast.error(`Debes ofertar al menos $${montoMinimo.toFixed(2)}`);
            return;
        }

        try {
            await PujaService.createPuja({
                id_subasta: id,
                id_usuario: UsuarioActualID,
                monto_ofertado: monto
            });
            toast.success("¡Puja registrada exitosamente!");
            setMontoOfertar(''); // Limpiar input
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al registrar la puja");
        }
    };

    // 🌟 NUEVO: Notificación de Puja Superada (Avance 4)
    useEffect(() => {
        if (pujas.length > 0) {
            const pujaLider = pujas[0]; 
            const misPujas = pujas.filter(p => Number(p.id_usuario) === UsuarioActualID);
            const yoTeniaLiderazgo = misPujas.length > 0 && Number(pujaLider.id_usuario) !== UsuarioActualID;

            // Verificamos si la alerta ya se mostró para no saturar al recargar
            if (yoTeniaLiderazgo && pujaLider.isNew) { 
                toast.error("¡Tu puja ha sido superada!", { duration: 5000, icon: '⚠️' });
            }
        }
    }, [pujas, UsuarioActualID]);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
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
    }, [id, setPujas]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 bg-black">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-yellow-500" />
            <p className="text-xl font-black italic tracking-widest uppercase">Sincronizando pujas...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-6 bg-zinc-900 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold italic uppercase">Fallo en el sistema: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Cabecera con Botón Regresar */}
                <button 
                    onClick={() => navigate("/subasta", { replace: true})} 
                    className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-all group uppercase text-xs font-black tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al Tablero
                </button>

                <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                    
                    {/* ================= COLUMNA IZQUIERDA: EL OBJETO ================= */}
                    <div className="w-full lg:w-5/12 space-y-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden backdrop-blur-sm sticky top-28">
                            
                            {/* Imagen con Overlay de Gradiente */}
                            <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                {subasta.imagen_objeto ? (
                                    <img 
                                        src={`${IMAGE_URL}${subasta.imagen_objeto}`} 
                                        alt="Objeto" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Hot+Wheels"; }}
                                    />
                                ) : (
                                    <ImageIcon className="h-20 w-20 text-zinc-700" />
                                )}
                                <div className="absolute bottom-4 left-6">
                                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase italic tracking-tighter rounded">Lote #{id}</span>
                                </div>
                            </div>
                            
                            <div className="p-8">
                                {/* PANEL DEL VENDEDOR */}
                                {isOwner && subasta.estado === 'BORRADOR' && (
                                    <div className="mt-6 mb-8 p-4 bg-zinc-900/80 border border-blue-900/30 rounded-2xl">
                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-3">Panel de Vendedor</p>
                                        <div className="flex flex-wrap gap-3">
                                            {subasta.estado === 'BORRADOR' && (
                                                <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" /> Publicar Subasta
                                                </Button>
                                            )}

                                            {canCancelOrEdit && (
                                                <Button variant="destructive" onClick={handleCancel} className="font-bold flex items-center gap-2">
                                                    <XCircle className="h-4 w-4" /> Cancelar Subasta
                                                </Button>
                                            )}

                                            {canCancelOrEdit && (
                                                <Button variant="outline" onClick={() => navigate(`/subasta/update/${id}`)} className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold flex items-center gap-2">
                                                    <Edit3 className="h-4 w-4" /> Editar Configuración
                                                </Button>
                                            )}

                                            {hasPujas && (subasta.estado === 'ACTIVA' || subasta.estado === 'FINALIZADA') && (
                                                <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20 flex items-center">
                                                    Subasta bloqueada para edición (Ya existen pujas)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <h1 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
                                <div className="flex items-center gap-2 mb-6 bg-zinc-900/50 w-fit px-4 py-2 rounded-xl border border-zinc-800">
                                    <UserCircle className="h-5 w-5 text-blue-500" />
                                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                        Creador: <span className="text-zinc-200 ml-1">{subasta.vendedor || "Desconocido"}</span>
                                    </span>
                                </div>
                                    {subasta.nombre_objeto}
                                </h1>
                                
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        isCerrada 
                                        ? 'bg-red-500/20 text-red-400 border-red-500/30' // 🌟 Cambio visual reactivo
                                        : (subasta.estado === 'ACTIVA' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700')
                                    }`}>
                                        {isCerrada ? 'FINALIZADA' : subasta.estado}
                                    </span>
                                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {subasta.condicion_objeto}
                                    </span>
                                <div className="flex gap-2 mt-4">
                                {subasta.categorias_objeto?.map((cat, idx) => (
                                    <span key={idx} className="px-4 py-1 bg-zinc-800 text-red-500 border border-red-900/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {cat.nombre_serie}
                                    </span>
                                ))}
                                </div>
                                </div>

                                {/* Precios con Estilo Neón */}
                                <div className="grid grid-cols-2 gap-6 bg-black/40 p-6 rounded-3xl border border-zinc-800/50 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Precio Inicial</p>
                                        <p className="text-3xl font-black text-white">${parseFloat(subasta.precio_base).toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1 border-l border-zinc-800 pl-6">
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Incremento Mínimo</p>
                                        <p className="text-3xl font-black text-yellow-500">${parseFloat(subasta.incremento_minimo).toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* 🌟 TIEMPO RESTANTE REACTIVO (Avance 4) */}
                                <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-tighter">
                                            <Clock className="h-4 w-4 text-zinc-600" /> Tiempo Restante
                                        </div>
                                        <span className={`font-mono font-black tracking-widest uppercase ${isCerrada ? 'text-red-600' : 'text-blue-500'}`}>
                                            {tiempoRestante}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3 text-red-500 font-bold uppercase tracking-tighter">
                                            <CheckCircle className="h-4 w-4" /> Cierre Programado
                                        </div>
                                        <span className="text-zinc-500 font-mono font-bold">
                                            {format(new Date(subasta.fecha_fin), "dd MMM yyyy, HH:mm", { locale: es })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= COLUMNA DERECHA: HISTORIAL DE PUJAS ================= */}
                    <div className="w-full lg:w-7/12">
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl h-full flex flex-col">
                            
                            <div className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-6">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                        <Gavel className="h-8 w-8 text-red-600" />
                                        Historial de Pujas
                                    </h2>
                                </div>
                                <div className="bg-zinc-800 px-4 py-2 rounded-2xl border border-zinc-700">
                                    <span className="text-[10px] block text-zinc-500 font-black uppercase tracking-tighter text-center">Pujas</span>
                                    <span className="text-xl font-black text-white block leading-none">{pujas.length}</span>
                                </div>
                            </div>

                            {/* 🌟 FORMULARIO DE PUJA (Avance 4) */}
                            {!isCerrada ? (
                                !isOwner ? (
                                    <form onSubmit={handlePujar} className="mb-8 p-6 bg-black/40 rounded-3xl border border-yellow-500/30 flex flex-col gap-4">
                                        <label className="text-xs text-yellow-500 font-black uppercase tracking-widest">
                                            Registrar Nueva Oferta
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-mono text-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                                placeholder={`Mínimo: $${(pujas.length > 0 ? parseFloat(pujas[0].monto_ofertado) + parseFloat(subasta.incremento_minimo) : parseFloat(subasta.precio_base)).toFixed(2)}`}
                                                value={montoOfertar}
                                                onChange={(e) => setMontoOfertar(e.target.value)}
                                                required
                                            />
                                            <button 
                                                type="submit" 
                                                className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black uppercase italic tracking-tighter hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                                            >
                                                Pujar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mb-8 p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-center text-sm text-zinc-400 font-bold uppercase tracking-widest">
                                        No puedes pujar en tu propia subasta
                                    </div>
                                )
                            ) : (
                                <div className="mb-8 p-6 bg-red-900/20 border border-red-500/30 rounded-3xl text-center">
                                    <p className="text-red-500 font-black uppercase italic tracking-widest text-lg">
                                        Subasta Finalizada
                                    </p>
                                    <p className="text-zinc-400 text-sm mt-2 font-bold">
                                        {pujas.length > 0 ? `Ganador: ${pujas[0].postor}` : 'Finalizada sin ofertas'}
                                    </p>
                                </div>
                            )}

                            {/* LISTA DE PUJAS */}
                            {pujas.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-black/20 rounded-3xl border border-dashed border-zinc-800">
                                    <TrendingUp className="h-12 w-12 text-zinc-800 mb-4" />
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No hay ofertas aún</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-150 overflow-y-auto pr-4 custom-scrollbar">
                                    {pujas.map((puja, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`group relative flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${
                                                idx === 0 
                                                ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
                                                : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700'
                                            }`}
                                        >
                                            {idx === 0 && (
                                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-yellow-500 p-1.5 rounded-lg shadow-lg">
                                                    <Trophy className="h-4 w-4 text-black" />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                                    <UserCircle className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className={`font-black uppercase italic tracking-tighter ${idx === 0 ? 'text-white text-lg' : 'text-zinc-300'}`}>
                                                        {puja.postor}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                                        {/* 🌟 FORMATEO DE FECHAS */}
                                                        {format(new Date(puja.fecha_hora), "dd MMM yyyy, HH:mm", { locale: es })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`text-3xl font-black tracking-tighter ${idx === 0 ? 'text-yellow-500' : 'text-zinc-100'}`}>
                                                    ${parseFloat(puja.monto_ofertado).toFixed(2)}
                                                </div>
                                                {idx === 0 && (
                                                    <span className="text-[9px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded uppercase italic">Oferta Líder</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}