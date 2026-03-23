<?php
class RoutesController {
    public function index() {
        // 1. Limpieza y preparación de la ruta
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $baseFolder = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
        
        if ($baseFolder !== '/' && stripos($requestUri, $baseFolder) === 0) {
            $requestUri = substr($requestUri, strlen($baseFolder));
        }

        $routesArray = explode("/", trim($requestUri, "/"));
        $method = $_SERVER['REQUEST_METHOD'];

        // Manejo de CORS (Preflight)
        if ($method === 'OPTIONS') { 
            http_response_code(200); 
            exit(); 
        }

        // 2. Identificar: Recurso (ctrl), Acción (método) e ID
        $ctrlName  = $routesArray[0] ?? null; 
        $urlAction = $routesArray[1] ?? null; 
        $urlId     = $routesArray[2] ?? null;

        try {
            // 💡 MAGIA DINÁMICA: ¿Existe la clase (user, auto, subasta)?
            if ($ctrlName && class_exists($ctrlName)) {
                $response = new $ctrlName();

                // --- MANEJO DE GET ---
                if ($method === 'GET') {
                    // Si la acción es un número (ej: /user/5), es el detalle
                    if (is_numeric($urlAction)) {
                        $response->get($urlAction);
                    } 
                    // Si la acción es un nombre de método (ej: /auto/toggle/5)
                    elseif ($urlAction && method_exists($response, $urlAction)) {
                        $response->$urlAction($urlId);
                    } 
                    // Por defecto, el listado general
                    else {
                        $response->index();
                    }
                } 
                
                // --- MANEJO DE POST (Crear, Update, Delete) ---
                elseif ($method === 'POST') {
                    // Si existe el método (update o delete) y hay un ID
                    if ($urlAction && method_exists($response, $urlAction)) {
                        $response->$urlAction($urlId);
                    } 
                    // Si no hay acción específica, es una creación nueva
                    else {
                        $response->create();
                    }
                }
                
                // --- MANEJO DE PUT/DELETE (Opcional, por si no usas el "Fake POST") ---
                elseif ($method === 'PUT' || $method === 'DELETE') {
                    $id = is_numeric($urlAction) ? $urlAction : $urlId;
                    $methodLower = strtolower($method);
                    if (method_exists($response, $methodLower)) {
                        $response->$methodLower($id);
                    }
                }

            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "El recurso '$ctrlName' no existe."]);
            }
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error de sistema: " . $th->getMessage(),
                "file" => basename($th->getFile()),
                "line" => $th->getLine()
            ]);
        }
    }
}