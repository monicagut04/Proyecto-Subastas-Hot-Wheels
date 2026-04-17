<?php
require_once __DIR__ . '/../../vendor/autoload.php';

class PusherService {
    private $pusher;

    public function __construct() {
        // Asegúrate de colocar tus credenciales reales de Pusher aquí
        $options = array(
            'cluster' => 'us2', // o el cluster que te asignó Pusher
            'useTLS' => true
        );
        $this->pusher = new Pusher\Pusher(
            '9b16fa4e7553c608d8cc',
            '76c9a59716816e0c5759',
            '2142039',
            $options
        );
    }

    public function notificarNuevaPuja($id_subasta, $data) {
        // Emitimos a un canal específico por subasta
        $this->pusher->trigger('subasta-' . $id_subasta, 'nueva-puja', $data);
    }
}
?>