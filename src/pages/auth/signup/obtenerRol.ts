import { backend } from '../../../../config/config';

export async function obtenerRol() {
    const url = backend+'/rol/obtener';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de roles');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener roles: ${error}`);
    }
}