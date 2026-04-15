import { useState } from 'react';
import { X, Mail } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
}

export function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('O email é obrigatório.');
      return;
    }
    
    setError(null);
    setIsInviting(true);
    try {
      await onInvite(email);
      setEmail('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao convidar o membro.');
    } finally {
      setIsInviting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800 w-full max-w-md mx-4 shadow-xl animate-in fade-in-0 zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-100">Convidar Membro</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleInvite}>
          <p className="text-sm text-gray-400 mb-4">
            O membro da equipe receberá um convite por email para se juntar ao seu espaço de trabalho.
          </p>
          
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: nome@dominio.com"
              className="w-full pl-11 pr-4 py-2.5 bg-[#262637] border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>

          {error && (
             <p className="text-red-400 text-sm mt-2">{error}</p>
          )}

          <div className="flex justify-end gap-4 mt-6 border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isInviting}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isInviting ? 'Enviando Convite...' : 'Enviar Convite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}