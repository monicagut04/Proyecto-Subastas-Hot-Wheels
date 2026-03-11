<?php
class auto
{
    /**
     * Método para listar todos los autos
     * Ruta: GET /api/auto
     */
    public function index()
    {
        try {
            $response = new Response();
            $autoM = new AutoModel();
            
            // Pedimos todos los autos al modelo
            $result = $autoM->all();
            
            // Devolvemos el resultado en JSON
            $response->toJSON($result);
            
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error en el servidor: " . $e->getMessage());
            handleException($e);
        }
    }

    /**
     * Método para obtener el detalle de un auto
     * Ruta: GET /api/auto/{id}
     */
    public function get($id)
    {
        try {
            $response = new Response();
            $autoM = new AutoModel();
            
            // Pedimos el auto específico por su ID
            $result = $autoM->get($id);
            
            if($result) {
                // Si lo encontró, lo devuelve
                $response->toJSON($result);
            } else {
                // Si no existe, devuelve error 404
                $response->status(404)->toJSON([], "Auto no encontrado");
            }
            
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error en el servidor: " . $e->getMessage());
            handleException($e);
        }
    }
}
?>