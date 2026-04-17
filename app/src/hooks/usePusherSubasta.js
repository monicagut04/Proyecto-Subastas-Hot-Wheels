import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export const usePusherSubasta = (idSubasta, initialPujas) => {
    const [pujas, setPujas] = useState(initialPujas || []);
    const [pujaSuperada, setPujaSuperada] = useState(false);

    useEffect(() => {
        // 1. Configurar conexión
        const pusher = new Pusher('9b16fa4e7553c608d8cc', {
            cluster: 'us2' // Debe coincidir con el backend
        });

        // 2. Suscribirse al canal específico de la subasta
        const channel = pusher.subscribe(`subasta-${idSubasta}`);
        
        // 3. Escuchar eventos de nueva puja
        channel.bind('nueva-puja', function(data) {
            setPujas(prevPujas => {
                const nuevasPujas = [data, ...prevPujas];
                return nuevasPujas;
            });
            // La notificación de puja superada se evaluará en el componente visual
        });

        // Limpieza al desmontar (Buenas prácticas de memoria)
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [idSubasta]);

    return { pujas, setPujas, pujaSuperada, setPujaSuperada };
};