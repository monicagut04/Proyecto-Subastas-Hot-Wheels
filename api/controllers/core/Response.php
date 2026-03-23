<?php

class Response
{
    private $status = 200;

    public function status(int $code)
    {
        $this->status = $code;
        return $this;
    }

    public function toJSON($response = [], $message = "")
    {
        // 1. Caso de Éxito (Si el status es 200-299)
        if ($this->status >= 200 && $this->status < 300) {
            
            // Garantizamos que si no hay datos, envíe un arreglo vacío en lugar de null.
            // Esto evita que React (.map) tire errores.
            $data = empty($response) ? [] : $response;

            $json = [
                "success" => true,
                "status"  => $this->status,
                "message" => $message ?: "Solicitud exitosa",
                "data"    => $data
            ];
        } 
        // 2. Caso de No Encontrado (Solo si el controlador explícitamente pide un 404)
        elseif ($this->status === 404) {
            $json = [
                "success" => false,
                "status"  => 404,
                "message" => $message ?: "Recurso no encontrado",
                "error"   => [
                    "code" => "NOT_FOUND",
                    "details" => "El recurso solicitado no existe o fue eliminado."
                ]
            ];
        } 
        // 3. Caso de Errores Generales (400 Bad Request, 500 Internal Error, etc.)
        else {
            $json = [
                "success" => false,
                "status"  => $this->status,
                "message" => $message ?: "Error al procesar la solicitud",
                "error"   => [
                    "code" => "HTTP_ERROR_" . $this->status,
                    "details" => "Revisa los parámetros de la petición o las reglas de negocio."
                ]
            ];
        }

        // Emitimos la respuesta
        http_response_code($this->status);
        echo json_encode($json, JSON_UNESCAPED_UNICODE);
        exit; // Buena práctica: detener cualquier otra ejecución de PHP después de enviar JSON
    }
}