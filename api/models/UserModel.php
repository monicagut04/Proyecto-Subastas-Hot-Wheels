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
        
        // Si encontró al usuario, devolvemos solo el primer objeto (índice 0)
        return $vResultado[0]; 
    
    }













































}
?>