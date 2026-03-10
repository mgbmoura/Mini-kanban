import { User } from '../models/User';
import crypto from 'crypto';

// Simulação de uma base de dados de utilizadores em memória
const users: User[] = [
    {
        id: 'user-1',
        name: 'João Desenvolvedor',
        email: 'joao.dev@example.com',
    }
];

// Função para gerar o URL do Gravatar
function getGravatarUrl(email: string): string {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('md5').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=retro`;
}

export const authService = {
    // Método para obter um utilizador (simulando um login)
    getUserById: (userId: string): (User & { gravatarUrl: string }) | undefined => {
        const user = users.find(u => u.id === userId);
        if (user) {
            // Anexar o URL do Gravatar ao objeto do utilizador
            return {
                ...user,
                gravatarUrl: getGravatarUrl(user.email),
            };
        }
        return undefined;
    },

    // Simplesmente retorna o primeiro utilizador para este exemplo
    // Numa aplicação real, isto seria baseado no login
    getCurrentUser: (): (User & { gravatarUrl: string }) => {
        const user = users[0];
        return {
            ...user,
            gravatarUrl: getGravatarUrl(user.email),
        };
    }
};