import { backend } from '../../../../config/config';

const API = backend + '/estado-prestamo/crear';

interface EstadoPrestamo {
    descripcion: string;
    id?: number;
}

export const Crear_estado = (estadoPrestamo: EstadoPrestamo) =>
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(estadoPrestamo),
        headers: {
            'content-type': 'application/json',
        },
    });

export async function obtener_estados() {
    const url = backend + '/estado-prestamo/obtener';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de estado prestamos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener estado prestamo: ${error}`);
    }
}

export async function eliminar(id: number) {
    const url = `${backend}/estado-prestamo/eliminar/${id}`;

    try {
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('No se pudo eliminar el estado prestamo');
        }
    } catch (error) {
        throw new Error(`Error al eliminar estado prestamo: ${error}`);
    }
}

export async function editar(id: number, estadoPrestamo: EstadoPrestamo) {
    const url = `${backend}/estado-prestamo/actualizar/${id}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(estadoPrestamo),
            headers: {
                'content-type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('No se pudo actualizar el estado prestamo');
        }
    } catch (error) {
        throw new Error(`Error al actualizar estado prestamo: ${error}`);
    }
}
