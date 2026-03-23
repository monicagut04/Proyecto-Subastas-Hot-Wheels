<?php
class AutoModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    // 1. LISTADO FILTRADO (Solo muestra lo que no está 'borrado')
    // 1. LISTADO DE OBJETOS (Filtrado para ocultar Inactivos)
    public function all() {
        // 💡 El filtro WHERE asegura que lo "borrado" no aparezca
        $vSql = "SELECT id_auto, id_vendedor, nombre_modelo, estado_actual, fecha_registro 
                FROM autos 
                WHERE estado_actual != 'INACTIVO' 
                ORDER BY fecha_registro ASC;";
        
        $vResultado = $this->enlace->executeSQL($vSql);

        
        if (!empty($vResultado) && is_array($vResultado)) {
            foreach ($vResultado as $item) {
                // Buscamos el nombre del vendedor
                $sqlVendedor = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $item->id_vendedor";
                $vendedor = $this->enlace->executeSQL($sqlVendedor);
                $item->vendedor_nombre = !empty($vendedor) ? $vendedor[0]->nombre_completo : "Desconocido";

                // Buscamos la imagen de portada (es_portada = 1)
                $sqlImagen = "SELECT nombre_imagen FROM imagenes WHERE id_auto = $item->id_auto AND es_portada = 1";
                $imagen = $this->enlace->executeSQL($sqlImagen);
                $item->imagen_principal = !empty($imagen) ? $imagen[0]->nombre_imagen : null;
            }
        }
        return $vResultado;
    }

   public function get($id) {
        // 1. Traemos los datos básicos del auto
        $res = $this->enlace->executeSQL("SELECT * FROM autos WHERE id_auto = $id");
        
        if ($res) {
            $auto = $res[0];

            // 🌟 2. BUSCAMOS EL NOMBRE DEL DUEÑO (Lo que te falta)
            $sqlVendedor = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $auto->id_vendedor";
            $vendedor = $this->enlace->executeSQL($sqlVendedor);
            $auto->vendedor_nombre = !empty($vendedor) ? $vendedor[0]->nombre_completo : "Dueño Desconocido";

            // 3. Traemos las imágenes
            $auto->imagenes = $this->enlace->executeSQL("SELECT nombre_imagen, es_portada FROM imagenes WHERE id_auto = $id");

            // 4. Traemos las categorías
            $auto->categorias = $this->enlace->executeSQL("SELECT c.id_coleccion, c.nombre_serie FROM colecciones c 
                                                           INNER JOIN auto_colecciones ac ON c.id_coleccion = ac.id_coleccion 
                                                           WHERE ac.id_auto = $id");

            // 🌟 5. TRAEMOS EL HISTORIAL DE SUBASTAS (Para que se vea en el detalle)
            $auto->historial_subastas = $this->enlace->executeSQL("SELECT id_subasta, fecha_inicio, fecha_fin, estado 
                                                                  FROM subastas WHERE id_auto = $id 
                                                                  ORDER BY fecha_inicio DESC");

            return $auto;
        }
        return null;
    }

   public function create($data) {
        if (empty($data)) $data = $_POST;

        // 🛡️ VALIDACIONES OBLIGATORIAS (Reglas de la profe)
        if (empty($data['nombre_modelo'])) {
            throw new Exception("El nombre del modelo es requerido.");
        }
        
        if (strlen($data['descripcion_detallada'] ?? '') < 20) {
            throw new Exception("La descripción es obligatoria y debe tener al menos 20 caracteres.");
        }

        // Validación de Imagen: En 'create' es obligatoria
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("No permitir guardar sin imagen: La fotografía es obligatoria.");
        }

        // Validación de Categorías
        $cats = isset($data['categorias']) ? (is_string($data['categorias']) ? json_decode($data['categorias'], true) : $data['categorias']) : [];
        if (empty($cats)) {
            throw new Exception("No permitir guardar sin categoría: Debe seleccionar al menos una.");
        }

        // --- SI PASA LAS VALIDACIONES, PROCEDEMOS ---
        
        $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $nombre_imagen = 'hw_' . time() . '.' . $ext;
        move_uploaded_file($_FILES['foto']['tmp_name'], __DIR__ . '/../../uploads/' . $nombre_imagen);

        $sql = "INSERT INTO autos (id_vendedor, nombre_modelo, descripcion_detallada, marca_fabricante, numero_serie, estado_empaque, rareza, estado_actual, fecha_registro) 
                VALUES (2, '{$data['nombre_modelo']}', '{$data['descripcion_detallada']}', '{$data['marca_fabricante']}', '{$data['numero_serie']}', '{$data['estado_empaque']}', '{$data['rareza']}', 'DISPONIBLE', NOW())";
        
        $id = $this->enlace->executeSQL_DML_last($sql);
        
        if ($id > 0) {
            foreach ($cats as $c_id) {
                $this->enlace->executeSQL_DML("INSERT INTO auto_colecciones (id_auto, id_coleccion) VALUES ($id, $c_id)");
            }
            $this->enlace->executeSQL_DML("INSERT INTO imagenes (id_auto, nombre_imagen, es_portada) VALUES ($id, '$nombre_imagen', 1)");
            return $id;
        }
        throw new Exception("Error al crear el objeto en la base de datos.");
    }

    public function update($id, $data) {
        if (empty($data)) $data = $_POST;
        
        // 🛡️ VALIDACIONES OBLIGATORIAS (Mismas reglas que en create)
        if (empty($data['nombre_modelo'])) throw new Exception("El nombre es requerido.");
        
        if (strlen($data['descripcion_detallada'] ?? '') < 20) {
            throw new Exception("La descripción debe tener al menos 20 caracteres.");
        }

        // En Update, las categorías también son obligatorias
        $cats = isset($data['categorias']) ? (is_string($data['categorias']) ? json_decode($data['categorias'], true) : $data['categorias']) : [];
        if (empty($cats)) throw new Exception("Debe mantener al menos una categoría seleccionada.");

        // 1. Validar subasta activa antes de tocar nada
        $check = $this->enlace->executeSQL("SELECT COUNT(*) as total FROM subastas WHERE id_auto = $id AND estado = 'ACTIVA'");
        if ($check && $check[0]->total > 0) {
            throw new Exception("No se puede editar: tiene subasta activa.");
        }

        // 2. Manejo de imagen opcional (pero el registro debe seguir teniendo una)
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
            $nombre_imagen = 'hw_upd_' . time() . '.' . $ext;
            $destino = __DIR__ . '/../../uploads/' . $nombre_imagen;
            
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $destino)) {
                $this->enlace->executeSQL_DML("UPDATE imagenes SET nombre_imagen = '$nombre_imagen' WHERE id_auto = $id AND es_portada = 1");
            }
        }

        // 3. Actualizar datos (Incluyendo limpieza de categorías viejas si es necesario)
        // Opcional: Podrías borrar las categorías viejas y meter las nuevas aquí.

        $sql = "UPDATE autos SET 
                nombre_modelo = '{$data['nombre_modelo']}', 
                descripcion_detallada = '{$data['descripcion_detallada']}',
                marca_fabricante = '{$data['marca_fabricante']}',
                numero_serie = '{$data['numero_serie']}',
                estado_empaque = '{$data['estado_empaque']}',
                rareza = '{$data['rareza']}'
                WHERE id_auto = $id";
        
        return $this->enlace->executeSQL_DML($sql);
    }

    // 🔄 CORRECCIÓN: Toggle que sí guarda en BD
    // 🔄 CORRECCIÓN: Toggle que ahora sí llena tu tabla 'subastas' correctamente
    public function toggleStatus($id) {
        $res = $this->enlace->executeSQL("SELECT id_vendedor, estado_actual FROM autos WHERE id_auto = $id");
        if (empty($res)) return false;

        $actual = $res[0]->estado_actual;
        $idVendedor = $res[0]->id_vendedor;

        if ($actual === 'DISPONIBLE') {
            $nuevo = 'EN_SUBASTA';
            
            // 🌟 INSERT con tus columnas: id_vendedor, fecha_fin, precio_base e incremento_minimo
            $sqlSubasta = "INSERT INTO subastas 
                           (id_auto, id_vendedor, fecha_inicio, fecha_fin, precio_base, incremento_minimo, estado) 
                           VALUES 
                           ($id, $idVendedor, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1000.00, 500.00, 'ACTIVA')";
            $this->enlace->executeSQL_DML($sqlSubasta);

        } elseif ($actual === 'EN_SUBASTA') {
            $nuevo = 'INACTIVO';
            // Finalizamos la subasta activa
            $this->enlace->executeSQL_DML("UPDATE subastas SET estado = 'FINALIZADA' WHERE id_auto = $id AND estado = 'ACTIVA'");
            
        } else {
            $nuevo = 'DISPONIBLE';
        }
        
        // Actualizamos el estado en la tabla autos (ahora sí aceptará INACTIVO)
        $this->enlace->executeSQL_DML("UPDATE autos SET estado_actual = '$nuevo' WHERE id_auto = $id");
        return $nuevo;
    }

    // 🛑 DELETE: Bloqueo total si hay subastas en tu tabla 'subastas'
    public function delete($id) {
        // 1. Verificar estado actual en la tabla autos
        $auto = $this->enlace->executeSQL("SELECT estado_actual FROM autos WHERE id_auto = $id");
        if (!$auto) throw new Exception("La pieza no existe.");
        
        $estadoBD = $auto[0]->estado_actual;

        // 2. Verificar si existe subasta ACTIVA en la tabla subastas (según tu SQL)
        $sqlCheck = "SELECT COUNT(*) as total FROM subastas WHERE id_auto = $id AND estado = 'ACTIVA'";
        $check = $this->enlace->executeSQL($sqlCheck);

        // 🛡️ REGLA: Si el carro dice EN_SUBASTA o hay fila en subastas, NO se borra
        if ($estadoBD === 'EN_SUBASTA' || ($check && $check[0]->total > 0)) {
            throw new Exception("🚫 ACCIÓN DENEGADA: El Hot Wheel está vinculado a una subasta ACTIVA.");
        }

        // 3. Borrado lógico (Cambiamos a INACTIVO)
        $resultado = $this->enlace->executeSQL_DML("UPDATE autos SET estado_actual = 'INACTIVO' WHERE id_auto = $id");
        return ($resultado > 0);
    }
}