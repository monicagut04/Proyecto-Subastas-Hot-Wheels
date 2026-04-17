<?php
class puja {
    public function create() {
        try {
            $response = new Response();
            $pujaM = new PujaModel();
            
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            
            if (!isset($data->id_subasta) || !isset($data->id_usuario) || !isset($data->monto_ofertado)) {
                $response->status(400)->toJSON([], "Datos incompletos para registrar la puja.");
                exit;
            }

            $pujaM->create($data);
            $response->status(200)->toJSON([], "Puja registrada exitosamente.");
            
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], $e->getMessage());
        }
    }
}
?>