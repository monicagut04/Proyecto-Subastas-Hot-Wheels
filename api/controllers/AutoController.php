<?php
class auto {
    
    // 1. Listado completo
    public function index() {
        try {
            $autoM = new AutoModel();
            $result = $autoM->all();
            (new Response())->toJSON($result); // 💡 Nota: Asegúrate que tu clase Response no ocupe un 'return'
        } catch (\Throwable $e) {
            (new Response())->status(500)->toJSON([], $e->getMessage());
        }
    }

    // 2. Detalle de un auto
    public function get($id) {
        try {
            $autoM = new AutoModel();
            $result = $autoM->get($id);
            if ($result) {
                (new Response())->toJSON($result);
            } else {
                (new Response())->status(404)->toJSON([], "La pieza no existe");
            }
        } catch (\Throwable $e) {
            (new Response())->status(500)->toJSON([], $e->getMessage());
        }
    }

    // 3. Crear (POST)
    public function create() {
        try {
            $autoM = new AutoModel();
            // Pasamos $_POST porque ahí vienen los textos del FormData
            $result = $autoM->create($_POST); 
            (new Response())->status(201)->toJSON($result, "¡Hot Wheel registrado!");
        } catch (\Throwable $e) {
            (new Response())->status(400)->toJSON([], $e->getMessage());
        }
    }

    // 4. Actualizar (POST via /update/id)
    public function update($id) {
        try {
            $autoM = new AutoModel();
            // Usamos $_POST porque React envía FormData
            $result = $autoM->update($id, $_POST);
            
            (new Response())->toJSON($result, "Registro actualizado correctamente");
        } catch (\Throwable $e) {
            (new Response())->status(400)->toJSON([], $e->getMessage());
        }
    }

    // 5. Eliminar / Desactivar (POST via /delete/id)
    public function delete($id) {
        try {
            $autoM = new AutoModel();
            $result = $autoM->delete($id);
            
            // Si todo sale bien
            (new Response())->toJSON($result, "Pieza removida del catálogo.");
        } catch (\Throwable $e) {
            // Si el modelo lanza el "throw new Exception",
            // el controlador lo atrapa aquí y se lo manda a React como error.
            (new Response())->status(400)->toJSON(false, $e->getMessage());
        }
    }

    // 6. Cambiar Estado (GET via /toggle/id)
    public function toggle($id) {
        try {
            $autoM = new AutoModel();
            $result = $autoM->toggleStatus($id);
            
            (new Response())->toJSON($result, "Ciclo de estado actualizado");
        } catch (\Throwable $e) {
            (new Response())->status(400)->toJSON([], $e->getMessage());
        }
    }
}