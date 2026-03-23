<?php
class AutoModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function all() {
        $vSql = "SELECT id_auto, id_vendedor, nombre_modelo, estado_actual, fecha_registro 
                FROM autos 
                ORDER BY fecha_registro ASC;";
        
        $vResultado = $this->enlace->executeSQL($vSql);
        
        if (!empty($vResultado) && is_array($vResultado)) {
            foreach ($vResultado as $item) {
                $sqlVendedor = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $item->id_vendedor";
                $vendedor = $this->enlace->executeSQL($sqlVendedor);
                $item->vendedor_nombre = !empty($vendedor) ? $vendedor[0]->nombre_completo : "Desconocido";

                $sqlImagen = "SELECT nombre_imagen FROM imagenes WHERE id_auto = $item->id_auto AND es_portada = 1";
                $imagen = $this->enlace->executeSQL($sqlImagen);
                $item->imagen_principal = !empty($imagen) ? $imagen[0]->nombre_imagen : null;
            }
        }
        return $vResultado;
    }

   public function get($id) {
        $res = $this->enlace->executeSQL("SELECT * FROM autos WHERE id_auto = $id");
        
        if ($res) {
            $auto = $res[0];

            $sqlVendedor = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $auto->id_vendedor";
            $vendedor = $this->enlace->executeSQL($sqlVendedor);
            $auto->vendedor_nombre = !empty($vendedor) ? $vendedor[0]->nombre_completo : "Dueño Desconocido";

            $auto->imagenes = $this->enlace->executeSQL("SELECT nombre_imagen, es_portada FROM imagenes WHERE id_auto = $id");

            $auto->categorias = $this->enlace->executeSQL("SELECT c.id_coleccion, c.nombre_serie FROM colecciones c 
                                                           INNER JOIN auto_colecciones ac ON c.id_coleccion = ac.id_coleccion 
                                                           WHERE ac.id_auto = $id");

            $auto->historial_subastas = $this->enlace->executeSQL("SELECT id_subasta, fecha_inicio, fecha_fin, estado 
                                                                  FROM subastas WHERE id_auto = $id 
                                                                  ORDER BY fecha_inicio DESC");

            return $auto;
        }
        return null;
    }

   public function create($data) {
        if (empty($data)) $data = $_POST;

        if (empty($data['nombre_modelo'])) throw new Exception("El nombre del modelo es requerido.");
        if (strlen($data['descripcion_detallada'] ?? '') < 20) throw new Exception("La descripción debe tener al menos 20 caracteres.");
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) throw new Exception("La fotografía es obligatoria.");

        $cats = isset($data['categorias']) ? (is_string($data['categorias']) ? json_decode($data['categorias'], true) : $data['categorias']) : [];
        if (empty($cats)) throw new Exception("Debe seleccionar al menos una categoría.");

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
        
        // 🌟 CANDADO DE EDICIÓN: Verificamos el estado del auto
        $checkAuto = $this->enlace->executeSQL("SELECT estado_actual FROM autos WHERE id_auto = $id");
        if ($checkAuto && strtoupper($checkAuto[0]->estado_actual) === 'EN_SUBASTA') {
            throw new Exception("No se puede editar: El vehículo está comprometido en una subasta.");
        }

        if (empty($data['nombre_modelo'])) throw new Exception("El nombre es requerido.");
        if (strlen($data['descripcion_detallada'] ?? '') < 20) throw new Exception("La descripción debe tener al menos 20 caracteres.");

        $cats = isset($data['categorias']) ? (is_string($data['categorias']) ? json_decode($data['categorias'], true) : $data['categorias']) : [];
        if (empty($cats)) throw new Exception("Debe mantener al menos una categoría seleccionada.");

        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
            $nombre_imagen = 'hw_upd_' . time() . '.' . $ext;
            $destino = __DIR__ . '/../../uploads/' . $nombre_imagen;
            
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $destino)) {
                $this->enlace->executeSQL_DML("UPDATE imagenes SET nombre_imagen = '$nombre_imagen' WHERE id_auto = $id AND es_portada = 1");
            }
        }

        $sql = "UPDATE autos SET 
                nombre_modelo = '{$data['nombre_modelo']}', 
                descripcion_detallada = '{$data['descripcion_detallada']}',
                marca_fabricante = '{$data['marca_fabricante']}',
                numero_serie = '{$data['numero_serie']}',
                estado_empaque = '{$data['estado_empaque']}',
                rareza = '{$data['rareza']}'
                WHERE id_auto = $id";
        $resultado = $this->enlace->executeSQL_DML($sql);

        $this->enlace->executeSQL_DML("DELETE FROM auto_colecciones WHERE id_auto = $id");
        foreach ($cats as $c_id) {
            $this->enlace->executeSQL_DML("INSERT INTO auto_colecciones (id_auto, id_coleccion) VALUES ($id, $c_id)");
        }

        return $resultado;
    }

    public function toggleStatus($id) {
        $res = $this->enlace->executeSQL("SELECT estado_actual FROM autos WHERE id_auto = $id");
        if (empty($res)) throw new Exception("El auto no existe.");

        $actual = strtoupper($res[0]->estado_actual);

        // 🌟 CANDADO DE ESTADO: Rechaza la desactivación si está en subasta
        if ($actual === 'EN_SUBASTA') {
            throw new Exception("🚫 ACCIÓN DENEGADA: El vehículo está EN SUBASTA. No se puede desactivar.");
        }

        // Si pasa la validación, solo alterna entre Disponible e Inactivo
        if ($actual === 'DISPONIBLE') {
            $nuevo = 'INACTIVO';
        } else {
            $nuevo = 'DISPONIBLE';
        }
        
        $this->enlace->executeSQL_DML("UPDATE autos SET estado_actual = '$nuevo' WHERE id_auto = $id");
        return $nuevo;
    }

    public function delete($id) {
        $auto = $this->enlace->executeSQL("SELECT estado_actual FROM autos WHERE id_auto = $id");
        if (!$auto) throw new Exception("La pieza no existe.");
        
        $estadoBD = strtoupper($auto[0]->estado_actual);

        // 🌟 CANDADO DE ELIMINACIÓN
        if ($estadoBD === 'EN_SUBASTA') {
            throw new Exception("🚫 ACCIÓN DENEGADA: El Hot Wheel está vinculado a una subasta. No se puede eliminar.");
        }

        $resultado = $this->enlace->executeSQL_DML("UPDATE autos SET estado_actual = 'INACTIVO' WHERE id_auto = $id");
        return ($resultado > 0);
    }
}
?>