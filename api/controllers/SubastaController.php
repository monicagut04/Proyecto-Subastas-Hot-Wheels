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
    public function pujas($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->pujas($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON([], "Error: " . $e->getMessage());
            handleException($e);
        }
    }
}
?>