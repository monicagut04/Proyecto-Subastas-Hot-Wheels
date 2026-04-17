<?php
class PagoModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    // Obtener pagos de un usuario (cuando es el ganador)
    public function getPagosUsuario($id_usuario) {
    $id_usuario = (int)$id_usuario;
    // Agregamos u.nombre_completo a la consulta
    $sql = "SELECT p.*, a.nombre_modelo as nombre_auto, u.nombre_completo as nombre_comprador
            FROM pagos p
            INNER JOIN subastas s ON p.id_subasta = s.id_subasta
            INNER JOIN autos a ON s.id_auto = a.id_auto
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.id_usuario = $id_usuario
            ORDER BY p.fecha_pago DESC";
    return $this->enlace->ExecuteSQL($sql);
}

    // Confirmar el pago físicamente en la BD
    public function confirmarPago($id_pago) {
        $id_pago = (int)$id_pago;
        $sql = "UPDATE pagos SET estado_pago = 'COMPLETADO' WHERE id_pago = $id_pago";
        $this->enlace->executeSQL_DML($sql);
        return true;
    }
}
?>