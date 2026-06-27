import { useState } from 'react';
import { 
  updateProfile, 
  updateEmail, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Lock, 
  Mail, 
  Save, 
  Loader2,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export function AdminProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Accordion state
  const [openSection, setOpenSection] = useState<'basic' | 'security'>('basic');

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      let needsReauth = false;
      const isEmailChanged = formData.email !== user.email && formData.email.trim() !== '';
      const isPasswordChanged = formData.newPassword.trim() !== '';

      if (isEmailChanged || isPasswordChanged) {
        if (!formData.currentPassword) {
          toast('Você precisa informar sua senha atual para alterar o e-mail ou a senha.', 'warning');
          setLoading(false);
          return;
        }
        if (isPasswordChanged && formData.newPassword !== formData.confirmPassword) {
          toast('A nova senha e a confirmação não coincidem.', 'warning');
          setLoading(false);
          return;
        }
        needsReauth = true;
      }

      // 1. Atualizar Display Name
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }

      // 2. Reautenticar se necessário para dados sensíveis
      if (needsReauth && user.email) {
        const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // 3. Atualizar Email
        if (isEmailChanged) {
          await updateEmail(user, formData.email);
        }

        // 4. Atualizar Senha
        if (isPasswordChanged) {
          await updatePassword(user, formData.newPassword);
        }
      }

      toast('Perfil atualizado com sucesso!', 'success');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        toast('A senha atual está incorreta.', 'error');
      } else if (err.code === 'auth/email-already-in-use') {
        toast('Este e-mail já está sendo usado.', 'error');
      } else if (err.code === 'auth/weak-password') {
        toast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
      } else {
        toast(err.message || 'Erro ao atualizar o perfil.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>
        <p className="text-sm text-slate-500">Gerencie suas credenciais de acesso ao painel de administração</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Accordion 1: Basic Info */}
        <div className="border-b border-slate-100">
          <button 
            type="button"
            onClick={() => setOpenSection(openSection === 'basic' ? '' as any : 'basic')}
            className="w-full px-6 py-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informações Básicas</h2>
            </div>
            {openSection === 'basic' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {openSection === 'basic' && (
            <div className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nome de Exibição</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Ex: João Silva"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Security */}
        <div>
          <button 
            type="button"
            onClick={() => setOpenSection(openSection === 'security' ? '' as any : 'security')}
            className="w-full px-6 py-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors focus:outline-none border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Segurança e Senha</h2>
            </div>
            {openSection === 'security' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {openSection === 'security' && (
            <div className="p-6 pt-4">
              <p className="text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Preencha os campos abaixo apenas se desejar <strong className="text-slate-700">alterar sua senha</strong> ou se alterou seu <strong className="text-slate-700">e-mail</strong> acima.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-red-600">
                    Senha Atual (Obrigatória para mudanças sensíveis)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="password"
                      name="currentPassword"
                      autoComplete="current-password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Sua senha atual"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-red-100 focus:border-red-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        name="newPassword"
                        autoComplete="new-password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Deixe em branco para manter"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Confirmar Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repita a nova senha"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={handleUpdateProfile}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

      </div>
    </div>
  );
}
