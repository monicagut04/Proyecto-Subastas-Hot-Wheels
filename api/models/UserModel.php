<?php
class UserModel{

    public $enlace;

    public function __construct()
    {
        $this->enlace=new MySqlConnect();
    }

    /**
     * Listar todos los usuarios
     */
    public function all()
    {
        $vSql="Select id_usuario,nombre_completo,rol,estado
        from usuarios
        order by nombre_completo asc
        ";

        $vResultado=$this->enlace->executeSQL($vSql);

        return $vResultado;
    }

    /**
     * Obtener el detalle de un usuario
     */
    public function get($id)
    {
        $vSql = "
        SELECT 
            u.nombre_completo,
            u.correo_electronico, 
            u.rol, 
            u.estado, 
            u.fecha_registro,
            -- Lógica de negocio: Unificar la métrica según el rol
            CASE 
                WHEN u.rol = 'VENDEDOR' THEN 
                    (SELECT COUNT(*) FROM subastas s WHERE s.id_vendedor = u.id_usuario)
                WHEN u.rol = 'COMPRADOR' THEN 
                    (SELECT COUNT(*) FROM pujas p WHERE p.id_usuario = u.id_usuario)
                ELSE 0 
            END AS total_actividad,
            -- Etiqueta dinámica para saber qué estamos contando
            CASE 
                WHEN u.rol = 'VENDEDOR' THEN 'Subastas Creadas'
                WHEN u.rol = 'COMPRADOR' THEN 'Pujas Realizadas'
                ELSE 'Sin Actividad'
            END AS tipo_actividad
        FROM usuarios u 
        WHERE u.id_usuario = $id;
        ";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        
        // 🌟 CORRECCIÓN: Previene error 500 si se busca un ID que no existe
        return !empty($vResultado) ? $vResultado[0] : null; 
    }

    /**
     * Actualizar perfil (Solo Nombre y Correo según rúbrica)
     */
    public function update($id, $data)
    {
        $nombre = $data->nombre_completo;
        $correo = $data->correo_electronico;
        
        $vSql = "UPDATE usuarios SET nombre_completo = '$nombre', correo_electronico = '$correo' WHERE id_usuario = $id";
        
        // 🌟 CORRECCIÓN: Cambiado a executeSQL_DML para que no colapse al recibir el TRUE de la DB
        return $this->enlace->executeSQL_DML($vSql);
    }

    /**
     * Cambio lógico de estado (Bloqueo / Activación)
     */
    public function toggleStatus($id)
    {
        // 1. Obtenemos el estado actual
        $vSql = "SELECT estado FROM usuarios WHERE id_usuario = $id";
        $result = $this->enlace->ExecuteSQL($vSql);
        
        if (empty($result)) return false;
        
        $estadoActual = $result[0]->estado;
        
        // 2. Aplicamos la transición de estado coherente
        $nuevoEstado = ($estadoActual === 'ACTIVO') ? 'BLOQUEADO' : 'ACTIVO';
        
        $vSqlUpdate = "UPDATE usuarios SET estado = '$nuevoEstado' WHERE id_usuario = $id";
        
        // Cambiado a executeSQL_DML para evitar el Fatal Error
        return $this->enlace->executeSQL_DML($vSqlUpdate);
    }

}
?>