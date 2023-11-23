import { backend } from '../../../../config/config';

const API = backend+'/usuario/crear';

interface Usuario {
 cedula: number;
 nombre: string;
 apellidos: string;
 telefono: number;
 email: string;
 rol: string;
 estado: string;
 contrasena: string;
}

export const Singup = (usuario: Usuario) =>
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            'content-type': 'application/json',
        },
        
});
