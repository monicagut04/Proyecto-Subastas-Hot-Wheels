<?php

class subasta
{
    // GET /api/subasta/activas
    public function index()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->activas();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
            handleException($e);
        }
    }

    // GET /api/subasta/finalizadas
    public function finalizadas()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->finalizadas();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
            handleException($e);
        }
    }

    // GET /api/subasta/get/{id}
    public function get($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->get($id);
            if($result) {
                $response->toJSON($result);
            } else {
                $response->status(404)->toJSON([], "Subasta no encontrada");
            }
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
            handleException($e);
        }
    }

    // GET /api/subasta/pujas/{id}
// GET /api/subasta/pujas/{id}
    public function pujas($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            
            // Traemos las pujas del modelo
            $result = $subastaM->pujas($id);
            
          
            if (empty($result)) {
                // Imprimimos el éxito manualmente y matamos el proceso
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "status" => 200,
                    "data" => [],
                    "message" => "Historial de pujas (vacío)"
                ]);
                exit; // Detiene la ejecución para que la clase Response no interfiera
            }
            
            // Si SÍ hay pujas, dejamos que la clase Response haga su trabajo normal
            $response->status(200)->toJSON($result, "Historial de pujas");
            
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error al cargar pujas: " . $e->getMessage());
        }
    }

    public function getAutosDisponibles($id_vendedor) {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->getAutosDisponibles($id_vendedor);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
        }
    }

    // GET /api/subasta/canceladas
    public function canceladas()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->canceladas();
            $response->status(200)->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
        }
    }
    // GET /api/subasta/borradores
    public function borradores()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->borradores();
            $response->status(200)->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
        }
    }
    public function create() {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            
            $subastaM->create($data);
            $response->status(200)->toJSON();
        } catch (Exception $e) {
            $response->status(500)->toJSON([], $e->getMessage());
        }
    }

    public function update($id) {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            
            $subastaM->update($id, $data);
            $response->status(200)->toJSON([], "Subasta actualizada exitosamente.");
        } catch (Exception $e) {
            $response->status(500)->toJSON([], $e->getMessage());
        }
    }

    public function publish($id) {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $subastaM->publish($id);
            $response->status(200)->toJSON([], "Subasta publicada exitosamente.");
        } catch (Exception $e) {
            $response->status(500)->toJSON([], $e->getMessage());
        }
    }

    public function cancel($id) {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $subastaM->cancel($id);
            $response->status(200)->toJSON([], "Subasta cancelada exitosamente.");
        } catch (Exception $e) {
            $response->status(500)->toJSON([], $e->getMessage());
        }
    }
}
?>