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

        // Si no hay al menos controlador
        if (empty($routesArray[0])) {
            $json = [
                "success" => false,
                "status"  => 404,
                "message" => 'Controlador no especificado'
            ];
            echo json_encode($json, http_response_code($json["status"]));
            return;
        }

        $controller = $routesArray[0] ?? null;
        $action     = $routesArray[1] ?? null;
        $param1     = $routesArray[2] ?? null;
        $param2     = $routesArray[3] ?? null;
        // echo "Controller: " . $controller . ", acción: " . $action . ", param1: " . $param1 . ", param2: " . $param2;

        try {
            if ($controller && class_exists($controller)) {
                $response = new $controller();

                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':
                        if ($action && is_numeric($action)) {
                            // URL del tipo /movie/1
                            $response->get($action);
                        } elseif ($action && method_exists($response, $action)) {
                            // URL del tipo /movie/recent, /movie/search, etc.
                            if ($param1 && $param2) {
                                // URL con dos parámetros → /movie/search/2023/drama
                                $response->$action($param1, $param2);
                            } elseif ($param1) {
                                // URL con un parámetro → /movie/search/2023
                                $response->$action($param1);
                            } else {
                                // URL sin parámetros → /movie/recent
                                $response->$action();
                            }
                        } elseif (!$action) {
                            // URL del tipo /movie
                            $response->index();
                        } else {
                            $json = [
                                "success" => false,
                                "status"  => 404,
                                "message" => 'Acción no encontrada'
                            ];
                            echo json_encode($json, http_response_code($json["status"]));
                        }
                        break;

                    case 'POST':
                        // 🌟 CORRECCIÓN: Ahora verificamos si existen parámetros y se los pasamos al método correspondiente
                        if ($action && method_exists($response, $action)) {
                            if ($param1 && $param2) {
                                $response->$action($param1, $param2);
                            } elseif ($param1) {
                                $response->$action($param1);
                            } else {
                                $response->$action();
                            }
                        } else {
                            $response->create();
                        }
                        break;

                    case 'PUT':
                    case 'PATCH':
                        if ($action && method_exists($response, $action)) {
                            if ($param1 && $param2) {
                                $response->$action($param1, $param2);
                            } elseif ($param1) {
                                $response->$action($param1);
                            } else {
                                $response->$action();
                            }
                        } 
                        // Si no hay acción específica, usamos el comportamiento REST por defecto (update)
                        elseif ($param1) {
                            $response->update($param1);
                        } else {
                            $response->update();
                        }
                        break;

                    case 'DELETE':
                        if ($param1) {
                            $response->delete($param1);
                        } elseif ($action && method_exists($response, $action)) {
                            $response->$action();
                        } else {
                            $response->delete();
                        }
                        break;

                    default:
                        $json = [
                            "success" => false,
                            "status"  => 405,
                            "message" => 'Método HTTP no permitido'
                        ];
                        echo json_encode($json, http_response_code($json["status"]));
                        break;
                }

            } else {
                $json = [
                    "success" => false,
                    "status"  => 404,
                    "message" => 'Controlador no encontrado'
                ];
                echo json_encode($json, http_response_code($json["status"]));
            }
        } catch (\Throwable $th) {
            $json = ['status' => 500, 'result' => $th->getMessage()];
            echo json_encode($json, http_response_code($json["status"]));
        }
    }
}