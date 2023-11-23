import { backend } from '../../../../config/config';

const API = backend + '/rol/crear';

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
    const url = backend + '/rol/obtener';

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

export async function eliminar(id: number) {
    const response = await fetch(`${backend}/rol/eliminar/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el rol');
    }
}

export async function editar(id: number, usuario: Usuario) {
    const response = await fetch(`${backend}/rol/actualizar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(usuario),
        headers: {
            'content-type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el rol');
    }
}