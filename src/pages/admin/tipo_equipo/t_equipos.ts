import { backend } from '../../../../config/config';

const API = backend + '/tipo-equipo/crear';

interface Usuario {
    descripcion: string;
}

export const Crear_rol = (usuario: Usuario) =>
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            'content-type': 'application/json',
        },

    });


export async function obtenerRol() {
    const url = backend + '/tipo-equipo/obtener';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de equipos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener equipo: ${error}`);
    }
}

export async function eliminar(id: number) {
    const response = await fetch(`${backend}/tipo-equipo/eliminar/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el equipo');
    }
}

export async function editar(id: number, usuario: Usuario) {
    const response = await fetch(`${backend}/tipo-equipo/actualizar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(usuario),
        headers: {
            'content-type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el equipo');
    }
}   