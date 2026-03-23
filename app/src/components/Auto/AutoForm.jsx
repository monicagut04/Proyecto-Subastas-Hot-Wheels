import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// 🌟 Servicios e Iconos
import AutoService from "../../services/AutoService";
import UserService from "../../services/UserService"; 
import { Save, Upload, User, ChevronLeft, AlertCircle, Image as ImageIcon, CheckCircle2 } from "lucide-react";

// ✅ ESQUEMA DE VALIDACIÓN TOTAL (Todo es obligatorio aquí)
const autoSchema = yup.object({
    nombre_modelo: yup.string()
        .required('❌ El nombre es obligatorio')
        .min(3, 'Nombre demasiado corto'),
    descripcion_detallada: yup.string()
        .required('❌ La descripción es obligatoria')
        .min(20, '❌ Mínimo 20 caracteres obligatorios'),
    marca_fabricante: yup.string()
        .required('❌ La marca es obligatoria'),
    numero_serie: yup.string()
        .required('❌ El número de serie es obligatorio'),
    estado_empaque: yup.string()
        .required('❌ Seleccione una condición'),
    rareza: yup.string()
        .required('❌ Seleccione un nivel de rareza'),
    categorias: yup.array()
        .min(1, '❌ Debe elegir al menos una categoría')
        .required('Requerido'),
});

