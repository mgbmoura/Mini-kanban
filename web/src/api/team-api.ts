
import api from './axios-config';

// A interface User representa o modelo básico de usuário.
export interface User {
  id: string;
  name: string;
  email: string;
}

// A interface TeamMember herda as propriedades de User e adiciona a role.
export interface TeamMember extends User {
  role: 'Admin' | 'Member';
}

/**
 * API SERVICE: Team
 * Centraliza todas as operações de banco de dados relacionadas à equipe.
 */
export const teamApi = {
  /**
   * Busca todos os membros da equipe.
   * @returns Uma promessa que resolve para um array de TeamMember.
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await api.get('/team');
    return response.data;
  },

  /**
   * Convida um novo membro para a equipe usando o email.
   * @param email O email do usuário a ser convidado.
   * @returns Uma promessa que resolve para o novo TeamMember criado.
   */
  async inviteMember(email: string): Promise<TeamMember> {
    const response = await api.post('/team/invite', { email });
    return response.data;
  },
};
