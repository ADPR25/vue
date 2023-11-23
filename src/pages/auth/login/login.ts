import { backend } from '../../../../config/config';

const API = backend+'/usuario/login';

interface Usuario {
    cedula: number;
    contrasena: string;
}

export const Login = (usuario: Usuario) =>
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            'content-type': 'application/json',
        },
        
});
