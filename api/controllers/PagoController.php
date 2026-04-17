<?php
class pago {
    public function getByUsuario($id_usuario) {
        try {
            $response = new Response();
            $pagoM = new PagoModel();
            $result = $pagoM->getPagosUsuario($id_usuario);
            $response->status(200)->toJSON($result);
        } catch (Exception $e) {
            (new Response())->status(500)->toJSON([], $e->getMessage());
        }
    }

    public function confirmar($id_pago) {
        try {
            $response = new Response();
            $pagoM = new PagoModel();
            $pagoM->confirmarPago($id_pago);
            $response->status(200)->toJSON([], "Pago confirmado");
        } catch (Exception $e) {
            (new Response())->status(500)->toJSON([], $e->getMessage());
        }
    }
}
?>