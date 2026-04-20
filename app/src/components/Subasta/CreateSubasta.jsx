import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Gavel, ArrowLeft, CarFront, CalendarClock, DollarSign, UserCheck } from "lucide-react";

import SubastaService from '../../services/SubastaService';
import { useAuth } from '../../hooks/useAuth'; // 

// UI de Shadcn
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


const subastaSchema = yup.object({
    id_auto: yup.string().required('Debes seleccionar un vehículo para subastar'),
    fecha_inicio: yup.date()
        .typeError('Fecha de inicio inválida')
        .required('La fecha de inicio es obligatoria'),
    fecha_fin: yup.date()
        .typeError('Fecha de cierre inválida')
        .required('La fecha de cierre es obligatoria')
        // Regla: Fecha de cierre DEBE ser mayor a la de inicio
        .min(yup.ref('fecha_inicio'), 'El cierre no puede ser antes del inicio'),
    precio_base: yup.number()
        .typeError('Debe ser un número válido')
        .positive('El precio base debe ser mayor a $0')
        .required('El precio base es obligatorio'),
    incremento_minimo: yup.number()
        .typeError('Debe ser un número válido')
        .positive('El incremento debe ser mayor a $0')
        .required('El incremento es obligatorio'),
});

export function CreateSubasta() {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Extraemos al Vendedor (Andrey)
    const [autosDisponibles, setAutosDisponibles] = useState([]);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(subastaSchema),
        defaultValues: {
            precio_base: '',
            incremento_minimo: 1
        }
    });

    // Cargar solo los autos DISPONIBLES de este vendedor
    useEffect(() => {
        const fetchAutos = async () => {
            try {
                const response = await SubastaService.getAutosDisponibles(currentUser.id_usuario);
                if (response.data && response.data.success) {
                    setAutosDisponibles(response.data.data);
                }
            } catch (err) {
                if (err.name !== "AbortError");
            }
        };
        fetchAutos();
    }, [currentUser.id_usuario]);

    // Procesar el formulario
    const onSubmit = async (formData) => {
        try {
            // Formatear fechas para MySQL (YYYY-MM-DD HH:MM:SS)
            const formatDateForSQL = (dateObj) => {
                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                return (new Date(dateObj - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
            };

            const payload = {
                id_auto: formData.id_auto,
                id_vendedor: currentUser.id_usuario, // Asignación oculta obligatoria
                fecha_inicio: formatDateForSQL(formData.fecha_inicio),
                fecha_fin: formatDateForSQL(formData.fecha_fin),
                precio_base: formData.precio_base,
                incremento_minimo: formData.incremento_minimo
            };

            const response = await SubastaService.createSubasta(payload);
            
            if (response.data) {
                toast.success("Subasta creada como BORRADOR exitosamente.", { duration: 4000 });
                navigate('/subasta'); // Volver al listado
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al crear la subasta");
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-all group uppercase text-xs font-black tracking-widest">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver
                </button>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                    
                    <div className="mb-10 border-b border-zinc-800 pb-6">
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                            <Gavel className="h-8 w-8 text-red-600" /> Crear Subasta
                        </h1>
                        <p className="text-zinc-500 text-sm mt-2 font-bold tracking-widest uppercase">
                            Configuración inicial del evento (Borrador)
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* SECCIÓN 1: VENDEDOR (Simulado y Bloqueado) */}
                        <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-2xl flex items-center gap-4 opacity-70">
                            <UserCheck className="h-6 w-6 text-blue-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vendedor Asignado (No editable)</p>
                                <p className="font-bold text-white text-lg">{currentUser.nombre_completo}</p>
                            </div>
                        </div>

                        {/* SECCIÓN 2: OBJETO A SUBASTAR */}
                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                <CarFront className="h-4 w-4" /> Seleccionar Vehículo
                            </Label>
                            <select 
                                {...register("id_auto")}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                            >
                                <option value="">-- Elige un auto de tu garaje --</option>
                                {autosDisponibles.map(auto => (
                                    <option key={auto.id_auto} value={auto.id_auto}>
                                        {auto.nombre_modelo} (Disp.)
                                    </option>
                                ))}
                            </select>
                            {errors.id_auto && <span className="text-red-500 text-xs font-bold">{errors.id_auto.message}</span>}
                            {autosDisponibles.length === 0 && (
                                <p className="text-yellow-500 text-xs font-bold mt-1">No tienes autos con estado 'DISPONIBLE'.</p>
                            )}
                        </div>

                        {/* SECCIÓN 3: FECHAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-green-500" /> Apertura
                                </Label>
                                <Input type="datetime-local" {...register("fecha_inicio")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-red-600" />
                                {errors.fecha_inicio && <span className="text-red-500 text-xs font-bold">{errors.fecha_inicio.message}</span>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-red-500" /> Cierre
                                </Label>
                                <Input type="datetime-local" {...register("fecha_fin")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-red-600" />
                                {errors.fecha_fin && <span className="text-red-500 text-xs font-bold">{errors.fecha_fin.message}</span>}
                            </div>
                        </div>

                        {/* SECCIÓN 4: PRECIOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-yellow-500" /> Precio Base ($)
                                </Label>
                                <Input type="number" step="0.01" placeholder="Ej: 15000" {...register("precio_base")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-red-600 text-xl font-black" />
                                {errors.precio_base && <span className="text-red-500 text-xs font-bold">{errors.precio_base.message}</span>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-yellow-500" /> Incremento Mínimo ($)
                                </Label>
                                <Input type="number" step="0.01" placeholder="Ej: 500" {...register("incremento_minimo")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-red-600 text-xl font-black" />
                                {errors.incremento_minimo && <span className="text-red-500 text-xs font-bold">{errors.incremento_minimo.message}</span>}
                            </div>
                        </div>

                        {/* BOTÓN DE SUBMIT */}
                        <div className="pt-6 border-t border-zinc-800">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 text-lg rounded-xl transition-all"
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar como Borrador'}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}