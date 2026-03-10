<?php
class SubastaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Listado de Subastas Activas
     * Requisito: Máximo 5 campos, incluir cantidad de pujas calculada.
     */
    public function activas()
    {
        // 1. Consulta SIMPLE para traer solo subastas activas
        $vSql = "SELECT id_subasta, id_auto, precio_base, fecha_inicio, fecha_fin
                FROM subastas 
                WHERE estado = 'Activa' 
                ORDER BY fecha_fin ASC;";
        
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // 2. Recorremos para inyectar datos (Sin JOIN)
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_auto = $vResultado[$i]->id_auto;
                $id_subasta = $vResultado[$i]->id_subasta;

                // --- Buscar nombre del auto ---
                $sqlAuto = "SELECT nombre_modelo FROM autos WHERE id_auto = $id_auto";
                $auto = $this->enlace->ExecuteSQL($sqlAuto);
                $vResultado[$i]->nombre_auto = !empty($auto) ? $auto[0]->nombre_modelo : "Desconocido";

                // --- Calcular la cantidad de pujas ---
                $sqlPujas = "SELECT COUNT(*) as total FROM pujas WHERE id_subasta = $id_subasta";
                $pujas = $this->enlace->ExecuteSQL($sqlPujas);
                $vResultado[$i]->cantidad_pujas = !empty($pujas) ? $pujas[0]->total : 0;
            }
        }
        return $vResultado;
    }

    /**
     * Listado de Subastas Finalizadas
     * Requisito: Fecha de cierre, estado, cantidad de pujas y ganador.
     */
    public function finalizadas()
    {
        $vSql = "SELECT id_subasta, id_auto, fecha_fin, estado,precio_base
                FROM subastas 
                WHERE estado = 'Finalizada' 
                ORDER BY fecha_fin DESC;";
        
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_auto = $vResultado[$i]->id_auto;
                $id_subasta = $vResultado[$i]->id_subasta;

                // --- Buscar nombre del auto ---
                $sqlAuto = "SELECT nombre_modelo FROM autos WHERE id_auto = $id_auto";
                $auto = $this->enlace->ExecuteSQL($sqlAuto);
                $vResultado[$i]->nombre_auto = !empty($auto) ? $auto[0]->nombre_modelo : "Desconocido";

                // --- Calcular la cantidad de pujas ---
                $sqlPujas = "SELECT COUNT(*) as total FROM pujas WHERE id_subasta = $id_subasta";
                $pujas = $this->enlace->ExecuteSQL($sqlPujas);
                $vResultado[$i]->cantidad_pujas = !empty($pujas) ? $pujas[0]->total : 0;
            }
        }
        return $vResultado;
    }
/**
     * Detalle de Subasta
     * Requisito: Info completa del objeto, datos de la subasta y cálculo de pujas.
     */
    public function get($id)
    {
        // 1. DATOS COMPLETOS DE LA SUBASTA (Fechas, Precios, Incremento, Estado)
        // La consulta "SELECT *" ya trae precio_inicial, incremento_minimo, fecha_inicio, fecha_fin y estado.
        $vSql = "SELECT * FROM subastas WHERE id_subasta = $id;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado)) {
            $subasta = $vResultado[0];
            $id_auto = $subasta->id_auto;

            // 2. INFORMACIÓN DEL OBJETO: Nombre y Condición
            $sqlAuto = "SELECT nombre_modelo, estado_empaque as condicion FROM autos WHERE id_auto = $id_auto";
            $auto = $this->enlace->ExecuteSQL($sqlAuto);
            $subasta->nombre_objeto = !empty($auto) ? $auto[0]->nombre_modelo : "Desconocido";
            $subasta->condicion_objeto = !empty($auto) ? $auto[0]->condicion : "Desconocida";

            // 3. INFORMACIÓN DEL OBJETO: Imagen principal
            $sqlImagen = "SELECT nombre_imagen FROM imagenes WHERE id_auto = $id_auto AND es_portada = 1";
            $imagen = $this->enlace->ExecuteSQL($sqlImagen);
            $subasta->imagen_objeto = !empty($imagen) ? $imagen[0]->nombre_imagen : null;

            // 4. INFORMACIÓN DEL OBJETO: Categoría(s)
            $sqlColecciones = "SELECT nombre_serie FROM colecciones 
                            WHERE id_coleccion IN (SELECT id_coleccion FROM auto_colecciones WHERE id_auto = $id_auto)";
            $subasta->categorias_objeto = $this->enlace->ExecuteSQL($sqlColecciones);

            // 5. CÁLCULO OBLIGATORIO: Cantidad total de pujas
            $sqlPujas = "SELECT COUNT(*) as total FROM pujas WHERE id_subasta = $id";
            $pujas = $this->enlace->ExecuteSQL($sqlPujas);
            $subasta->cantidad_total_pujas = !empty($pujas) ? $pujas[0]->total : 0;

            return $subasta;
        }
        return null;
    }

    /**
     * Historial de Pujas de una Subasta
     * Requisito: Quién pujó, monto, fecha y hora en orden cronológico.
     */
    public function pujas($id_subasta)
    {
        // Obtenemos las pujas ordenadas por fecha descendente (la más reciente primero)
        $vSql = "SELECT id_usuario, monto_ofertado, fecha_hora 
                FROM pujas 
                WHERE id_subasta = $id_subasta 
                ORDER BY fecha_hora asc;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_usuario = $vResultado[$i]->id_usuario;

                // Buscar el nombre de la persona que hizo la puja
                $sqlUsuario = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $id_usuario";
                $usuario = $this->enlace->ExecuteSQL($sqlUsuario);
                $vResultado[$i]->postor = !empty($usuario) ? $usuario[0]->nombre_completo : "Desconocido";
            }
        }
        return $vResultado;
    }
}
?>