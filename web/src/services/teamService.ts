
// Importa o authService e o tipo User dos locais corretos.
import { authService } from './authService';
import { User } from '../types/user';

// A interface TeamMember herda as propriedades de User e adiciona a role.
export interface TeamMember extends User {
  role: 'Admin' | 'Member';
}

// Dados simulados
const getInitialTeam = (): TeamMember[] => {
  const currentUser = authService.getUser();
  const team: TeamMember[] = [
    {
      id: currentUser?.id || '1',
      name: currentUser?.name || 'Admin User',
      email: currentUser?.email || 'admin@example.com',
      role: 'Admin',
    },
    {
      id: '2',
      name: 'Carla Silva',
      email: 'carla.silva@example.com',
      role: 'Member',
    },
  ];
  return team;
};

const getTeamFromStorage = (): TeamMember[] => {
  const storedTeam = localStorage.getItem('team_members');
  return storedTeam ? JSON.parse(storedTeam) : getInitialTeam();
};

const saveTeamToStorage = (team: TeamMember[]) => {
  localStorage.setItem('team_members', JSON.stringify(team));
};

// Inicializa o time se não existir
if (!localStorage.getItem('team_members')) {
  saveTeamToStorage(getInitialTeam());
}

export const teamService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return getTeamFromStorage();
  },

  async inviteMember(email: string): Promise<TeamMember> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingTeam = getTeamFromStorage();
    
    // Verifica se o email já existe
    if (existingTeam.some(member => member.email === email)) {
      throw new Error('Este email já pertence a um membro da equipe.');
    }

    const newMember: TeamMember = {
      id: new Date().toISOString(),
      name: email.split('@')[0], // Nome temporário
      email: email,
      role: 'Member',
    };

    const updatedTeam = [...existingTeam, newMember];
    saveTeamToStorage(updatedTeam);
    return newMember;
  },
};
