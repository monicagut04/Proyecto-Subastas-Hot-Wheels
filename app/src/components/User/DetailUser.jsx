import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import { 
    UserCircle, Shield, Activity, Calendar, TrendingUp, ArrowLeft, Loader2, AlertCircle, Award, Mail 
} from "lucide-react";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Edit3, PowerOff, CheckCircle } from "lucide-react";
// UI de Shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger ,DialogDescription} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
// Esquema de Validación
const userSchema = yup.object({
    nombre_completo: yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
    correo_electronico: yup.string().email('Formato inválido').required('El correo es obligatorio'),
});

export function DetailUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(userSchema)
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserService.getUserById(id);
                setData(response.data);
                reset({
                    nombre_completo: response.data.data.nombre_completo,
                    correo_electronico: response.data.data.correo_electronico || ''
                });
                if (!response.data.success) setError(response.data.message);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id,reset]);

    const onSubmitUpdate = async (formData) => {
        try {
            const response = await UserService.updateUser(id, formData);
            if (response.data) {
                toast.success("Perfil actualizado");
                setIsDialogOpen(false);
                window.location.reload(); // Recarga rápida para ver los cambios
            }
        } catch (err) {
            if (err.name !== "AbortError") setError(err.message);        }
    };

    const handleToggleStatus = async () => {
        try {
            const response = await UserService.toggleStatus(id);
            if (response.data) {
                toast.success("Estado modificado exitosamente");
                window.location.reload(); // Recarga rápida para ver la etiqueta roja/verde
            }
        } catch (err) {
            if (err.name !== "AbortError") setError(err.message);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 bg-black">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-500" />
            <p className="text-xl font-black italic tracking-widest uppercase">Verificando Credenciales...</p>
        </div>
    );
    
    if (error) return (
        <div className="mx-auto max-w-3xl mt-10 p-6 bg-zinc-900 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-lg font-bold italic uppercase">Error de Acceso: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                
                {/* CABECERA SUPERIOR: Botón Volver y Controles Administrativos */}
                <div className="flex justify-between items-center mb-8">
                    
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-all group uppercase text-xs font-black tracking-[0.2em]">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al Listado
                    </button>

                    {/* BOTONES ADMINISTRATIVOS Y MODAL */}
                    <div className="flex items-center gap-3">
                        {/* Botón Dinámico: Bloquear / Activar */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                    <Edit3 className="h-4 w-4" /> Editar Perfil
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black uppercase italic text-blue-500">Actualizar Usuario</DialogTitle>
                                   
                                    <DialogDescription className="text-zinc-400 text-xs mt-1">
                                        Modifica la información básica del usuario.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
                                    <div>
                                        <Label>Nombre Completo</Label>
                                        <Input {...register("nombre_completo")} className="bg-zinc-900 border-zinc-800 mt-1" />
                                        {errors.nombre_completo && <span className="text-red-500 text-xs font-bold">{errors.nombre_completo.message}</span>}
                                    </div>
                                    <div>
                                        <Label>Correo Electrónico</Label>
                                        <Input type="email" {...register("correo_electronico")} className="bg-zinc-900 border-zinc-800 mt-1" />
                                        {errors.correo_electronico && <span className="text-red-500 text-xs font-bold">{errors.correo_electronico.message}</span>}
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 font-bold uppercase tracking-widest mt-4">
                                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button 
                            variant="outline" 
                            onClick={handleToggleStatus} 
                            className={`flex items-center gap-2 border transition-colors ${
                                user.data.estado === 'ACTIVO' 
                                ? 'border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500' 
                                : 'border-green-900/50 text-green-500 hover:bg-green-900/20 hover:border-green-500'
                            }`}
                        >
                            {/* Cambia el ícono dinámicamente */}
                            {user.data.estado === 'ACTIVO' ? <PowerOff className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            
                            {/* Cambia el texto dinámicamente */}
                            {user.data.estado === 'ACTIVO' ? 'Bloquear' : 'Activar'}
                        </Button>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row gap-10 items-stretch">
                    
                    {/* AVATAR / STATUS CARD */}
                    <div className="w-full md:w-1/3 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 backdrop-blur-sm relative overflow-hidden group">
                        {/* Efecto de luz de fondo */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700" />
                        
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <UserCircle className="h-40 w-40 text-zinc-700 relative z-10 group-hover:text-blue-500 transition-colors duration-500" />
                        </div>

                        <div className="mt-8 text-center space-y-4">
                            <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                                user.data.estado === 'ACTIVO' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                                : 'bg-red-500/10 text-red-500 border-red-500/30'
                            }`}>
                                <span className={`h-2 w-2 rounded-full ${user.data.estado === 'ACTIVO' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                {user.data.estado}
                            </span>
                        </div>
                    </div>

                    {/* DETALLES DEL PERFIL */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.3em] text-xs">
                                <Award className="h-4 w-4" /> Perfil
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                {user.data.nombre_completo}
                            </h1>
                        </div>
                        
                        {/* MOSTRAR EL CORREO */}
                        <div className="mt-4">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Mail className="h-3 w-3" /> Correo Electrónico
                            </p>
                            <p className="text-zinc-400 font-mono tracking-tight text-lg border-l-2 border-blue-500 pl-4">
                                {user.data.correo_electronico || "Sin correo registrado"}
                            </p>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
                            
                            {/* Grid de Info Técnica */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="flex items-center gap-5 group">
                                    <div className="p-4 bg-zinc-800 text-blue-500 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Shield className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Rol</p>
                                        <p className="text-xl font-bold text-zinc-100 italic">{user.data.rol}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-5 group">
                                    <div className="p-4 bg-zinc-800 text-blue-500 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Calendar className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fecha de Ingreso</p>
                                        <p className="text-xl font-bold text-zinc-100 italic">{user.data.fecha_registro}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Métrica de Actividad Estilo Pantalla de Coche */}
                            <div className="mt-12 pt-10 border-t border-zinc-800">
                                <h3 className="text-xs font-black text-zinc-400 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                                    <TrendingUp className="h-4 w-4 text-blue-500" />{user.data.tipo_actividad}
                                </h3>
                                
                                <div className="relative group overflow-hidden bg-black/40 border border-zinc-800 rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-500 hover:border-blue-500/40">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <span className="text-8xl font-black text-blue-500 tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        {user.data.total_actividad}
                                    </span>
                                    <span className="text-sm font-black text-zinc-400 uppercase tracking-[0.4em] italic border-t border-zinc-800 pt-4 px-8">
                                        {user.data.tipo_actividad}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}