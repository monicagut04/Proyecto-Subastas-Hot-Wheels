<?php
//Cargar todos los paquetes
require_once "vendor/autoload.php";

use Firebase\JWT\JWT;

class user{


public function index()
    {
        try {
            $response = new Response();
            $userM = new UserModel();
            
            // Llamamos al método all() del modelo
            $result = $userM->all();
            
            // Entregamos la respuesta exitosa en formato JSON
            $response->toJSON($result);
            
        } catch (Exception $e) {
            $response->status(500)->toJSON([], "Error en el servidor: " . $e->getMessage());
            
            // Registramos el error en tu Logger
            handleException($e);
        }
    }



public function get($id)
    {
        try {
            $response = new Response();
            $userM = new UserModel();
            
            // Llamamos al método get() del modelo pasándole el ID solicitado
            $result = $userM->get($id);
            
            if($result) {
                // Si la consulta devolvió datos, respondemos con éxito
                $response->toJSON($result);
            } else {
                // Si el ID no existe en la base de datos, devolvemos un código 404
                $response->status(404)->toJSON([], "Usuario no encontrado");
            }
            
        } catch (Exception $e) {
            $response->status(500)->toJSON([], "Error en el servidor: " . $e->getMessage());
            
            handleException($e);
        }
    }


public function update($id)
    {
        try {
            $response = new Response();
            $userM = new UserModel();
            
            // Leemos el JSON que envía React
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            
            // Validación de backend (Obligatorio en la rúbrica)
            if(empty($data->nombre_completo) || empty($data->correo_electronico)) {
                $response->status(400)->toJSON([], "El nombre y el correo son obligatorios.");
                return;
            }
            
            $userM->update($id, $data);
            $response->status(200)->toJSON([], "Perfil actualizado correctamente");
            
        } catch (Exception $e) {
            $response->status(500)->toJSON([], "Error en el servidor: " . $e->getMessage());
            handleException($e);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $response = new Response();
            $userM = new UserModel();
            
            $userM->toggleStatus($id);
            $response->status(200)->toJSON([], "Estado del usuario modificado con éxito");
            
        } catch (Exception $e) {
            $response->status(500)->toJSON([], "Error en el servidor: " . $e->getMessage());
            handleException($e);
        }
    }














}
?>