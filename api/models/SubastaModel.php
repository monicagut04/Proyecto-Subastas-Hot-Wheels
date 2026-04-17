<?php
class SubastaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

/**
     * 🌟 LÓGICA DE NEGOCIO: Cierre Reactivo (Lazy Evaluation)
     * Evalúa si la subasta expiró, cambia su estado, determina el ganador y genera el pago.
     */
private function verificarCierreYGanador($id_subasta) {
        $id_subasta = (int)$id_subasta;

        // 1. SINCRONIZACIÓN DE RELOJES (CRÍTICO)
        // Obliga a PHP a evaluar el tiempo bajo la zona horaria de Costa Rica
        date_default_timezone_set('America/Costa_Rica');

        // 2. Verificamos el estado actual y la fecha de cierre
        $sql = "SELECT fecha_fin, estado FROM subastas WHERE id_subasta = $id_subasta";
        $subasta = $this->enlace->ExecuteSQL($sql);

        if (!empty($subasta) && strtoupper($subasta[0]->estado) === 'ACTIVA') {
            
            // 3. USO DE OBJETOS PARA PRECISIÓN EXACTA (Clean Code)
            $fechaCierre = new DateTime($subasta[0]->fecha_fin);
            $ahora = new DateTime(); // Captura la hora actual exacta del servidor ajustada a CR

            // Si el momento actual es EXACTAMENTE igual o superó el cierre
                if ($ahora >= $fechaCierre) {
                try {
                    // 1. Cambiamos el estado a FINALIZADA (Se asegura el estado en la interfaz)
                    $sqlCierre = "UPDATE subastas SET estado = 'FINALIZADA' WHERE id_subasta = $id_subasta";
                    $this->enlace->executeSQL_DML($sqlCierre);

                    // 2. Determinamos el ganador
                    $sqlGanador = "SELECT id_usuario, monto_ofertado FROM pujas 
                                WHERE id_subasta = $id_subasta 
                                ORDER BY monto_ofertado DESC LIMIT 1";
                    $ganador = $this->enlace->ExecuteSQL($sqlGanador);

                    // 3. Si hay ganador, intentamos registrar el pago
                    if (!empty($ganador)) {
                        $id_ganador = $ganador[0]->id_usuario;
                        $monto_final = $ganador[0]->monto_ofertado;

                        // 🌟 CORRECCIÓN APLICADA: Alineación exacta con tu tabla `pagos`
                        $sqlPago = "INSERT INTO pagos (id_subasta, id_usuario, monto_total, fecha_pago, estado_pago) 
                                    VALUES ($id_subasta, $id_ganador, $monto_final, NOW(), 'PENDIENTE')";
                        $this->enlace->executeSQL_DML($sqlPago);

                        $sqlganadorsubasta = "UPDATE subastas SET id_ganador = $id_ganador WHERE id_subasta = $id_subasta";
                        $this->enlace->executeSQL_DML($sqlganadorsubasta);
                    }else{
                        $sqlCierreSinPujas = "UPDATE subastas 
                                            SET estado = 'FINALIZADA', 
                                            id_ganador = NULL
                                            WHERE id_subasta = $id_subasta";
                        $this->enlace->executeSQL_DML($sqlCierreSinPujas);
                    }
                } catch (Exception $e) {
                    // PROTECCIÓN: La subasta sí quedará FINALIZADA y el frontend cargará con normalidad.
                    error_log("Fallo crítico en generación de pago para subasta $id_subasta: " . $e->getMessage());
                }
            }
        }
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
                WHERE estado = 'ACTIVA'
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

    public function borradores()
    {
        // 1. Consulta SIMPLE para traer solo subastas activas
        $vSql = "SELECT id_subasta, id_auto, precio_base, fecha_inicio, fecha_fin
                FROM subastas 
                WHERE estado = 'BORRADOR'
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
                ORDER BY fecha_fin asc;";
        
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
        $this->verificarCierreYGanador($id);
        // 1. DATOS COMPLETOS DE LA SUBASTA (Fechas, Precios, Incremento, Estado)
        // La consulta "SELECT *" ya trae precio_inicial, incremento_minimo, fecha_inicio, fecha_fin y estado.
        $vSql = "SELECT s.*, u.nombre_completo AS vendedor 
                FROM subastas s 
                INNER JOIN usuarios u ON s.id_vendedor = u.id_usuario 
                WHERE s.id_subasta = $id";
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado)) {
            $subasta = $vResultado[0];
            $id_auto = $subasta->id_auto;

            // 2. INFORMACIÓN DEL OBJETO: Nombre y Condición
            $sqlAuto = "SELECT nombre_modelo, estado_empaque as condicion,descripcion_detallada FROM autos WHERE id_auto = $id_auto";
            $auto = $this->enlace->ExecuteSQL($sqlAuto);
            $subasta->nombre_objeto = !empty($auto) ? $auto[0]->nombre_modelo : "Desconocido";
            $subasta->condicion_objeto = !empty($auto) ? $auto[0]->condicion : "Desconocida";
            $subasta->descripcion_objeto = !empty($auto) ? $auto[0]->descripcion_detallada : "Sin descripción disponible.";

            // 3. INFORMACIÓN DEL OBJETO: Imagen principal
            $sqlImagenes = "SELECT nombre_imagen, es_portada 
                        FROM imagenes WHERE id_auto = $id_auto 
                        ORDER BY es_portada DESC";
           $subasta->imagenes = $this->enlace->ExecuteSQL($sqlImagenes);
            
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
        $this->verificarCierreYGanador($id_subasta);
        // Obtenemos las pujas ordenadas por fecha ascendente
        $vSql = "SELECT id_usuario, monto_ofertado, fecha_hora 
                FROM pujas 
                WHERE id_subasta = $id_subasta 
                ORDER BY fecha_hora ASC;";
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



    /**
     * Obtener autos DISPONIBLES de un vendedor específico
     */
    public function getAutosDisponibles($id_vendedor) {
        $vSql = "SELECT id_auto, nombre_modelo FROM autos WHERE id_vendedor = $id_vendedor AND estado_actual = 'DISPONIBLE'";
        return $this->enlace->ExecuteSQL($vSql);
    }

    /**
     * Crear Subasta (Nace como BORRADOR)
     */
public function create($data) {
        $id_auto = (int)$data->id_auto;
        $id_vendedor = (int)$data->id_vendedor;
        $fecha_inicio = $data->fecha_inicio;
        $fecha_fin = $data->fecha_fin;
        $precio_base = (float)$data->precio_base;
        $incremento_minimo = (float)$data->incremento_minimo;

        // 1. Lectura (SELECT): Usamos executeSQL
        $checkAuto = "SELECT estado_actual FROM autos WHERE id_auto = $id_auto AND id_vendedor = $id_vendedor";
        $estadoAuto = $this->enlace->executeSQL($checkAuto);
        
        if (empty($estadoAuto)) {
            throw new Exception("El vehículo no existe o no te pertenece.");
        }

        if (strtoupper($estadoAuto[0]->estado_actual) !== 'DISPONIBLE') {
            throw new Exception("El vehículo debe estar DISPONIBLE.");
        }

        // 2. Escritura (INSERT): OBLIGATORIO usar executeSQL_DML
        $sqlInsert = "INSERT INTO subastas (id_auto, id_vendedor, fecha_inicio, fecha_fin, precio_base, incremento_minimo, estado) 
                    VALUES ($id_auto, $id_vendedor, '$fecha_inicio', '$fecha_fin', $precio_base, $incremento_minimo, 'BORRADOR')";
        
        $this->enlace->executeSQL_DML($sqlInsert);

        // 3. Escritura (UPDATE): OBLIGATORIO usar executeSQL_DML
        $sqlBloqueo = "UPDATE autos SET estado_actual = 'EN_SUBASTA' WHERE id_auto = $id_auto";
        
        $this->enlace->executeSQL_DML($sqlBloqueo);

        // 4. Verificación (SELECT): Usamos executeSQL
        $checkUpdate = "SELECT estado_actual FROM autos WHERE id_auto = $id_auto";
        $nuevoEstado = $this->enlace->executeSQL($checkUpdate);
        
        if(empty($nuevoEstado) || strtoupper($nuevoEstado[0]->estado_actual) !== 'EN_SUBASTA') {
            throw new Exception("Fallo en Base de Datos: La subasta se creó, pero el auto no cambió de estado.");
        }

        return true;
    }

    /**
     * Publicar Subasta (BORRADOR -> ACTIVA)
     */
    public function publish($id_subasta) {
        $vSql = "UPDATE subastas SET estado = 'ACTIVA' WHERE id_subasta = $id_subasta AND estado = 'BORRADOR'";
        return $this->enlace->executeSQL($vSql);
    }

    /**
     * Cancelar Subasta (Regla: No debe tener pujas)
     */
public function cancel($id_subasta) {
        $id_subasta = (int)$id_subasta;

        // 1. SELECT (Lectura): Verificamos pujas con ExecuteSQL
        $checkSql = "SELECT estado, (SELECT COUNT(*) FROM pujas WHERE id_subasta = $id_subasta) as total
                    FROM subastas WHERE id_subasta = $id_subasta";
        $pujas = $this->enlace->ExecuteSQL($checkSql);

        if(!empty($pujas) && $pujas[0]->total > 0) {
            throw new Exception("No se puede cancelar una subasta que ya tiene ofertas.");
        }

        // 2. Validación de Estado Lógico
        if (strtoupper($pujas[0]->estado) === 'ACTIVA') {
            throw new Exception("Operación denegada: No es posible cancelar una subasta que ya se encuentra ACTIVA en el mercado.");
        }

        // 2. UPDATE (Escritura): Cambiamos estado de subasta con executeSQL_DML
        $vSql = "UPDATE subastas SET estado = 'CANCELADA' WHERE id_subasta = $id_subasta";
        $this->enlace->executeSQL_DML($vSql);

        // 3. UPDATE (Escritura): Liberamos el auto devolviéndolo a DISPONIBLE
        $sqlLiberar = "UPDATE autos SET estado_actual = 'DISPONIBLE' WHERE id_auto = (SELECT id_auto FROM subastas WHERE id_subasta = $id_subasta)";
        $this->enlace->executeSQL_DML($sqlLiberar);

        return true;
    }

    /**
     * Listado de Subastas Canceladas
     */
    public function canceladas()
    {
        $vSql = "SELECT s.id_subasta, s.id_auto, s.precio_base, s.fecha_inicio, s.fecha_fin, s.estado,
                        a.nombre_modelo AS nombre_auto,
                        (SELECT COUNT(*) FROM pujas p WHERE p.id_subasta = s.id_subasta) AS cantidad_pujas
                FROM subastas s
                INNER JOIN autos a ON s.id_auto = a.id_auto
                WHERE s.estado = 'CANCELADA'
                ORDER BY s.fecha_fin DESC;";
                
        return $this->enlace->ExecuteSQL($vSql);
    }

    /**
     * Editar Subasta (Regla: No iniciada y sin pujas)
     */
    public function update($id_subasta, $data) {
        $fecha_inicio = $data->fecha_inicio;
        $fecha_fin = $data->fecha_fin;
        $precio_base = $data->precio_base;
        $incremento_minimo = $data->incremento_minimo;
        $id_subasta = (int)$id_subasta;
        
        // 1. SELECT (Lectura): Verificamos el estado actual
        $checkSql = "SELECT estado FROM subastas WHERE id_subasta = $id_subasta";
        $info = $this->enlace->ExecuteSQL($checkSql);

        if (empty($info)) {
            throw new Exception("La subasta especificada no existe en el sistema.");
        }

        // 2. Validación de Estado Lógico
        if (strtoupper($info[0]->estado) === 'ACTIVA') {
            throw new Exception("Edición denegada: Las reglas de negocio prohíben modificar una subasta que ya está ACTIVA.");
        }

        $vSql = "UPDATE subastas 
                SET fecha_inicio = '$fecha_inicio', fecha_fin = '$fecha_fin', precio_base = $precio_base, incremento_minimo = $incremento_minimo 
                WHERE id_subasta = $id_subasta";
        
        return $this->enlace->executeSQL($vSql);
    }

    
}
?>