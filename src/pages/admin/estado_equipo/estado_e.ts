import { backend } from '../../../../config/config';

const API = backend + '/estado-equipos/crear';

interface Usuario {
    descripcion: string;
}

export const Crear_estado = (usuario: Usuario) =>
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            'content-type': 'application/json',
        },

    });


export async function obtener_estados() {
    const url = backend + '/estado-equipos/obtener';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de estado equipos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener estado equipo: ${error}`);
    }
}

export async function eliminar(id: number) {
    const response = await fetch(`${backend}/estado-equipos/eliminar/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el estado equipo');
    }
}
export async function editar(id: number, usuario: Usuario) {
    try {
        const response = await fetch(`${backend}/estado-equipos/actualizar/${id}`, {
            method: 'PUT',
            body: JSON.stringify(usuario),
            headers: {
                'content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error updating estado equipo. Server response: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error updating estado equipo:', error);
        throw new Error('Failed to update estado equipo. Please try again.');
    }
}
