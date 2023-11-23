import { backend } from '../../../../config/config';

const API = backend + '/equipo/crear';

interface Equipo {
    serial: string;
    tipo: number;
    referencia: string;
    codigo: string;
    estado: number;
}

export const Crear = (equipo: Equipo) =>
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(equipo),
        headers: {
            'content-type': 'application/json',
        },

    });


export async function obtener() {
    const url = backend + '/equipo/obtener';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de equipos');
        }
        const data = await response.json();

        // Map the response data to the Equipo interface
        const equipos = data.map((item: any) => ({
            serial: item.serial,
            tipo: item.tipo ? { id: item.tipo.id, descripcion: item.tipo.descripcion } : null,
            estado: item.estado ? { id: item.estado.id, descripcion: item.estado.descripcion } : null,
            referencia: item.referencia,
            codigo: item.codigo,
        }));

        return equipos;
    } catch (error) {
        throw new Error(`Error al obtener equipo: ${error}`);
    }
}


export async function eliminar(serial: string) {
    const response = await fetch(`${backend}/equipo/eliminar/${serial}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el equipo');
    }
}

export async function editar(serial: string, equipo: Equipo) {
    try {
        const response = await fetch(`${backend}/equipo/actualizar/${serial}`, {
            method: 'PUT',
            body: JSON.stringify(equipo),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Error al actualizar el equipo: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error al actualizar el equipo: ${error.message}`);
    }
}
 

export async function obtenertipoequipo() {
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

export async function obtenerestadoequipos() {
    const url = backend + '/estado-equipos/obtener';

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