export function AutoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // ESTADOS PARA IMAGEN
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [imageError, setImageError] = useState(false); // 🚩 Estado de error para la foto

    // ESTADOS PARA VENDEDOR
    const [vendedor, setVendedor] = useState(null);
    const [loadingVendedor, setLoadingVendedor] = useState(true);

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nombre_modelo: "",
            descripcion_detallada: "",
            marca_fabricante: "",
            numero_serie: "",
            estado_empaque: "", // Vacío para forzar la selección obligatoria
            rareza: "",
            categorias: [] 
        },
        resolver: yupResolver(autoSchema)
    });

    useEffect(() => {
        // Carga de Vendedor (Andrey ID: 2)
        UserService.getUserById(2).then(res => setVendedor(res.data?.data || res.data));

        if (id) {
            AutoService.getAutoById(id).then(response => {
                const auto = response.data?.data || response.data; 
                reset({
                    ...auto,
                    categorias: auto.categorias?.map(c => String(c.id_coleccion)) || []
                });
                if (auto.imagenes?.[0]) {
                    setPreview(`http://localhost:81/Proyecto-Subastas-Hot-Wheels/uploads/${auto.imagenes[0].nombre_imagen}`);
                }
            });
        }
    }, [id, reset]);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setImageError(false); // Se quita el error al elegir foto
        }
    };

    const onSubmit = async (dataForm) => {
        // 🛡️ VALIDACIÓN MANUAL DE IMAGEN (Si no hay file ni preview, error)
        if (!file && !preview) {
            setImageError(true);
            toast.error("Falta la fotografía obligatoria", { icon: '📸' });
            return;
        }

        const loadToast = toast.loading(id ? "Actualizando..." : "Registrando...");
        try {
            const formData = new FormData();
            formData.append('nombre_modelo', dataForm.nombre_modelo);
            formData.append('descripcion_detallada', dataForm.descripcion_detallada);
            formData.append('marca_fabricante', dataForm.marca_fabricante);
            formData.append('numero_serie', dataForm.numero_serie);
            formData.append('estado_empaque', dataForm.estado_empaque);
            formData.append('rareza', dataForm.rareza);
            formData.append('categorias', JSON.stringify(dataForm.categorias.map(Number)));
            
            if (file) formData.append('foto', file);

            if (id) {
                await AutoService.updateAuto(id, formData);
                toast.success("¡Registro actualizado!", { id: loadToast });
            } else {
                await AutoService.createAuto(formData);
                toast.success("¡Pieza guardada con éxito!", { id: loadToast });
            }
            navigate("/auto");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error en el servidor", { id: loadToast });
        }
    };

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white font-sans selection:bg-red-600/30">
            <div className="max-w-4xl mx-auto bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
                
                {/* Decoración de fondo */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]" />

                <div className="flex items-center justify-between mb-12 relative z-10">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                            {id ? "Ajustar" : "Nueva"} <span className="text-red-600">Entrada</span>
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Todos los campos marcados con (*) son obligatorios</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-black uppercase text-[10px] bg-black/40 px-4 py-2 rounded-full border border-zinc-800">
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
                    
                    {/* FOTOGRAFÍA OBLIGATORIA */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-red-600" /> Foto del Hot Wheel <span className="text-red-600">*</span>
                            </label>
                            {imageError && <span className="text-red-500 text-[10px] font-black uppercase animate-bounce">⚠️ Imagen requerida</span>}
                        </div>

                        <div 
                            onClick={() => document.getElementById('foto').click()}
                            className={`group relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer bg-black/40
                                ${imageError ? 'border-red-600 bg-red-600/5 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'border-zinc-800 hover:border-red-600/50'}`}
                        >
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} className="h-64 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                                        <div className="bg-white text-black p-3 rounded-full"><Upload className="h-6 w-6" /></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className={`p-6 rounded-[2rem] ${imageError ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                        <Upload className={`h-10 w-10 ${imageError ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Haz clic para subir la foto oficial</p>
                                </div>
                            )}
                            <input id="foto" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* BLOQUE DE TEXTOS */}
                    <div className="grid gap-8">
                        <div>
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Modelo <span className="text-red-600">*</span></label>
                                {errors.nombre_modelo && <span className="text-red-500 text-[9px] font-black uppercase italic">{errors.nombre_modelo.message}</span>}
                            </div>
                            <Controller name="nombre_modelo" control={control} render={({ field }) => (
                                <input {...field} placeholder="Ej: Porsche 911 GT3" className={`w-full bg-black border ${errors.nombre_modelo ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-zinc-800'} p-5 rounded-2xl mt-2 focus:border-red-600 outline-none transition-all font-bold text-white uppercase italic`} />
                            )} />
                        </div>

                        <div>
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Descripción Técnica <span className="text-red-600">*</span></label>
                                {errors.descripcion_detallada && <span className="text-red-500 text-[9px] font-black uppercase italic">{errors.descripcion_detallada.message}</span>}
                            </div>
                            <Controller name="descripcion_detallada" control={control} render={({ field }) => (
                                <textarea {...field} rows="3" placeholder="Mínimo 20 caracteres sobre el estado de la pieza..." className={`w-full bg-black border ${errors.descripcion_detallada ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-zinc-800'} p-5 rounded-2xl mt-2 focus:border-red-600 outline-none transition-all font-medium text-white resize-none`} />
                            )} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Marca <span className="text-red-600">*</span></label>
                            <Controller name="marca_fabricante" control={control} render={({ field }) => (
                                <input {...field} className={`w-full bg-black border ${errors.marca_fabricante ? 'border-red-600' : 'border-zinc-800'} p-5 rounded-2xl mt-2 focus:border-red-600 outline-none font-bold`} />
                            )} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Serie <span className="text-red-600">*</span></label>
                            <Controller name="numero_serie" control={control} render={({ field }) => (
                                <input {...field} className={`w-full bg-black border ${errors.numero_serie ? 'border-red-600' : 'border-zinc-800'} p-5 rounded-2xl mt-2 focus:border-red-600 outline-none font-bold`} />
                            )} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Condición <span className="text-red-600">*</span></label>
                            <Controller name="estado_empaque" control={control} render={({ field }) => (
                                <select {...field} className={`w-full bg-black border ${errors.estado_empaque ? 'border-red-600' : 'border-zinc-800'} p-5 rounded-2xl mt-2 focus:border-red-600 outline-none font-bold text-white appearance-none`}>
                                    <option value="">-- Seleccionar --</option>
                                    <option value="BLISTER_PERFECTO">Blister Perfecto</option>
                                    <option value="TARJETA_DANADA">Tarjeta Dañada</option>
                                    <option value="LOOSE_NUEVO">Suelto (Nuevo)</option>
                                    <option value="LOOSE_JUGADO">Suelto (Jugado)</option>
                                </select>
                            )} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Rareza <span className="text-red-600">*</span></label>
                            <Controller name="rareza" control={control} render={({ field }) => (
                                <select {...field} className={`w-full bg-black border ${errors.rareza ? 'border-red-600' : 'border-zinc-800'} p-5 rounded-2xl mt-2 focus:border-red-600 outline-none font-bold text-white appearance-none`}>
                                    <option value="">-- Seleccionar --</option>
                                    <option value="BASICO">Básico (Mainline)</option>
                                    <option value="TH">Treasure Hunt (TH)</option>
                                    <option value="STH">Super Treasure Hunt (STH)</option>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="RLC">Red Line Club (RLC)</option>
                                </select>
                            )} />
                        </div>
                    </div>

                    {/* CATEGORÍAS OBLIGATORIAS */}
                    <div className={`bg-black/30 p-8 rounded-[2rem] border ${errors.categorias ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Categorías del Modelo <span className="text-red-600">*</span></label>
                            {errors.categorias && <span className="text-red-500 text-[9px] font-black uppercase italic bg-red-600/10 px-3 py-1 rounded-full">{errors.categorias.message}</span>}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {[
                                {id: "1", label: "HW Screen Time"},
                                {id: "2", label: "HW Exotics"},
                                {id: "3", label: "Muscle Mania"}
                            ].map(cat => (
                                <label key={cat.id} className="group flex items-center gap-3 px-5 py-3 bg-zinc-800/50 rounded-2xl border border-zinc-700 cursor-pointer hover:border-red-600 transition-all select-none">
                                    <input type="checkbox" value={cat.id} {...register("categorias")} className="w-5 h-5 accent-red-600 bg-black border-zinc-700 rounded-lg" />
                                    <span className="text-xs font-black text-zinc-300 uppercase italic group-hover:text-white">{cat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* BOTÓN FINAL */}
                    <div className="pt-6">
                        <button type="submit" className="w-full bg-red-600 py-6 rounded-[2rem] font-black uppercase italic text-lg hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(220,38,38,0.3)] group">
                            <CheckCircle2 className="h-7 w-7 group-hover:scale-125 transition-transform" /> 
                            <span>Finalizar y Guardar</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}