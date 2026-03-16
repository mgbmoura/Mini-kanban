import { useState, useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { teamService, TeamMember } from '../../services/teamService';
import { TeamSkeleton } from '../../components/TeamSkeleton';
import { InviteMemberModal } from '../../components/InviteMemberModal';

export function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        const members = await teamService.getTeamMembers();
        setTeamMembers(members);
      } catch (err) {
        setError('Falha ao carregar a equipe.');
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  const handleInviteMember = async (email: string) => {
    try {
      const newMember = await teamService.inviteMember(email);
      setTeamMembers(currentMembers => [...currentMembers, newMember]);
    } catch (err: any) {
      // O erro será exibido no modal, mas também o passamos para cima caso seja necessário.
      throw err;
    }
  };
  
  const getInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (initials: string): string => {
    const colors = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#fb923c'];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return <TeamSkeleton />;
  }

  return (
    <>
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-violet-500" />
            <h1 className="text-2xl font-semibold text-gray-100">Equipe</h1>
          </div>
          <p className="text-sm text-gray-400">Gerencie os membros da sua equipe e suas permissões.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-300">Membros ({teamMembers.length})</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Convidar Membro
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-[#262637] transition-colors hover:bg-[#2f2f41]">
                <div className="flex items-center gap-4">
                   <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-violet-500/50"
                    style={{ backgroundColor: getAvatarColor(getInitials(member.name)), color: '#1a1a27' }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${member.role === 'Admin' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInviteMember}
      />
    </>
  );
}
