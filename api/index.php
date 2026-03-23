<?php
// 1. Cabeceras CORS (Indispensables para React y Postman)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

// 2. Manejo de Preflight (Evita que la página se caiga al recibir peticiones OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Carga de dependencias (Asegúrate de que la carpeta vendor existe)
if (file_exists('vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
}

/* --- Requerimientos del Núcleo (Core) --- */
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";

/* --- Middleware --- */
require_once "middleware/AuthMiddleware.php";

/* --- Carga de Modelos --- */
require_once "models/UserModel.php";
require_once "models/AutoModel.php";
require_once "models/SubastaModel.php";

/* --- Carga de Controladores --- */
require_once "controllers/UserController.php";
require_once "controllers/AutoController.php";
require_once "controllers/SubastaController.php";

/* --- Enrutador --- */
require_once "routes/RoutesController.php";

try {
    $index = new RoutesController();
    $index->index();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error crítico: " . $e->getMessage()]);
}