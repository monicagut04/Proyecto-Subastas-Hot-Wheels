import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Edit3, ArrowLeft, CarFront, CalendarClock, DollarSign, Loader2, Lock } from "lucide-react";

import SubastaService from '../../services/SubastaService';

// UI de Shadcn
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// 🌟 VALIDACIONES RÚBRICA 🌟
const updateSchema = yup.object({
    fecha_inicio: yup.date().typeError('Fecha inválida').required('Inicio obligatorio'),
    fecha_fin: yup.date()
        .typeError('Fecha inválida')
        .required('Cierre obligatorio')
        .min(yup.ref('fecha_inicio'), 'El cierre no puede ser antes del inicio'),
    precio_base: yup.number().typeError('Número válido').positive('Mayor a $0').required('Obligatorio'),
    incremento_minimo: yup.number().typeError('Número válido').positive('Mayor a $0').required('Obligatorio'),
});

export function UpdateSubasta() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [subastaOriginal, setSubastaOriginal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false); // Para bloqueo por rúbrica

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(updateSchema)
    });

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Traemos la subasta y las pujas en paralelo
                const [resSubasta, resPujas] = await Promise.all([
                    SubastaService.getSubastaById(id),
                    SubastaService.getPujasBySubasta(id)
                ]);

                const subasta = resSubasta.data.data;
                const pujas = resPujas.data.success ? resPujas.data.data : [];

                // 🌟 REGLAS DE NEGOCIO (RÚBRICA) 🌟
                // 1. ¿Ya inició?
                const fechaInicioISO = subasta.fecha_inicio.replace(' ', 'T');
                const yaInicio = subasta.estado !== 'BORRADOR' && new Date() >= new Date(fechaInicioISO);
                // 2. ¿Tiene pujas?
                const tienePujas = pujas.length > 0;

                if (yaInicio || tienePujas) {
                    setIsBlocked(true);
                    toast.error("Subasta bloqueada para edición (Ya inició o tiene pujas)", { duration: 5000 });
                }

                setSubastaOriginal(subasta);

                // 🌟 PRECARGA DE DATOS 🌟
                // Adaptamos el formato SQL "YYYY-MM-DD HH:MM:SS" a "YYYY-MM-DDTHH:MM" para HTML5
                const formatForInput = (dateString) => dateString.replace(' ', 'T').substring(0, 16);

                reset({
                    fecha_inicio: formatForInput(subasta.fecha_inicio),
                    fecha_fin: formatForInput(subasta.fecha_fin),
                    precio_base: subasta.precio_base,
                    incremento_minimo: subasta.incremento_minimo
                });

            } catch (err) {
                if (err.name !== "AbortError");
                navigate('/subasta');
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, [id, navigate, reset]);

    const onSubmit = async (formData) => {
        if (isBlocked) return;

        try {
            const formatDateForSQL = (dateObj) => {
                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                return (new Date(dateObj - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
            };

            const payload = {
                fecha_inicio: formatDateForSQL(formData.fecha_inicio),
                fecha_fin: formatDateForSQL(formData.fecha_fin),
                precio_base: formData.precio_base,
                incremento_minimo: formData.incremento_minimo
            };

            await SubastaService.updateSubasta(id, payload);
            toast.success("Configuración actualizada con éxito");
            navigate(`/subasta/detail/${id}`); // Regresa al detalle
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al actualizar");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 bg-black">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-500" />
            <p className="text-xl font-black italic tracking-widest uppercase">Cargando configuración...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-all group uppercase text-xs font-black tracking-widest">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cancelar Edición
                </button>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    
                    {/* Pantalla de Bloqueo Transparente si incumple reglas */}
                    {isBlocked && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8 border border-red-900/50 rounded-[2.5rem]">
                            <Lock className="h-16 w-16 text-red-600 mb-4" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Edición Bloqueada</h2>
                            <p className="text-zinc-400">Las reglas del sistema prohíben modificar una subasta que ya ha iniciado o que cuenta con ofertas de compradores.</p>
                            <Button onClick={() => navigate(-1)} className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-white">Volver Atrás</Button>
                        </div>
                    )}

                    <div className="mb-10 border-b border-zinc-800 pb-6">
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                            <Edit3 className="h-8 w-8 text-blue-600" /> Editar Subasta
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* SECCIÓN 1: OBJETO (Solo Lectura, la rúbrica no permite cambiarlo) */}
                        <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-2xl flex items-center gap-4 opacity-70">
                            <CarFront className="h-6 w-6 text-zinc-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vehículo en subasta (No editable)</p>
                                <p className="font-bold text-white text-lg">{subastaOriginal?.nombre_objeto}</p>
                            </div>
                        </div>

                        {/* SECCIÓN 2: FECHAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-green-500" /> Apertura
                                </Label>
                                <Input type="datetime-local" {...register("fecha_inicio")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600" />
                                {errors.fecha_inicio && <span className="text-red-500 text-xs font-bold">{errors.fecha_inicio.message}</span>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-red-500" /> Cierre
                                </Label>
                                <Input type="datetime-local" {...register("fecha_fin")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600" />
                                {errors.fecha_fin && <span className="text-red-500 text-xs font-bold">{errors.fecha_fin.message}</span>}
                            </div>
                        </div>

                        {/* SECCIÓN 3: PRECIOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-yellow-500" /> Precio Base ($)
                                </Label>
                                <Input type="number" step="0.01" {...register("precio_base")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600 text-xl font-black" />
                                {errors.precio_base && <span className="text-red-500 text-xs font-bold">{errors.precio_base.message}</span>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-yellow-500" /> Incremento Mínimo ($)
                                </Label>
                                <Input type="number" step="0.01" {...register("incremento_minimo")} className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600 text-xl font-black" />
                                {errors.incremento_minimo && <span className="text-red-500 text-xs font-bold">{errors.incremento_minimo.message}</span>}
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting || isBlocked} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest h-14 text-lg rounded-xl">
                            {isSubmitting ? 'Guardando Cambios...' : 'Actualizar Subasta'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}