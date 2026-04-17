import { useState, useEffect } from 'react';
import PagoService from '../../services/PagoService'; 
import { useAuth } from '../../hooks/useAuth'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Clock, AlertCircle, Loader2, UserCircle } from "lucide-react";
import toast from 'react-hot-toast';

export default function ListPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Obtenemos el usuario actual del contexto global (Variable lógica interna)
  const { currentUser } = useAuth(); 
  
  // 2. Extraemos el ID del usuario que está usando el sistema
  const USUARIO_ACTUAL_ID = currentUser ? Number(currentUser.id_usuario) : null; 

  const fetchPagos = async () => {
    if (!USUARIO_ACTUAL_ID) {
        setLoading(false);
        return;
    }
    
    try {
        const response = await PagoService.getPagosByUsuario(USUARIO_ACTUAL_ID);
        const data = response.data.data || response.data; 
        setPagos(data);
    } catch (error) {
        console.error("Error cargando pagos:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, [USUARIO_ACTUAL_ID]); // Se recarga si cambias de usuario para pruebas

  const confirmarPago = async (id_pago) => {
    try {
        await PagoService.confirmarPago(id_pago);
        toast.success("¡Pago procesado exitosamente!", {
            style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        });
        fetchPagos(); 
    } catch (error) {
        console.error("Error en la transacción:", error);
        toast.error("No se pudo procesar el pago. Intente de nuevo.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-red-600" />
        <p className="text-xl font-black italic tracking-widest uppercase text-zinc-500">Sincronizando transacciones...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
            
            {/* Encabezado Estilo Hot Wheels */}
            <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-8">
                <div className="bg-red-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                    <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                        Mis Pagos
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
                        Historial personal de adquisiciones y cobros pendientes
                    </p>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                <Table>
                    <TableHeader className="bg-zinc-900/50">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6 pl-8">Subasta / Auto</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6">Ganador</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6">Monto Final</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6">Fecha Cierre</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6">Estado</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6 pr-8 text-right">Gestión</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!USUARIO_ACTUAL_ID || pagos.length === 0 ? (
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/20">
                                <TableCell colSpan={6} className="text-center py-20">
                                    <AlertCircle className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-black uppercase italic tracking-widest">
                                        {!USUARIO_ACTUAL_ID ? "No hay sesión activa" : "No tienes pagos registrados"}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagos.map((pago) => (
                                <TableRow key={pago.id_pago} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-red-500 transition-colors">
                                                {pago.nombre_auto}
                                            </span>
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Lote ID: #{pago.id_subasta}</span>
                                        </div>
                                    </TableCell>

                                    {/* Columna Ganador: Ahora es dinámica */}
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                                <UserCircle className="h-3 w-3 text-zinc-400" />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight">
                                                {pago.nombre_comprador || "Usuario"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-6 font-mono text-lg font-bold text-white">
                                        ₡{Number(pago.monto_total).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-6 text-xs text-zinc-400 font-medium">
                                        {new Date(pago.fecha_pago).toLocaleDateString('es-CR', { 
                                            day: '2-digit', month: 'short', year: 'numeric' 
                                        })}
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <Badge 
                                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                pago.estado_pago === 'COMPLETADO' 
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse'
                                            }`}
                                        >
                                            {pago.estado_pago === 'COMPLETADO' ? 'CONFIRMADO' : 'PENDIENTE'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-6 pr-8 text-right">
                                        {pago.estado_pago === 'PENDIENTE' ? (
                                            <Button 
                                                size="sm" 
                                                onClick={() => confirmarPago(pago.id_pago)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase italic text-[10px] tracking-widest rounded-xl px-6 py-5 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:scale-105 transition-all"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" /> Confirmar Pago
                                            </Button>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2 text-zinc-500">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">Completado</span>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-8 flex items-center gap-2 text-zinc-600">
                <Clock className="h-4 w-4" />
                <p className="text-[9px] font-bold uppercase tracking-[0.2em]">
                    Los registros se filtran según el ID de usuario activo en el AuthContext.
                </p>
            </div>
        </div>
    </div>
  );
}