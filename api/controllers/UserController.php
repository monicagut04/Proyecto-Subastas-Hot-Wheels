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

















}
?>