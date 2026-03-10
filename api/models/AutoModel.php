<?php
class AutoModel{
    public $enlace;
    public function __construct(){
        $this->enlace=new MySqlConnect();
    }

public function all()
    {
        // 1. Consulta SIMPLE solo a la tabla autos
        $vSql = "SELECT id_auto, id_vendedor,nombre_modelo, estado_actual 
                FROM autos 
                ORDER BY fecha_registro asc;";
        
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // 2. Recorremos los autos uno por uno para agregarle sus detalles
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) { 
                
                $id_auto = $vResultado[$i]->id_auto;
                $id_vendedor = $vResultado[$i]->id_vendedor;

                // --- Buscar el nombre del dueño ---
                $sqlVendedor = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $id_vendedor";
                $vendedor = $this->enlace->ExecuteSQL($sqlVendedor);
                // Si encontró al vendedor, asignamos el nombre. Si no, ponemos "Desconocido".
                $vResultado[$i]->propietario = !empty($vendedor) ? $vendedor[0]->nombre_completo : "Desconocido";

                // --- Buscar la imagen de portada ---
                $sqlImagen = "SELECT nombre_imagen FROM imagenes WHERE id_auto = $id_auto AND es_portada = 1";
                $imagen = $this->enlace->ExecuteSQL($sqlImagen);
                // Si tiene imagen, se la agregamos. Si no, va nulo.
                $vResultado[$i]->imagen_principal = !empty($imagen) ? $imagen[0]->nombre_imagen : null;
            }
        }

        return $vResultado;
    }

    /**
     * Detalle de un Objeto (Auto)
     * Requisito: Info completa, todas las imágenes, categorías y subastas donde participó.
     */
    public function get($id)
    {
        // 1. Consulta SIMPLE para traer los datos básicos del auto
        $vSql = "SELECT * FROM autos WHERE id_auto = $id;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Si el auto existe, le agregamos el resto de información
        if (!empty($vResultado)) {
            $auto = $vResultado[0];

            // 2. Buscar el nombre del propietario
            $sqlVendedor = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $auto->id_vendedor";
            $vendedor = $this->enlace->ExecuteSQL($sqlVendedor);
            $auto->propietario = !empty($vendedor) ? $vendedor[0]->nombre_completo : "Desconocido";

            // 3. Buscar TODAS sus imágenes
            $sqlImagenes = "SELECT nombre_imagen, es_portada FROM imagenes WHERE id_auto = $id";
            $auto->imagenes = $this->enlace->ExecuteSQL($sqlImagenes);

            // 4. Buscar Categorías (Usamos una subconsulta simple con IN)
            $sqlColecciones = "SELECT nombre_serie FROM colecciones 
                            WHERE id_coleccion IN (SELECT id_coleccion FROM auto_colecciones WHERE id_auto = $id)";
            $auto->categorias = $this->enlace->ExecuteSQL($sqlColecciones);

            // 5. Buscar el historial de subastas (Requisito de la rúbrica)
            $sqlSubastas = "SELECT id_subasta, fecha_inicio, fecha_fin, estado 
                            FROM subastas 
                            WHERE id_auto = $id 
                            ORDER BY fecha_inicio asc;";
            $auto->historial_subastas = $this->enlace->ExecuteSQL($sqlSubastas);

            return $auto;
        } else {
            return null;
        }
    }


}
?>