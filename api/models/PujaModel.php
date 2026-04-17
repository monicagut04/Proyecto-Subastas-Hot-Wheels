<?php
require_once __DIR__ . '/../controllers/core/MySqlConnect.php';
require_once __DIR__ . '/../controllers/core/PusherService.php';

class PujaModel {
    private $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function create($data) {
        $id_subasta = (int)$data->id_subasta;
        $id_usuario = (int)$data->id_usuario; // Simulado desde la lógica de la UI
        $monto_ofertado = (float)$data->monto_ofertado;

        // 1. Validar Subasta y Vendedor
        $sqlSubasta = "SELECT estado, precio_base, incremento_minimo, id_vendedor, fecha_fin 
              FROM subastas WHERE id_subasta = $id_subasta";
        $subasta = $this->enlace->ExecuteSQL($sqlSubasta);

        if (empty($subasta)) {
            throw new Exception("La subasta no existe.");
        }
        
        $subastaInfo = $subasta[0];

        if (strtoupper($subastaInfo->estado) !== 'ACTIVA') {
            throw new Exception("No se admiten pujas: La subasta no está ACTIVA.");
        }

        if (strtotime($subastaInfo->fecha_fin) <= time()) {
            throw new Exception("El tiempo de la subasta ha finalizado.");
        }

        if ($subastaInfo->id_vendedor == $id_usuario) {
            throw new Exception("Operación denegada: El vendedor no puede pujar en su propia subasta.");
        }

        // 2. Validar Monto Lider e Incremento Mínimo
        $sqlMaxPuja = "SELECT MAX(monto_ofertado) as max_monto FROM pujas WHERE id_subasta = $id_subasta";
        $maxPujaResult = $this->enlace->ExecuteSQL($sqlMaxPuja);
        $montoActual = !empty($maxPujaResult[0]->max_monto) ? (float)$maxPujaResult[0]->max_monto : 0;

        $montoMinimoRequerido = ($montoActual > 0) 
            ? $montoActual + (float)$subastaInfo->incremento_minimo 
            : (float)$subastaInfo->precio_base;

        if ($monto_ofertado < $montoMinimoRequerido) {
            throw new Exception("El monto ofertado debe ser de al menos $" . number_format($montoMinimoRequerido, 2));
        }

        // 3. Persistir la Puja
        $sqlInsert = "INSERT INTO pujas (id_subasta, id_usuario, monto_ofertado, fecha_hora) 
                      VALUES ($id_subasta, $id_usuario, $monto_ofertado, NOW())";
        $this->enlace->executeSQL_DML($sqlInsert);

        // 4. Obtener datos del postor para el evento en tiempo real
        $sqlUsuario = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $id_usuario";
        $usuario = $this->enlace->ExecuteSQL($sqlUsuario);
        $nombrePostor = !empty($usuario) ? $usuario[0]->nombre_completo : "Desconocido";

        // 5. Emitir evento a través de Pusher
        $pusher = new PusherService();
        $pusher->notificarNuevaPuja($id_subasta, [
            'id_usuario' => $id_usuario,
            'postor' => $nombrePostor,
            'monto_ofertado' => $monto_ofertado,
            'fecha_hora' => date('Y-m-d H:i:s')
        ]);

        return true;
    }
}
?>